import sys
try:
    if hasattr(sys.stdout, "reconfigure"):
        sys.stdout.reconfigure(encoding="utf-8")
    if hasattr(sys.stderr, "reconfigure"):
        sys.stderr.reconfigure(encoding="utf-8")
except Exception:
    pass

from fastapi import FastAPI, APIRouter, Header, HTTPException, Depends, Request, UploadFile, File
from fastapi.staticfiles import StaticFiles
from dotenv import load_dotenv
from starlette.middleware.cors import CORSMiddleware
from motor.motor_asyncio import AsyncIOMotorClient
import os
import logging
import json
import shutil
from pathlib import Path
from pydantic import BaseModel, Field, ConfigDict
from typing import List
import uuid
import hashlib
import random
from datetime import datetime, timezone, timedelta
from jose import jwt, JWTError
from zoneinfo import ZoneInfo
import requests
from timezonefinder import TimezoneFinder
import libephemeris as swe
from report_templates import build_personalized_section


# Initialize timezone finder globally
tf_finder = TimezoneFinder()

import razorpay

RAZORPAY_KEY_ID = os.environ.get("RAZORPAY_KEY_ID", "rzp_test_dummyKey")
RAZORPAY_KEY_SECRET = os.environ.get("RAZORPAY_KEY_SECRET", "dummySecret")

try:
    razorpay_client = razorpay.Client(auth=(RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET))
except Exception as e:
    logger.error(f"Failed to initialize Razorpay Client: {e}")
    razorpay_client = None

ZODIAC_MAP = {
    "Aries": "Mesha (Aries)",
    "Taurus": "Vrishabha (Taurus)",
    "Gemini": "Mithuna (Gemini)",
    "Cancer": "Karka (Cancer)",
    "Leo": "Simha (Leo)",
    "Virgo": "Kanya (Virgo)",
    "Libra": "Tula (Libra)",
    "Scorpio": "Vrischika (Scorpio)",
    "Sagittarius": "Dhanu (Sagittarius)",
    "Capricorn": "Makara (Capricorn)",
    "Aquarius": "Kumbha (Aquarius)",
    "Pisces": "Meena (Pisces)"
}

LAGNA_MAP = {
    "Aries": "Aries (Mesha)",
    "Taurus": "Taurus (Vrishabha)",
    "Gemini": "Gemini (Mithuna)",
    "Cancer": "Cancer (Karka)",
    "Leo": "Leo (Simha)",
    "Virgo": "Virgo (Kanya)",
    "Libra": "Libra (Tula)",
    "Scorpio": "Scorpio (Vrischika)",
    "Sagittarius": "Sagittarius (Dhanu)",
    "Capricorn": "Capricorn (Makara)",
    "Aquarius": "Aquarius (Kumbha)",
    "Pisces": "Pisces (Meena)"
}

ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

VEDASTRO_NAKSHATRAS = [
    "Aswini", "Bharani", "Krithika", "Rohini", "Mrigashira", "Ardra", 
    "Punarvasu", "Pushya", "Aslesha", "Makha", "Purvaphalguni", "Uttaraphalguni", 
    "Hasta", "Chitta", "Swathi", "Vishhaka", "Anuradha", "Jyeshta", 
    "Moola", "Poorvashada", "Uttarashada", "Sravana", "Dhanishta", 
    "Sathabhisha", "Purvabhadra", "Uttarabhadra", "Revathi"
]

def get_zodiac_sign(lon_deg: float) -> str:
    idx = int((lon_deg % 360.0) / 30.0)
    return ZODIAC_SIGNS[idx]

def get_nakshatra(lon_deg: float) -> str:
    nak_width = 360.0 / 27.0
    nak_idx = int((lon_deg % 360.0) / nak_width)
    pada_width = nak_width / 4.0
    pada = int(((lon_deg % 360.0) % nak_width) / pada_width) + 1
    return f"{VEDASTRO_NAKSHATRAS[nak_idx]} - {pada}"

def get_julday_ut(dt: datetime, offset_str: str) -> float:
    sign = 1
    if offset_str.startswith("-"):
        sign = -1
        offset_str = offset_str[1:]
    elif offset_str.startswith("+"):
        offset_str = offset_str[1:]
        
    parts = offset_str.split(":")
    hours = int(parts[0])
    minutes = int(parts[1]) if len(parts) > 1 else 0
    
    tz = timezone(timedelta(hours=sign*hours, minutes=sign*minutes))
    dt_aware = dt.replace(tzinfo=tz)
    dt_utc = dt_aware.astimezone(timezone.utc)
    
    ut_hour = dt_utc.hour + dt_utc.minute / 60.0 + dt_utc.second / 3600.0 + dt_utc.microsecond / 3600000000.0
    
    return swe.julday(dt_utc.year, dt_utc.month, dt_utc.day, ut_hour)

def geocode_place(pob: str) -> tuple[float, float]:
    if not pob:
        return 28.6139, 77.2090
    try:
        url = "https://nominatim.openstreetmap.org/search"
        response = requests.get(
            url,
            params={"q": pob, "format": "json", "limit": 1},
            headers={"User-Agent": "AstroPowerApp/1.0"},
            timeout=5
        )
        if response.status_code == 200 and response.json():
            data = response.json()[0]
            return float(data["lat"]), float(data["lon"])
    except Exception as e:
        logger.error(f"Geocoding failed for {pob}: {e}")
    return 28.6139, 77.2090 # Default fallback

def get_timezone_offset(lat: float, lon: float, dt: datetime) -> str:
    try:
        tz_name = tf_finder.timezone_at(lat=lat, lng=lon)
        if tz_name:
            dt_tz = dt.replace(tzinfo=ZoneInfo(tz_name))
            offset = dt_tz.utcoffset()
            if offset is not None:
                total_seconds = int(offset.total_seconds())
                sign = "+" if total_seconds >= 0 else "-"
                minutes = abs(total_seconds) // 60
                hours = minutes // 60
                minutes_rem = minutes % 60
                return f"{sign}{hours:02d}:{minutes_rem:02d}"
    except Exception as e:
        logger.error(f"Timezone lookup failed for coordinates {lat}, {lon}: {e}")
    return "+05:30" # Default IST fallback

# Configure logging first
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

ROOT_DIR = Path(__file__).parent
load_dotenv(ROOT_DIR / '.env')

# Upload directories
UPLOAD_DIR = ROOT_DIR / "uploads"
UPLOAD_DIR.mkdir(parents=True, exist_ok=True)

# MongoDB connection settings
mongo_url = os.environ.get('MONGO_URL', 'mongodb://localhost:27017')
db_name = os.environ.get('DB_NAME', 'soul')
ADMIN_USERNAME = os.environ.get('ADMIN_USERNAME', 'admin')
ADMIN_PASSWORD = os.environ.get('ADMIN_PASSWORD', 'admin123')
JWT_SECRET = os.environ.get('JWT_SECRET', 'supersecretcosmicenergysecret')
JWT_ALGORITHM = "HS256"

# Local JSON Fallback database setup
DB_FILE = ROOT_DIR / "db.json"

def read_local_db():
    if not DB_FILE.exists():
        return {"status_checks": [], "blogs": [], "horoscope_reports": []}
    try:
        with open(DB_FILE, "r") as f:
            data = json.load(f)
            if "horoscope_reports" not in data:
                data["horoscope_reports"] = []
            return data
    except Exception as e:
        logger.error(f"Error reading local DB file: {e}")
        return {"status_checks": [], "blogs": [], "horoscope_reports": []}

def write_local_db(data):
    try:
        with open(DB_FILE, "w") as f:
            json.dump(data, f, indent=2)
    except Exception as e:
        logger.error(f"Error writing to local DB: {e}")

# Check MongoDB connectivity
use_local_db = False
try:
    if not mongo_url:
        raise ValueError("MONGO_URL environment variable is missing")
    logger.info("Initializing MongoDB client...")
    client = AsyncIOMotorClient(mongo_url, serverSelectionTimeoutMS=2000)
    db = client[db_name]
except Exception as e:
    logger.warning(f"MongoDB connection configuration failed: {e}. Using local JSON database.")
    use_local_db = True
    client = None
    db = None

# Create the main app without a prefix
app = FastAPI()

# Create a router with the /api prefix
api_router = APIRouter(prefix="/api")

# Define Models
class StatusCheck(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    client_name: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class StatusCheckCreate(BaseModel):
    client_name: str

class LoginRequest(BaseModel):
    username: str
    password: str

class Blog(BaseModel):
    model_config = ConfigDict(extra="ignore")
    id: str = Field(default_factory=lambda: str(uuid.uuid4()))
    title: str
    category: str
    date: str = Field(default_factory=lambda: datetime.now(timezone.utc).strftime("%B %d, %Y"))
    excerpt: str
    content: str
    image: str
    timestamp: datetime = Field(default_factory=lambda: datetime.now(timezone.utc))

class BlogCreate(BaseModel):
    title: str
    category: str
    excerpt: str
    content: str
    image: str

# Auth dependencies
async def get_current_admin(authorization: str = Header(None)):
    if not authorization or not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Unauthorized: Missing or invalid token format")
    token = authorization.split(" ")[1]
    try:
        payload = jwt.decode(token, JWT_SECRET, algorithms=[JWT_ALGORITHM])
        username = payload.get("sub")
        if username != ADMIN_USERNAME:
            raise HTTPException(status_code=403, detail="Forbidden: Not an admin")
        return username
    except JWTError:
        raise HTTPException(status_code=401, detail="Unauthorized: Invalid token")

# Endpoints
@api_router.get("/")
async def root():
    return {"message": "Hello World"}

# Auth Endpoint
@api_router.post("/auth/login")
async def login(request: LoginRequest):
    if request.username == ADMIN_USERNAME and request.password == ADMIN_PASSWORD:
        token_data = {
            "sub": request.username,
            "exp": datetime.now(timezone.utc) + timedelta(days=1)
        }
        token = jwt.encode(token_data, JWT_SECRET, algorithm=JWT_ALGORITHM)
        return {"token": token, "username": request.username}
    raise HTTPException(status_code=401, detail="Invalid username or password")

# Status checks
@api_router.post("/status", response_model=StatusCheck)
async def create_status_check(input: StatusCheckCreate):
    status_obj = StatusCheck(client_name=input.client_name)
    doc = status_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()
    
    global use_local_db
    if not use_local_db:
        try:
            _ = await db.status_checks.insert_one(doc)
            return status_obj
        except Exception as e:
            logger.warning(f"Failed to insert into MongoDB: {e}. Falling back to local DB.")
            use_local_db = True
            
    # Local DB Fallback
    local_data = read_local_db()
    doc.pop('_id', None)
    local_data["status_checks"].append(doc)
    write_local_db(local_data)
    return status_obj

@api_router.get("/status", response_model=List[StatusCheck])
async def get_status_checks():
    global use_local_db
    if not use_local_db:
        try:
            status_checks = await db.status_checks.find({}, {"_id": 0}).to_list(1000)
            for check in status_checks:
                if isinstance(check['timestamp'], str):
                    check['timestamp'] = datetime.fromisoformat(check['timestamp'])
            return status_checks
        except Exception as e:
            logger.warning(f"Failed to retrieve from MongoDB: {e}. Falling back to local DB.")
            use_local_db = True
            
    # Local DB Fallback
    local_data = read_local_db()
    status_checks = []
    for check in local_data["status_checks"]:
        check_copy = dict(check)
        if isinstance(check_copy['timestamp'], str):
            check_copy['timestamp'] = datetime.fromisoformat(check_copy['timestamp'])
        status_checks.append(check_copy)
    return status_checks

# Blog Endpoints
@api_router.get("/blogs", response_model=List[Blog])
async def get_blogs(request: Request):
    global use_local_db
    base_url = str(request.base_url).rstrip("/")
    
    def adjust_image_url(image_path: str):
        if not image_path:
            return image_path
        for local_prefix in ("http://localhost:8005", "http://127.0.0.1:8005"):
            if image_path.startswith(local_prefix):
                return image_path.replace(local_prefix, base_url)
        if image_path.startswith("/uploads/"):
            return f"{base_url}{image_path}"
        return image_path

    if not use_local_db:
        try:
            blogs = await db.blogs.find({}, {"_id": 0}).to_list(1000)
            for blog in blogs:
                if isinstance(blog['timestamp'], str):
                    blog['timestamp'] = datetime.fromisoformat(blog['timestamp'])
                blog['image'] = adjust_image_url(blog.get('image'))
            return blogs
        except Exception as e:
            logger.warning(f"Failed to retrieve blogs from MongoDB: {e}. Falling back to local DB.")
            use_local_db = True

    # Local DB Fallback
    local_data = read_local_db()
    blogs = []
    for blog in local_data.get("blogs", []):
        blog_copy = dict(blog)
        if isinstance(blog_copy['timestamp'], str):
            blog_copy['timestamp'] = datetime.fromisoformat(blog_copy['timestamp'])
        blog_copy['image'] = adjust_image_url(blog_copy.get('image'))
        blogs.append(blog_copy)
    return blogs

@api_router.post("/blogs", response_model=Blog)
async def create_blog(input: BlogCreate, admin: str = Depends(get_current_admin)):
    blog_obj = Blog(
        title=input.title,
        category=input.category,
        excerpt=input.excerpt,
        content=input.content,
        image=input.image
    )
    doc = blog_obj.model_dump()
    doc['timestamp'] = doc['timestamp'].isoformat()

    global use_local_db
    if not use_local_db:
        try:
            _ = await db.blogs.insert_one(doc)
            return blog_obj
        except Exception as e:
            logger.warning(f"Failed to insert blog into MongoDB: {e}. Falling back to local DB.")
            use_local_db = True

    # Local DB Fallback
    local_data = read_local_db()
    if "blogs" not in local_data:
        local_data["blogs"] = []
    doc.pop('_id', None)
    local_data["blogs"].append(doc)
    write_local_db(local_data)
    return blog_obj

@api_router.put("/blogs/{blog_id}", response_model=Blog)
async def update_blog(blog_id: str, input: BlogCreate, admin: str = Depends(get_current_admin)):
    global use_local_db
    
    if not use_local_db:
        try:
            existing = await db.blogs.find_one({"id": blog_id})
            if not existing:
                raise HTTPException(status_code=404, detail="Blog post not found")
            
            update_data = {
                "title": input.title,
                "category": input.category,
                "excerpt": input.excerpt,
                "content": input.content,
                "image": input.image,
                "timestamp": datetime.now(timezone.utc)
            }
            await db.blogs.update_one({"id": blog_id}, {"$set": update_data})
            
            updated_doc = await db.blogs.find_one({"id": blog_id}, {"_id": 0})
            if isinstance(updated_doc['timestamp'], str):
                updated_doc['timestamp'] = datetime.fromisoformat(updated_doc['timestamp'])
            return updated_doc
        except HTTPException:
            raise
        except Exception as e:
            logger.warning(f"Failed to update blog in MongoDB: {e}. Falling back to local DB.")
            use_local_db = True
            
    local_data = read_local_db()
    blogs = local_data.get("blogs", [])
    found = False
    updated_blog = None
    for idx, blog in enumerate(blogs):
        if blog.get("id") == blog_id:
            blogs[idx]["title"] = input.title
            blogs[idx]["category"] = input.category
            blogs[idx]["excerpt"] = input.excerpt
            blogs[idx]["content"] = input.content
            blogs[idx]["image"] = input.image
            blogs[idx]["timestamp"] = datetime.now(timezone.utc).isoformat()
            updated_blog = blogs[idx]
            found = True
            break
            
    if not found:
        raise HTTPException(status_code=404, detail="Blog post not found")
        
    write_local_db(local_data)
    
    blog_copy = dict(updated_blog)
    if isinstance(blog_copy['timestamp'], str):
        blog_copy['timestamp'] = datetime.fromisoformat(blog_copy['timestamp'])
    return blog_copy

@api_router.delete("/blogs/{blog_id}")
async def delete_blog(blog_id: str, admin: str = Depends(get_current_admin)):
    global use_local_db
    
    if not use_local_db:
        try:
            res = await db.blogs.delete_one({"id": blog_id})
            if res.deleted_count > 0:
                return {"message": "Blog post deleted successfully"}
        except Exception as e:
            logger.warning(f"Failed to delete blog in MongoDB: {e}. Falling back to local DB.")
            use_local_db = True
            
    local_data = read_local_db()
    blogs = local_data.get("blogs", [])
    initial_len = len(blogs)
    local_data["blogs"] = [b for b in blogs if b.get("id") != blog_id]
    
    if len(local_data["blogs"]) == initial_len:
        raise HTTPException(status_code=404, detail="Blog post not found")
        
    write_local_db(local_data)
    return {"message": "Blog post deleted successfully"}

@api_router.post("/upload")
async def upload_image(request: Request, file: UploadFile = File(...), admin: str = Depends(get_current_admin)):
    ext = Path(file.filename).suffix
    filename = f"{uuid.uuid4()}{ext}"
    file_path = UPLOAD_DIR / filename
    
    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)
        
    base_url = str(request.base_url).rstrip("/")
    return {"url": f"{base_url}/uploads/{filename}"}

@api_router.post("/blogs/import-docx")
async def import_docx(file: UploadFile = File(...), admin: str = Depends(get_current_admin)):
    if not file.filename.endswith('.docx'):
        raise HTTPException(status_code=400, detail="Only .docx files are supported")
    
    import io
    import zipfile
    import xml.etree.ElementTree as ET
    
    try:
        file_bytes = await file.read()
        with zipfile.ZipFile(io.BytesIO(file_bytes)) as doc:
            xml_content = doc.read('word/document.xml')
        root = ET.fromstring(xml_content)
        
        # Extract text elements and breaks in document order
        pieces = []
        for child in root.iter():
            tag = child.tag.split('}')[-1]
            if tag in ('br', 'cr', 'p'):
                pieces.append('\n')
            elif tag == 't':
                if child.text:
                    pieces.append(child.text)
                    
        text = ''.join(pieces)
        
        # Split by newlines and clean
        lines = [line.strip() for line in text.split('\n')]
        non_empty_lines = [line for line in lines if line]
        
        if not non_empty_lines:
            return {"title": "", "content": "", "excerpt": ""}
            
        title = non_empty_lines[0]
        content = '\n\n'.join(non_empty_lines[1:])
        
        # Create a nice excerpt
        excerpt = ""
        for p in non_empty_lines[1:]:
            # Skip short headings or list items
            if len(p) > 40 and not p.startswith('•') and not p.startswith('-') and not p.startswith('1.') and not p.startswith('2.'):
                excerpt = p
                break
        if len(excerpt) > 160:
            excerpt = excerpt[:157] + "..."
        elif not excerpt:
            excerpt = title
            
        return {"title": title, "content": content, "excerpt": excerpt}
    except Exception as e:
        logger.error(f"Error parsing docx: {e}")
        raise HTTPException(status_code=400, detail=f"Failed to parse Word Document: {e}")

# --- Horoscope Flow Implementation ---

class HoroscopeCreate(BaseModel):
    name: str = "Seeker"
    dob: str
    tob: str
    pob: str
    is_calculator: bool = False
    tab: str = "pending-karma"
    partnerName: str = ""
    partnerDob: str = ""

class HoroscopeUnlock(BaseModel):
    report_id: str
    payment_method: str
    payment_id: str
    razorpay_order_id: str = ""
    razorpay_signature: str = ""

class OrderCreate(BaseModel):
    report_id: str

# Lists of phrases for unique paragraph building
RASIS = ["Mesha (Aries)", "Vrishabha (Taurus)", "Mithuna (Gemini)", "Karka (Cancer)", "Simha (Leo)", "Kanya (Virgo)", "Tula (Libra)", "Vrischika (Scorpio)", "Dhanu (Sagittarius)", "Makara (Capricorn)", "Kumbha (Aquarius)", "Meena (Pisces)"]

NAKSHATRAS = ["Ashwini", "Bharani", "Krittika", "Rohini", "Mrigashira", "Ardra", "Punarvasu", "Pushya", "Ashlesha", "Magha", "Purva Phalguni", "Uttara Phalguni", "Hasta", "Chitra", "Swati", "Vishakha", "Anuradha", "Jyeshtha", "Moola", "Purva Ashadha", "Uttara Ashadha", "Shravana", "Dhanishta", "Shatabhisha", "Purva Bhadrapada", "Uttara Bhadrapada", "Revati"]

LAGNAS = ["Aries (Mesha)", "Taurus (Vrishabha)", "Gemini (Mithuna)", "Cancer (Karka)", "Leo (Simha)", "Virgo (Kanya)", "Libra (Tula)", "Scorpio (Vrischika)", "Sagittarius (Dhanu)", "Capricorn (Makara)", "Aquarius (Kumbha)", "Pisces (Meena)"]

COLORS = ["Golden Gold", "Royal Indigo", "Crimson Red", "Deep Sapphire", "Emerald Green", "Saffron Yellow", "Soft Rose", "Violet", "Midnight Blue", "Warm Amber"]

DAYS = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]

POOLS = {
    # TODAY
    "today_overall": [
        ["Today, the cosmic alignments suggest that ", "Under the current lunar influence, ", "With planetary forces activating your solar house, ", "As celestial bodies transit through your chart, ", "Today's celestial pattern indicates that "],
        ["you are entering a period of deep clarity and heightened intuition. ", "a wave of constructive enthusiasm is boosting your mental focus. ", "your emotional intelligence will serve as your greatest guide today. ", "you will feel a strong impulse to restructure your daily routine and priorities. ", "planetary transits are opening new pathways for spiritual and mental alignment. "],
        ["Focus on grounding yourself and avoid rushing into major decisions.", "Embrace any sudden shifts as hidden blessings guiding you forward.", "Trust the timing of your life and let go of external anxieties.", "Spend some time in quiet contemplation to align with your true purpose.", "Keep your intentions clear and let your actions reflect your highest goals."]
    ],
    "today_career": [
        ["In your professional domain, the planetary transits suggest ", "Regarding your career path, the stars reveal that ", "Your workspace is currently charged with cosmic energies that ", "A favorable aspect from Mercury indicates that ", "The cosmic currents in your house of career are showing "],
        ["a sudden rise in your creative ideas and collaboration opportunities. ", "that your persistent efforts are starting to get noticed by decision-makers. ", "a good time to clear pending tasks and organize your workflow. ", "a focus on long-term strategy rather than short-term gains. ", "that communication with colleagues will yield productive breakthroughs. "],
        ["Approach conflicts with patience and active listening.", "Avoid committing to massive projects without reading the fine print.", "Trust your skills and take a bold step forward when opportunity knocks.", "Keep your professional boundaries strong and stay focused on your primary tasks.", "A mentor or senior figure might offer a key piece of guidance today."]
    ],
    "today_finance": [
        ["Financially, the planetary positions warn that ", "Regarding your wealth and resources, the alignment indicates ", "Your monetary house is experiencing a minor transit that suggests ", "Cosmic financial patterns show that ", "In terms of material security, the stars highlight that "],
        ["minor fluctuations may require you to budget more carefully today. ", "an unexpected minor gain or opportunity is approaching. ", "it is wise to delay high-risk investments for a few days. ", "a balance between spending and saving is essential right now. ", "creative ideas could lead to a secondary stream of income soon. "],
        ["Focus on utility rather than luxury when making purchases.", "Review your subscription plans and eliminate unnecessary leaks.", "Consult a trusted professional before making sudden financial shifts.", "Keep your financial goals aligned with long-term security.", "A small act of charity will invite abundance back into your life."]
    ],
    "today_relationship": [
        ["In your social and emotional circle, the stars highlight ", "Your personal relationships are influenced by a transit that brings ", "Regarding matters of the heart, the cosmic alignments suggest ", "The emotional current today encourages you to ", "Communication with loved ones is under a transit that shows "],
        ["a major focus on empathy, deep conversations, and mutual support. ", "a temporary misunderstanding that can be resolved with patience. ", "an opportunity to express your true feelings to a trusted partner. ", "reconnect with an old friend who has been on your mind recently. ", "a surge of warmth and shared joy in your immediate domestic environment. "],
        ["Listen more than you speak to understand the underlying emotions.", "Avoid taking constructive feedback personally.", "A gentle gesture or kind word will heal lingering tensions.", "Cherish the moments of connection and show your gratitude openly.", "Be honest about your emotional needs without being demanding."]
    ],
    "today_health": [
        ["Health-wise, your energetic vitality today suggests ", "Regarding physical and mental wellness, the stars suggest ", "Your physical vitality house is experiencing a transit that calls for ", "The cosmic health alignment highlights the need to ", "In terms of well-being, planetary energies indicate "],
        ["focusing on posture, light stretching, and staying hydrated. ", "a boost in overall stamina, making it a great day for exercise. ", "avoiding overexertion and listening to your body's signs of fatigue. ", "balancing active work hours with intentional rest periods. ", "paying attention to your dietary habits and choosing nourishing foods. "],
        ["A brisk walk in nature will clear your mind and lift your spirits.", "Ensure you get adequate rest tonight to recharge your aura.", "Incorporate deep breathing exercises to reduce stress levels.", "Listen to your body and rest if you feel fatigued.", "Stay hydrated and avoid heavy, processed meals in the evening."]
    ],

    # TOMORROW
    "tomorrow_energy": [
        ["Tomorrow's cosmic atmosphere brings ", "The energetic signature of tomorrow highlights ", "As we look to tomorrow, the alignments indicate ", "Tomorrow's planetary positions are set to manifest ", "The energetic field surrounding you tomorrow suggests "],
        ["a powerful drive for personal initiatives and new projects. ", "a calm, grounding energy that favors organization and focus. ", "a highly social vibe, encouraging connection and communication. ", "a major shift towards emotional reflection and inner growth. ", "an intense surge of creative energy and inspiration. "],
        ["Align your actions with your long-term vision.", "Take steady, measured steps to avoid burnout.", "Open your heart to collaborative ventures and shared goals.", "Prepare for minor obstacles by maintaining internal peace.", "Trust the flow of events without attempting to force outcomes."]
    ],
    "tomorrow_career": [
        ["Tomorrow in your career, the stars indicate ", "Regarding your workspace tomorrow, expect ", "Your professional house tomorrow will experience ", "The career alignment for tomorrow shows ", "Planetary transits tomorrow suggest that your work life "],
        ["a chance to present your ideas to key decision-makers. ", "a busy schedule with multiple tasks requiring your coordination. ", "a breakthrough in a problem you have been analyzing for weeks. ", "a temporary delay that offers time to refine your strategy. ", "positive recognition for your dedication and attention to detail. "],
        ["Stay collaborative and value input from colleagues.", "Double-check your emails and documentation for minor errors.", "Maintain a proactive stance and welcome new responsibilities.", "Do not rush decisions; tomorrow favors slow, steady progress.", "Keep your professional goals aligned with your personal values."]
    ],
    "tomorrow_finance": [
        ["Financially, tomorrow highlights the need to ", "Regarding material security tomorrow, the cosmic pattern suggests ", "Your financial house tomorrow will be influenced by ", "Tomorrow's planetary positions regarding wealth show ", "In terms of resources, tomorrow the alignments indicate "],
        ["review your long-term investments and savings strategy. ", "an opportunity to optimize your budget and reduce overheads. ", "a stable energy, showing no major surprises or disruptions. ", "caution in signing financial agreements or high-cost contracts. ", "a favorable aspect for planning future monetary ventures. "],
        ["Prioritize absolute clarity in all financial partnerships.", "Focus on building a reliable emergency fund.", "A conservative approach to spending will yield peace of mind.", "Avoid impulse buying and emotional shopping.", "Trust your instincts but verify facts before making commits."]
    ],
    "tomorrow_relationship": [
        ["In terms of relationships tomorrow, the cosmic alignment favors ", "Matters of connection and love tomorrow will bring ", "Your relationship sector tomorrow is influenced by ", "Tomorrow's energetic ties with family and partners show ", "Socially, tomorrow the celestial alignments suggest "],
        ["warm, constructive dialogues that clarify long-term goals. ", "a deeper emotional bond through shared experiences. ", "a focus on giving space and practicing active patience. ", "an opportunity to resolve a lingering debate with an open mind. ", "a pleasant surprise from someone close to your heart. "],
        ["Express your appreciation through meaningful actions.", "Allow others to share their perspectives without interrupting.", "A small token of kindness will go a long way tomorrow.", "Stay authentic to your feelings while remaining empathetic.", "Reconnect with your core support system for grounding."]
    ],
    "tomorrow_health": [
        ["Regarding your wellness tomorrow, the stars advise ", "Tomorrow's health outlook highlights ", "In terms of physical energy tomorrow, the transits support ", "Wellness patterns tomorrow show a need for ", "Tomorrow, your physical house suggests focusing on "],
        ["incorporating mindful stretching or yoga into your morning. ", "steady, sustainable energy levels throughout the day. ", "restorative activities that release tension from your shoulders. ", "refreshing your sleep hygiene and reducing screen time at night. ", "a balanced meal plan that fuels your system efficiently. "],
        ["Drink plenty of water and prioritize natural foods.", "Listen to your body's request for rest or movement.", "A peaceful evening routine will ensure deep sleep.", "Avoid excessive caffeine or stimulants in the afternoon.", "Spend time outdoors to absorb fresh, grounding energy."]
    ],

    # WEEKLY
    "weekly_overall": [
        ["This week, the planetary influences suggest that ", "Over the course of the coming week, ", "As the weekly alignment unfolds, ", "Your solar chart this week indicates "],
        ["you will experience a significant shift in your focus and priorities. ", "opportunities for collaboration and networking will arise. ", "you should prioritize self-reflection and emotional balance. ", "a wave of positive energy will boost your confidence and drive. "],
        ["Stay grounded and trust the timing of your journey.", "Be open to unexpected changes that bring growth.", "Focus on clear communication to avoid misunderstandings.", "Take time to recharge and align with your purpose."]
    ],
    "weekly_career": [
        ["In your career this week, the stars show ", "Your professional life this week is marked by ", "Regarding your work, the celestial transits highlight ", "In terms of vocational projects, expect "],
        ["a busy schedule filled with meetings and coordination. ", "a breakthrough in a complex problem or project. ", "recognition from supervisors for your dedication. ", "a good opportunity to pitch new ideas or strategies. "],
        ["Maintain a proactive attitude and stay collaborative.", "Double-check details to ensure high-quality output.", "Trust your capabilities and lead by example.", "Keep your professional boundaries clear and strong."]
    ],
    "weekly_finance": [
        ["Financially, this week points to ", "Regarding material security this week, the stars advise ", "Your wealth sector this week experiences transits that show ", "In terms of finances, this week the alignments suggest "],
        ["a stable period with opportunities for budgeting and optimization. ", "being cautious with speculative trades or sudden large investments. ", "a steady flow of resources but a need for long-term planning. ", "unexpected minor rewards or returns from past efforts. "],
        ["Review your expenses and plan for the weeks ahead.", "Seek counsel from trusted advisors before major changes.", "Prudent resource management will grant long-term safety.", "A conservative stance on material spending is highly favored."]
    ],
    "weekly_relationship": [
        ["In your relationships this week, the alignments favor ", "Matters of love and family this week bring ", "Regarding connections, the cosmic movements this week suggest ", "Socially, the weekly planetary pattern highlights "],
        ["nurturing deep connections and holding meaningful conversations. ", "resolving long-standing misunderstandings with patience. ", "sharing creative experiences or quiet moments with a partner. ", "expanding your social circle or reconnecting with old companions. "],
        ["Listen with empathy and express your appreciation clearly.", "Be patient with loved ones as energies settle.", "A small act of support will greatly strengthen bonds.", "Keep your heart open but maintain healthy personal boundaries."]
    ],
    "weekly_health": [
        ["Regarding your wellness this week, focus on ", "This week's health outlook highlights the need to ", "In terms of physical energy this week, the transits support ", "Wellness patterns this week emphasize the power of "],
        ["establishing consistent sleeping patterns and light exercises. ", "balancing active hours with restorative rest and hydration. ", "incorporating green, nourishing meals and mindfulness. ", "releasing emotional stress through breathing exercises. "],
        ["Take regular breaks from work to clear your mind.", "Listen to your physical signals and avoid overexertion.", "Adequate recovery time at night is essential.", "Fresh air and daily nature walks will revive your spirit."]
    ],

    # MONTHLY
    "monthly_overall": [
        ["This month, the overarching cosmic alignments suggest that ", "Throughout the coming month, the planetary cycles reveal that ", "As the monthly transit map takes shape, the stars indicate that ", "Your chart's houses are receiving a monthly transit pattern showing that "],
        ["you are entering a pivotal cycle of personal growth and alignment. ", "major decisions regarding career and relationships will take center stage. ", "emotional depth and spiritual understanding will guide your path. ", "patience and systematic planning are key to navigating incoming changes. "],
        ["Embrace the natural flow of these transitions and stay grounded.", "Trust the timing of your evolutionary journey and remain open.", "Focus your energies on high-priority goals and self-discovery.", "Let go of old patterns to make space for incoming blessings."]
    ],
    "monthly_career": [
        ["In your professional sphere, this month highlights ", "Regarding career progression, the monthly stars predict ", "Your vocation this month is heavily influenced by a transit of ", "In terms of business and professional growth, expect "],
        ["significant career growth and potential leadership assignments. ", "an opportunity to showcase your long-term vision and capabilities. ", "structural reorganizations that favor adaptable individuals. ", "constructive collaborations and expanding your network scale. "],
        ["Invest in continuous learning to expand your professional toolkit.", "A senior figure or mentor will play a key role in your growth.", "Stay aligned with integrity and double down on execution.", "Value feedback and use it to refine your vocational approach."]
    ],
    "monthly_finance": [
        ["Materially, this month highlights the necessity of ", "Regarding wealth accumulation, the monthly transits suggest ", "Your financial house this month shows steady progress linked to ", "In terms of resources, this month the alignments favor "],
        ["securing your assets and updating your portfolio strategies. ", "a major window for financial planning and wealth consolidation. ", "opportunities to establish secondary streams of income. ", "cautious investments in secure, high-yield assets. "],
        ["Avoid impulsive investments in volatile markets.", "Prudent budgeting now will secure a comfortable season ahead.", "Verify contracts and financial agreements thoroughly.", "A disciplined strategy will manifest steady financial growth."]
    ],
    "monthly_relationship": [
        ["Relationship-wise, this month is characterized by ", "Matters of the heart this month will call for ", "Your social and domestic sphere this month is under a cycle of ", "Regarding emotional bonds, the monthly transits highlight "],
        ["deepening domestic commitments and healing past conflicts. ", "clear communication and emotional vulnerability with partners. ", "expanding mutual respect and co-creating long-term memories. ", "redefining boundaries to ensure individual and shared growth. "],
        ["Express your love through consistent support and dedication.", "Patience will dissolve any minor celestial friction.", "A supportive community network is your greatest strength.", "Balance your personal space with shared quality time."]
    ],
    "monthly_health": [
        ["In terms of vitality this month, planetary transits advise ", "Regarding your health this month, the celestial guidance emphasizes ", "Your physical and mental well-being this month is supported by ", "Wellness patterns for this monthly cycle highlight the importance of "],
        ["focusing on cellular renewal, hydration, and nutritional cleanups. ", "maintaining a systematic exercise and recovery routine. ", "mindful relaxation and managing stress triggers effectively. ", "aligning your activities with seasonal energy changes. "],
        ["Incorporate regular massage or restorative therapy if possible.", "Ensure consistent physical activity to boost blood circulation.", "Make sleep quality a priority for deep physical repair.", "Nature walks and clean eating will enhance your overall aura."]
    ],

    # LIFE REPORT: PERSONALITY
    "personality_strengths": [
        ["Your chart reveals a core personality characterized by ", "The planetary configuration at your birth outlines a spirit of ", "You possess a powerful cosmic blueprint showing deep ", "A major strength in your astrological makeup is your ", "The cosmic markers define you as an individual of exceptional "],
        ["unwavering resilience, intellectual curiosity, and deep empathy. ", "profound focus, leadership capacity, and a search for truth. ", "creative expression, adaptability, and high emotional depth. ", "practical intelligence, reliable character, and structured vision. ", "spiritual awareness, diplomatic grace, and communicative warmth. "],
        ["This allows you to navigate life's challenges with poise.", "You inspire those around you to seek higher paths.", "Your ability to adjust to change is a valuable shield.", "Others value your grounded presence and turn to you for stability.", "You naturally bridge gaps and heal discord in your circles."]
    ],
    "personality_weaknesses": [
        ["However, your cosmic alignment also indicates a tendency toward ", "Your chart warns that your high sensitivity can lead to ", "A key area of growth in your personality is a struggle with ", "The stars show that your active mind can sometimes cause ", "You must guard against a cosmic predisposition to "],
        ["overthinking, self-criticism, and delaying critical choices. ", "taking on the emotional burdens of others at your own cost. ", "impatience, impulsiveness, and resisting structured routines. ", "stubbornness, attachment to comfort, and fear of sudden change. ", "perfectionism, which can paralyze your creative projects. "],
        ["Developing mindfulness will help quiet these internal doubts.", "Setting clear emotional boundaries is vital for your growth.", "Embracing daily discipline will transform this chaotic energy.", "Learning to release control is a major lesson of your soul.", "Remember that progress is more valuable than flawless execution."]
    ],
    "personality_talents": [
        ["Hidden in your planetary chart is a unique talent for ", "Your configuration points to an innate, latent skill in ", "You carry a cosmic blessing that grants you a talent for ", "The stars reveal that you possess an exceptional ability in ", "A major hidden gift in your birth chart is your "],
        ["intuitive problem-solving, making you a natural counselor. ", "artistic expression, styling, or creating visual harmony. ", "dissecting complex data and finding practical solutions. ", "motivating others and leading projects with quiet authority. ", "spiritual connection and reading the unsaid needs of others. "],
        ["This gift will shine brightly in collaborative environments.", "Cultivating this talent will bring immense personal fulfillment.", "You should trust this ability, as it is a key tool for your life.", "Developing this skill will open unexpected doors in your career.", "This natural radar helps you avoid hidden traps in life."]
    ],
    "personality_nature": [
        ["Your emotional nature is deeply tied to the moon, showing ", "Astrologically, your emotional core operates on ", "You possess a highly receptive emotional nature that responds to ", "The planetary ruler of your emotions indicates a nature that is ", "Your chart reveals an emotional structure characterized by "],
        ["a powerful need for security, home, and trusted bonds. ", "intense passion, loyalty, and a desire for meaningful ties. ", "lofty ideals, intellectual freedom, and philosophical space. ", "practical stability, quiet reflection, and structured feelings. ", "artistic sensitivity, rich imagination, and deep spiritual empathy. "],
        ["You experience feelings deeply but rarely show them to strangers.", "Allowing yourself to be vulnerable is a strength, not a weakness.", "Nurturing this emotional core requires quiet and safe environments.", "You process emotions logically, which helps in times of crisis.", "Your empathy makes you a safe harbor for friends in distress."]
    ],

    # LIFE REPORT: CAREER
    "career_growth": [
        ["Your professional trajectory is marked by a powerful transit that suggests ", "In terms of professional growth, your natal chart indicates a path of ", "The stars show that your career advancement is closely tied to your ", "Regarding career growth, planetary configurations indicate ", "The trajectory of your professional life shows a strong connection to "],
        ["steady, systematic progress with major breakthroughs in your mid-thirties. ", "dynamic shifts, leading you to a leadership role in communications. ", "independent ventures and building your own unique brand. ", "collaborative roles in high-impact, value-driven organizations. ", "analytical or technological fields where precision is highly valued. "],
        ["Remaining committed to continuous learning will accelerate your success.", "Cultivating professional diplomacy will unlock premium growth opportunities.", "Trusting your visionary ideas will lead you to financial independence.", "Aligning with high-integrity mentors will safeguard your path.", "Patience during temporary transits will guard your career longevity."]
    ],
    "career_business": [
        ["Your business potential is highlighted by a strong placement of Mercury, indicating ", "Regarding business and independent ventures, your chart shows ", "The entrepreneurial aspect in your astrological makeup suggests ", "In business, planetary transits reveal that you have ", "Your capacity for independent enterprise is marked by "],
        ["exceptional skill in negotiations, trade, and strategic alliances. ", "a calling for consultancy, advisory roles, or creative services. ", "great success in fields related to technology, real estate, or education. ", "a cautious but highly profitable approach to market investments. ", "a talent for organizing resources and managing operational systems. "],
        ["Focusing on niche, value-based services will yield high returns.", "Building a trust-based relationship with clients is your key asset.", "Avoid partnerships where operational control is compromised.", "Ensure thorough compliance and contract checks in all ventures.", "Your ability to foresee market shifts will guide your business moves."]
    ],
    "career_leadership": [
        ["Your leadership profile is characterized by ", "As a leader, the stars reveal that you operate with ", "The planetary configuration at your birth grants you a leadership style of ", "In roles of authority, you are cosmically aligned to display ", "Your potential for management and leadership is marked by "],
        ["quiet authority, strategic foresight, and exceptional empathy. ", "charismatic influence, clear vision, and motivating speech. ", "structured discipline, high expectations, and fair judgment. ", "innovative problem-solving and an open-door collaborative style. ", "unwavering resolve, protective instincts, and resource optimization. "],
        ["This style builds long-term loyalty among your team members.", "Harnessing this charisma will expand your influence significantly.", "Your structured approach ensures consistent organizational success.", "This collaborative nature fosters a highly creative workspace.", "Leading by example is your most powerful tool of influence."]
    ],

    # LIFE REPORT: RELATIONSHIP
    "relationship_marriage": [
        ["Your marriage sector is influenced by a favorable aspect, indicating ", "Regarding marital life, your chart highlights a path of ", "The stars reveal that your long-term partnerships will bring ", "Your seventh house of union suggests a marital bond characterized by ", "In terms of marriage, planetary transits indicate "],
        ["a deep, karmic connection with a partner who acts as a spiritual mirror. ", "steady emotional growth and shared intellectual pursuits. ", "a stable, supportive relationship built on mutual practical goals. ", "a dynamic partnership with a highly creative and expressive soul. ", "a companion who brings emotional healing and domestic security. "],
        ["Cultivating open communication will navigate any planetary retrogrades.", "Patience and compromise will serve as the foundation of your union.", "Respecting each other's independence will keep the relationship vibrant.", "Shared creative projects will deepen your bond over the years.", "Focusing on domestic peace will invite immense marital bliss."]
    ],
    "relationship_compatibility": [
        ["In compatibility, you share a strong energetic alignment with signs of ", "Your chart indicates high compatibility with individuals who possess ", "You are naturally drawn to, and compatible with, souls of ", "Regarding close bonds, your planetary layout harmonizes best with ", "The cosmic current shows that your energy blends beautifully with "],
        ["the Earth and Water elements, bringing stability and deep emotion. ", "the Fire and Air elements, sparks of passion and intellectual growth. ", "strong lunar or solar markers that complement your rising sign. ", "grounded, practical natures who appreciate order and reliability. ", "intuitive, artistic temperaments who share your philosophical views. "],
        ["These connections will offer natural comfort and mutual growth.", "These dynamics will keep your life exciting and forward-moving.", "These relationships will feel instantly familiar, like old friends.", "These partnerships will anchor you during turbulent life transits.", "These bonds will inspire your creative and spiritual pursuits."]
    ],
    "relationship_family": [
        ["Your domestic and family life is characterized by ", "Regarding family ties, the stars indicate a role of ", "Your chart reveals a domestic environment marked by ", "In family dynamics, you are cosmically aligned to be ", "Your connection to your roots and family shows "],
        ["a deep sense of responsibility, protection, and emotional bonding. ", "the peacemaker, balancing different energies with diplomatic grace. ", "strong ancestral connections and a respect for traditional values. ", "the visionary, guiding your loved ones toward progressive views. ", "a supportive anchor, providing reliable guidance in times of need. "],
        ["Prioritizing quality time at home will nurture your emotional health.", "Your patience is the key to maintaining absolute family harmony.", "Honoring family traditions will bring a sense of spiritual grounding.", "Encouraging open dialogues will clear domestic misunderstandings.", "Setting healthy boundaries will keep family ties strong and loving."]
    ],

    # LIFE REPORT: FINANCIAL
    "financial_wealth": [
        ["Your wealth potential is governed by a prominent Jupiter aspect, suggesting ", "Regarding wealth accumulation, your chart reveals a path of ", "The stars indicate that your financial success will manifest through ", "Your second house of resources highlights a potential for ", "In terms of material wealth, planetary configurations show "],
        ["steady accumulation of assets through real estate and long-term savings. ", "significant gains from professional services and strategic investments. ", "multiple income streams, including creative and remote ventures. ", "substantial inheritance or collaborative financial partnerships. ", "wealth growth tied directly to your communication and trade skills. "],
        ["Developing a structured investment plan early will secure your future.", "Avoiding speculative markets will safeguard your accumulated wealth.", "Diversifying your assets will invite continuous financial abundance.", "Prudent management of shared resources will double your net worth.", "Trusting your financial instincts will guide you to profitable paths."]
    ],
    "financial_habits": [
        ["Your money habits are characterized by ", "Regarding financial management, you have a natural tendency toward ", "Your chart reveals a relationship with money marked by ", "In financial choices, planetary transits show that you are ", "Your financial habits display a cosmic pattern of "],
        ["careful planning, structured budgets, and a focus on security. ", "generous spending balanced by intuitive shifts in resource saving. ", "investing in experiences, learning, and self-improvement assets. ", "cautious risk-taking, prioritizing safety over volatile gains. ", "valuing material comfort while maintaining a backup financial plan. "],
        ["This discipline ensures you rarely face unexpected material crises.", "Developing systematic automated saving will anchor this generous nature.", "This focus on education will eventually yield high financial returns.", "Your caution is a valuable shield against economic retrogrades.", "Balancing luxury and utility will maintain your financial peace."]
    ],
    "financial_opportunities": [
        ["Key wealth opportunities in your life will emerge from ", "The stars indicate that financial breakthroughs will manifest through ", "Your chart shows high potential for abundance in ventures involving ", "A major source of future financial growth will be ", "Your planetary transits suggest profitable opportunities in "],
        ["innovative technologies, digital platforms, or global commerce. ", "real estate development, sustainable assets, or consultancy. ", "creative media, public speaking, or wellness industries. ", "collaborative investments and partnerships with high-integrity groups. ", "education, writing, or importing/exporting divine knowledge. "],
        ["Staying alert to economic shifts in these sectors will bring success.", "Taking calculated risks in these areas will yield immense fruits.", "Cultivating your personal brand will directly boost your income.", "Selecting partners with matching values will guarantee profit.", "These fields align with your natural skills, ensuring easy abundance."]
    ],

    # LIFE REPORT: HEALTH
    "health_physical": [
        ["Your physical constitution is marked by an active Mars aspect, suggesting ", "Regarding physical wellness, your chart shows a nature that requires ", "The stars reveal that your physical stamina is closely linked to ", "Your sixth house of health suggests a physical build characterized by ", "In terms of physical health, planetary transits indicate "],
        ["high physical energy, but a tendency toward heat-related fatigue. ", "regular, moderate activity and a balanced digestive routine. ", "your respiratory health, emphasizing fresh air and breathwork. ", "a resilient structure, but susceptibility to joint or back strain. ", "a highly sensitive nervous system that responds quickly to stress. "],
        ["Incorporating cooling foods and hydration will maintain your balance.", "Establishing a consistent sleep schedule is vital for physical repairs.", "Daily cardiovascular exercises will optimize your vital energy.", "Stretching and strength training will safeguard your joint health.", "Adequate rest and reducing screen time will calm this nervous energy."]
    ],
    "health_mental": [
        ["Mentally, your chart indicates a highly active intellect that needs ", "Regarding cognitive and mental well-being, you require ", "Your mental health house is influenced by transits that call for ", "The stars reveal that your mental peace is deeply connected to ", "In terms of psychological balance, planetary alignments show "],
        ["intentional periods of quiet, screen-free time, and meditation. ", "creative outlets to release pent-up emotional thoughts. ", "structured routines that reduce decision fatigue and anxiety. ", "your immediate physical space, requiring order and harmony. ", "philosophical study and seeking higher knowledge to stay calm. "],
        ["Mindfulness practices will help quiet any overactive thoughts.", "Journaling your insights daily will process complex feelings.", "A balanced routine will keep your mental focus sharp and stable.", "Decluttering your environment will instantly clarify your mind.", "Connecting with a guide or therapist will support mental wellness."]
    ],
    "health_lifestyle": [
        ["Your ideal lifestyle guidance, according to your chart, is to ", "The stars suggest that your lifestyle should focus on ", "To maintain holistic harmony, planetary transits advise you to ", "Your astrological wellness roadmap emphasizes ", "A lifestyle that supports your cosmic layout includes "],
        ["integrate natural rhythms, fresh food, and daily outdoor walks. ", "a balance between social engagements and periods of solitude. ", "a plant-based or light diet with minimal processed foods. ", "regular creative hobbies that separate work from personal life. ", "mindful movement, clean spaces, and alignment with seasonal cycles. "],
        ["This alignment with nature will boost your longevity and peace.", "This balance will prevent burnout and keep your spirit high.", "This nutrition plan will support your digestive fire and clarity.", "These activities recharge your battery and invite joy.", "Living in harmony with these patterns will support your health."]
    ],

    # LIFE REPORT: SPIRITUAL
    "spiritual_karma": [
        ["Your karmic path is tied to the placement of Saturn, indicating ", "Regarding karma, your chart reveals key soul patterns related to ", "The stars indicate that your current life carries a karmic task of ", "Your karmic house shows a major theme of resolving past debts in ", "In terms of karma, your astrological profile highlights a path of "],
        ["learning patience, self-discipline, and accepting responsibility. ", "balancing personal ambition with selfless service to others. ", "learning to release control and trusting the flow of destiny. ", "building emotional independence and self-reliance. ", "mastering communication, truth-speaking, and sharing wisdom. "],
        ["Facing these lessons with humility will dissolve karmic blockages.", "This service will invite high blessings and clean your energetic slate.", "Surrendering control will transform your worries into profound peace.", "This self-reliance will build an unbreakable inner sanctuary.", "Your truth will serve as a lighthouse for other seeking souls."]
    ],
    "spiritual_lessons": [
        ["A major life lesson for your soul is to master ", "The stars show that your current incarnation seeks to learn ", "A key spiritual challenge you are destined to face is ", "Your chart indicates that you are learning to navigate ", "Your spiritual evolution requires you to learn the art of "],
        ["detachment from external validation and trusting your inner voice. ", "the balance between material success and internal peace. ", "healthy boundaries in love, preventing emotional exhaustion. ", "courage in the face of uncertainty and embracing change. ", "forgiveness, releasing past resentments that anchor your spirit. "],
        ["Learning this will unlock your true spiritual potential.", "This balance is the key to absolute fulfillment in this lifetime.", "Establishing these boundaries is your major energetic protection.", "This courage will reveal hidden dimensions of your personal power.", "This forgiveness is the ultimate key to liberating your soul."]
    ],
    "spiritual_purpose": [
        ["Your ultimate soul purpose, as written in the heavens, is to ", "Your chart reveals a divine calling to act as a ", "The stars show that your spiritual destination involves ", "Your birth chart highlights a life mission centered on ", "You are cosmically destined to fulfill a purpose of "],
        ["guide others through your acquired wisdom and emotional depth. ", "builder of harmony, bringing order and beauty to chaotic spaces. ", "exploring deep philosophical truths and sharing them globally. ", "healing others through your unique creative and empathetic gifts. ", "fostering community, bringing diverse groups under shared ideals. "],
        ["Walking this path will align you with infinite cosmic support.", "Fulfilling this mission will bring the deepest sense of peace.", "This exploration will expand the collective consciousness.", "This healing will complete your own soul's evolutionary circle.", "This community building will establish a legacy of unity."]
    ]
}

def clean_json_response(text: str) -> str:
    text = text.strip()
    if text.startswith("```json"):
        text = text[7:]
    elif text.startswith("```"):
        text = text[3:]
    if text.endswith("```"):
        text = text[:-3]
    return text.strip()

PERSONAS = [
    {
        "name": "Pandit Aditya Shastri",
        "description": "An orthodox Vedic scholar from Varanasi. Writes in a traditional, profound, spiritually rich style, referencing ancient scriptures (Brihat Parashara Hora Shastra, Upanishads), karmic laws, and offering classical remedial measures (mantras, charity). Uses analogies of planetary deities."
    },
    {
        "name": "Dr. Gitika Sharma",
        "description": "A modern evolutionary astrologer and psychologist. Melds classical Vedic astronomy with deep psychological insight. Focuses on mindset shifts, inner child work, practical self-care, and cognitive career strategies. Highly encouraging and analytical."
    },
    {
        "name": "Guru Vashishta Dev",
        "description": "A mystic, contemplative yogi. Writes in a poetic, philosophical, and esoteric tone, focusing heavily on soul progression, spiritual alchemy, meditation, and aligning with the cosmic flow. Uses rich storytelling and metaphorical language."
    },
    {
        "name": "Celeste Sterling",
        "description": "A contemporary cosmologist and life coach. Focuses on modern career opportunities, financial intelligence, strategic relationships, and digital-age challenges. High energy, motivational, and uses modern storytelling and real-world examples."
    }
]

TONES = [
    "Empowering, compassionate, and focused on self-actualization.",
    "Direct, realistic, focused on clear warnings, discipline, and concrete actions.",
    "Mystical, poetic, rich in metaphors and deep spiritual wisdom.",
    "Analytical, strategic, structured, and focused on timing and execution."
]

FOCUS_AREAS = [
    "Emotional fulfillment, family dynamics, and establishing an inner emotional sanctuary.",
    "Career acceleration, vocational alignment, leadership potential, and material abundance.",
    "Spiritual evolution, resolving karmic lessons, and discovering your divine mission.",
    "Vitality, healthy lifestyle choices, mental hygiene, and daily routines."
]

STORYTELLING_FRAMES = [
    "Practical modern analogies (e.g. comparing retrogrades to software updates, career to navigation systems).",
    "Ancient allegories, parables, and celestial myths (e.g. stories of planetary conflicts and cosmic balance).",
    "Psychological growth arcs, inner-work breakthroughs, and shifts in perspective.",
    "Strategic executive coaching paradigms, SWOT analysis of the soul, and goal-oriented execution."
]

def get_seeded_paragraph(rng, key):
    pools = POOLS.get(key)
    if not pools:
        return "The celestial alignments are working in your favor, bringing focus and balance."
    parts = [rng.choice(pool) for pool in pools]
    return "".join(parts)

def generate_unique_horoscope(name: str, dob: str, tob: str, pob: str = "", tab: str = "pending-karma", partner_name: str = "", partner_dob: str = ""):
    name = name.strip() if (name and name.strip()) else "Seeker"
    # Build seed with date-based entropy so the same person gets a different report each day
    now_tag = datetime.now(timezone.utc).strftime("%Y-%m-%d-%H")
    seed_str = f"{name.lower()}_{dob}_{tob}_{pob.strip().lower()}_{now_tag}"
    seed_hash = hashlib.sha256(seed_str.encode('utf-8')).hexdigest()
    seed_num = int(seed_hash, 16)
    rng = random.Random(seed_num)

    # 1. Geocode location and determine timezone offset
    lat, lon = geocode_place(pob)
    try:
        dt = datetime.strptime(f"{dob} {tob}", "%Y-%m-%d %H:%M")
    except Exception:
        dt = datetime.now()
    offset = get_timezone_offset(lat, lon, dt)

    # 2. Build VedAstro Time String and GeoLocation object
    time_str = dt.strftime("%H:%M %d/%m/%Y") + " " + offset
    
    # 3. Call Swiss Ephemeris (libephemeris) to calculate real parameters
    planetary_positions = {}
    try:
        # Calculate Julian Day in UT
        jd = get_julday_ut(dt, offset)
        
        # Set sidereal mode to Lahiri
        swe.set_sid_mode(swe.SIDM_LAHIRI, 0.0, 0.0)
        
        # Calculate planetary longitudes
        planets_map = {
            'Sun': swe.SUN,
            'Moon': swe.MOON,
            'Mars': swe.MARS,
            'Mercury': swe.MERCURY,
            'Jupiter': swe.JUPITER,
            'Venus': swe.VENUS,
            'Saturn': swe.SATURN,
            'Rahu': swe.MEAN_NODE
        }
        
        for p_name, code in planets_map.items():
            res, _ = swe.calc_ut(jd, code, swe.FLG_SIDEREAL)
            lon_deg = res[0]
            planetary_positions[p_name] = get_zodiac_sign(lon_deg)
            
        # Ketu is Rahu + 180 modulo 360
        rahu_res, _ = swe.calc_ut(jd, swe.MEAN_NODE, swe.FLG_SIDEREAL)
        ketu_lon = (rahu_res[0] + 180.0) % 360.0
        planetary_positions['Ketu'] = get_zodiac_sign(ketu_lon)
        
        # Calculate Moon's Nakshatra and Rasi
        moon_res, _ = swe.calc_ut(jd, swe.MOON, swe.FLG_SIDEREAL)
        moon_lon = moon_res[0]
        
        va_nakshatra_str = get_nakshatra(moon_lon)
        va_rasi_str = get_zodiac_sign(moon_lon)
        
        # Calculate Ascendant (Lagna)
        # Use Equal house system ('E') to compute cusps and Ascendant/MC
        _, ascmc = swe.houses_ex(jd, lat, lon, ord('E'), swe.FLG_SIDEREAL)
        asc_lon = ascmc[0]
        va_lagna_str = get_zodiac_sign(asc_lon)

        # Map to bilingual structures expected by frontend
        rasi = ZODIAC_MAP.get(va_rasi_str, va_rasi_str)
        nakshatra = va_nakshatra_str
        lagna = LAGNA_MAP.get(va_lagna_str, va_lagna_str)
        zodiac = planetary_positions['Sun']
        
        if " (" in rasi:
            moon_sign = rasi.split(" ")[0]
        else:
            moon_sign = rasi
            
        birth_star = va_nakshatra_str
    except Exception as e:
        logger.error(f"Swiss Ephemeris calculation failed: {e}. Attempting Gemini API fallback...")
        
        # Try to use Gemini API fallback to get birth chart parameters
        gemini_key = os.environ.get("GEMINI_API_KEY")
        got_fallback = False
        if gemini_key and gemini_key.strip():
            try:
                url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={gemini_key}"
                fallback_prompt = f"""
Calculate/estimate the Vedic astrology parameters for a person with the following birth details:
- Name: {name}
- Date of Birth: {dob} (YYYY-MM-DD)
- Time of Birth: {tob} (HH:MM)
- Place of Birth: {pob}

You must return a single, valid JSON object containing exactly the keys below. Do not wrap the JSON in comments or output anything except the parseable JSON string.
{{
  "rasi": "Moon sign (e.g. 'Mesha (Aries)' or corresponding bilingual name from Aries, Taurus, Gemini, Cancer, Leo, Virgo, Libra, Scorpio, Sagittarius, Capricorn, Aquarius, Pisces)",
  "nakshatra": "Nakshatra constellation name with padha (e.g., 'Krithika - 1')",
  "lagna": "Ascendant sign (e.g., 'Sagittarius (Dhanu)' or corresponding bilingual name)",
  "zodiac": "Sun sign (e.g., 'Scorpio')",
  "planetary_positions": {{
    "Sun": "Zodiac sign name (e.g., 'Scorpio')",
    "Moon": "Zodiac sign name (e.g., 'Aries')",
    "Mars": "Zodiac sign name",
    "Mercury": "Zodiac sign name",
    "Jupiter": "Zodiac sign name",
    "Venus": "Zodiac sign name",
    "Saturn": "Zodiac sign name",
    "Rahu": "Zodiac sign name",
    "Ketu": "Zodiac sign name"
  }}
}}
"""
                payload = {
                    "contents": [{"parts": [{"text": fallback_prompt}]}],
                    "generationConfig": {
                        "responseMimeType": "application/json",
                        "temperature": 0.2
                    }
                }
                response = requests.post(url, json=payload, timeout=20)
                if response.status_code == 200:
                    res_json = response.json()
                    text_content = res_json["candidates"][0]["content"]["parts"][0]["text"]
                    cleaned_text = clean_json_response(text_content)
                    gemini_details = json.loads(cleaned_text)
                    rasi = gemini_details.get("rasi", rng.choice(RASIS))
                    nakshatra = gemini_details.get("nakshatra", rng.choice(NAKSHATRAS))
                    lagna = gemini_details.get("lagna", rng.choice(LAGNAS))
                    zodiac = gemini_details.get("zodiac", rasi.split(" ")[1].replace("(", "").replace(")", "") if " " in rasi else "Aries")
                    planetary_positions = gemini_details.get("planetary_positions", {})
                    # Ensure all planets are filled
                    for p in ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']:
                        if p not in planetary_positions:
                            planetary_positions[p] = "Aries"
                    moon_sign = rasi.split(" ")[0] if " " in rasi else rasi
                    birth_star = nakshatra
                    logger.info("Successfully fetched birth chart fallback details from Gemini API.")
                    got_fallback = True
            except Exception as fe:
                logger.error(f"Gemini fallback API call failed: {fe}")

        if not got_fallback:
            # Fallback to seeded random parameters if Gemini fails or is not available
            logger.warning("Using seeded random values fallback for birth chart details.")
            rasi = rng.choice(RASIS)
            nakshatra = rng.choice(NAKSHATRAS)
            lagna = rng.choice(LAGNAS)
            zodiac = rasi.split(" ")[1].replace("(", "").replace(")", "") if " " in rasi else "Aries"
            moon_sign = rasi.split(" ")[0] if " " in rasi else rasi
            birth_star = nakshatra
            planetary_positions = {
                p: rng.choice(RASIS).split(" ")[1].replace("(", "").replace(")", "") if " " in rng.choice(RASIS) else "Aries"
                for p in ['Sun', 'Moon', 'Mars', 'Mercury', 'Jupiter', 'Venus', 'Saturn', 'Rahu', 'Ketu']
            }

    lucky_num = rng.randint(1, 9)
    lucky_color = rng.choice(COLORS)
    lucky_day = rng.choice(DAYS)

    # Build context dict for personalized template generation
    report_ctx = {
        "name": name,
        "rasi": rasi,
        "nakshatra": nakshatra,
        "lagna": lagna,
        "zodiac": zodiac,
        "planetary_positions": planetary_positions
    }

    # 4. Check if Gemini API is available and generate personalized horoscopes
    gemini_key = os.environ.get("GEMINI_API_KEY")
    if gemini_key and gemini_key.strip():
        persona = rng.choice(PERSONAS)
        tone = rng.choice(TONES)
        if tab == "pending-karma":
            focus = "Uncovering unresolved past-life debts, recurring karmic cycles, ancestral patterns, and Saturn/Ketu lesson alignment."
        elif tab == "karmic-connections":
            focus = f"Exploring deep spiritual and karmic relationship bonds, mutual soul agreements, and dynamic compatibility with partner {partner_name} (born {partner_dob})."
        elif tab == "soul-purpose":
            focus = "Discovering your true calling, life mission, and ultimate spiritual destiny."
        elif tab == "soul-blueprint":
            focus = "Examine the unique cosmic coding of your character, latent talents, and inherent cosmic strengths."
        elif tab == "soul-alignment":
            focus = "Aligning your daily lifestyle, actions, diet, physical/mental wellness, and energies with current planetary transits."
        else:
            focus = rng.choice(FOCUS_AREAS)
        storytelling = rng.choice(STORYTELLING_FRAMES)

        prompt = f"""
You are a professional astrologer generating a highly personalized, comprehensive destiny report for {name}.
Adopt the persona of {persona['name']}: {persona['description']}
Write the entire report in a {tone} tone.
The primary focus of this reading should be: {focus}
Use {storytelling} as the key storytelling frame throughout the report.

### Input Parameters for Calculation:
- Client Name: {name}
- Date of Birth: {dob}
- Birth Time: {tob}
- Birth Place: {pob}
- Moon Sign (Rasi): {rasi}
- Nakshatra: {nakshatra}
- Ascendant Sign (Lagna): {lagna}
- Solar Zodiac Sign: {zodiac}
- Planetary Positions (House/Sign Placement):
{json.dumps(planetary_positions, indent=2)}

### Critical Writing Requirements:
1. Write in the exact voice, style, and vocabulary of your selected astrologer persona ({persona['name']}).
2. Do not use generic, copy-paste horoscopes or templates. The predictions must feel specifically synthesized for this user, directly referencing their name, birth place, and combining their Rasi, Nakshatra, Lagna, and the positions of all 9 planets in creative sentences.
3. Every single text field in the response JSON must be filled with deep, elaborate, and highly detailed paragraphs of prose. Avoid summaries, lists, bullet points, or generic platitudes.
4. WORD COUNT REQUIREMENT: You must write a total of at least 3000+ words across all sections. 
   - For all 18 sub-fields of 'life_report', write exactly 2-3 long paragraphs of dense, detailed astrological commentary and personalized advice, aiming for at least 150-200 words per subfield.
   - For all 20 forecast sub-fields (today, tomorrow, weekly, monthly), write at least 1 long paragraph of 100+ words detailing cosmic transits and day-to-day/week-to-week/month-to-month strategies.
5. In your analysis, reference the planetary placements directly in the prose (e.g., explain how Rahu in {planetary_positions.get('Rahu', 'Aries')} affects their career timeline, or how Saturn in {planetary_positions.get('Saturn', 'Aries')} influences their karmic lessons).

### Output JSON Format:
Your response must be a single, valid JSON object containing exactly the keys below. Do not wrap the JSON in comments or output anything except the parseable JSON string.

{{
  "today_prediction": {{
    "overall": "Detailed overall daily horoscope prose...",
    "career": "Detailed daily career horoscope prose...",
    "finance": "Detailed daily finance horoscope prose...",
    "relationship": "Detailed daily relationships horoscope prose...",
    "health": "Detailed daily health/vitality horoscope prose..."
  }},
  "tomorrow_prediction": {{
    "energy": "Detailed tomorrow overall energy forecast...",
    "career": "Detailed tomorrow career forecast...",
    "finance": "Detailed tomorrow finance forecast...",
    "relationship": "Detailed tomorrow relationship forecast...",
    "health": "Detailed tomorrow health/wellness forecast..."
  }},
  "weekly_forecast": {{
    "overall": "Detailed weekly overall forecast...",
    "career": "Detailed weekly career forecast...",
    "finance": "Detailed weekly finance forecast...",
    "relationship": "Detailed weekly relationship forecast...",
    "health": "Detailed weekly health/wellness forecast..."
  }},
  "monthly_forecast": {{
    "overall": "Detailed monthly overall forecast...",
    "career": "Detailed monthly career forecast...",
    "finance": "Detailed monthly finance forecast...",
    "relationship": "Detailed monthly relationship forecast...",
    "health": "Detailed monthly health/wellness forecast..."
  }},
  "life_report": {{
    "personality": {{
      "strengths": "Detailed strengths analysis prose...",
      "weaknesses": "Detailed weaknesses analysis prose...",
      "hidden_talents": "Detailed latent talents analysis prose...",
      "emotional_nature": "Detailed emotional core analysis prose..."
    }},
    "career": {{
      "growth": "Detailed career growth timeline prose...",
      "business": "Detailed entrepreneurial potential prose...",
      "leadership": "Detailed leadership styles prose..."
    }},
    "relationship": {{
      "marriage": "Detailed marriage outlook prose...",
      "compatibility": "Detailed compatibility analysis prose...",
      "family": "Detailed domestic alignment prose..."
    }},
    "financial": {{
      "wealth": "Detailed wealth potential prose...",
      "habits": "Detailed spending/saving habits prose...",
      "opportunities": "Detailed abundance windows prose..."
    }},
    "health": {{
      "physical": "Detailed physical constitution prose...",
      "mental": "Detailed mental harmony/mindfulness prose...",
      "lifestyle": "Detailed daily routine and lifestyle roadmap..."
    }},
    "spiritual": {{
      "karma": "Detailed karmic debt and lessons (Saturn) prose...",
      "lessons": "Detailed major soul lessons prose...",
      "purpose": "Detailed divine life purpose prose..."
    }}
  }}
}}
"""

        try:
            url = f"https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key={gemini_key}"
            payload = {
                "contents": [
                    {
                        "parts": [
                            {"text": prompt}
                        ]
                    }
                ],
                "generationConfig": {
                    "responseMimeType": "application/json",
                    "temperature": 1.2,
                    "maxOutputTokens": 65536
                }
            }
            logger.info(f"Calling Gemini API to generate personalized astrology report for {name} using persona: {persona['name']}")
            # Retry logic: attempt up to 2 times
            response = None
            for attempt in range(2):
                try:
                    response = requests.post(url, json=payload, timeout=90)
                    if response.status_code == 200:
                        break
                    logger.warning(f"Gemini API attempt {attempt+1} returned {response.status_code}")
                except requests.exceptions.Timeout:
                    logger.warning(f"Gemini API attempt {attempt+1} timed out")
                    response = None
            if response and response.status_code == 200:
                result_json = response.json()
                text_content = result_json["candidates"][0]["content"]["parts"][0]["text"]
                cleaned_text = clean_json_response(text_content)
                parsed_report = json.loads(cleaned_text)
                
                # Check for standard fields before accepting
                required_keys = ["today_prediction", "tomorrow_prediction", "weekly_forecast", "monthly_forecast", "life_report"]
                if all(k in parsed_report for k in required_keys):
                    parsed_report["astrology_details"] = {
                        "rasi": rasi,
                        "nakshatra": nakshatra,
                        "lagna": lagna,
                        "zodiac": zodiac,
                        "moon_sign": moon_sign,
                        "birth_star": birth_star,
                        "lucky_number": lucky_num,
                        "lucky_color": lucky_color,
                        "lucky_day": lucky_day,
                        "planetary_positions": planetary_positions
                    }
                    return parsed_report
            else:
                err_text = response.text if response else "No response"
                logger.error(f"Gemini API returned error: {err_text}")
        except Exception as api_err:
            logger.error(f"Failed to generate report using Gemini API: {api_err}. Falling back to seeded templates.")

    # Fallback to enriched personalized template generator
    logger.info("Using enriched personalized template fallback for horoscope generation.")
    _gen = lambda key: build_personalized_section(rng, key, report_ctx, fallback_fn=get_seeded_paragraph)

    today_pred = {
        "overall": _gen("today_overall"),
        "career": _gen("today_career"),
        "finance": _gen("today_finance"),
        "relationship": _gen("today_relationship"),
        "health": _gen("today_health")
    }

    tomorrow_pred = {
        "energy": _gen("tomorrow_energy"),
        "career": _gen("tomorrow_career"),
        "finance": _gen("tomorrow_finance"),
        "relationship": _gen("tomorrow_relationship"),
        "health": _gen("tomorrow_health")
    }

    weekly_pred = {
        "overall": _gen("weekly_overall"),
        "career": _gen("weekly_career"),
        "finance": _gen("weekly_finance"),
        "relationship": _gen("weekly_relationship"),
        "health": _gen("weekly_health")
    }

    monthly_pred = {
        "overall": _gen("monthly_overall"),
        "career": _gen("monthly_career"),
        "finance": _gen("monthly_finance"),
        "relationship": _gen("monthly_relationship"),
        "health": _gen("monthly_health")
    }

    life_report = {
        "personality": {
            "strengths": _gen("personality_strengths"),
            "weaknesses": _gen("personality_weaknesses"),
            "hidden_talents": _gen("personality_talents"),
            "emotional_nature": _gen("personality_nature")
        },
        "career": {
            "growth": _gen("career_growth"),
            "business": _gen("career_business"),
            "leadership": _gen("career_leadership")
        },
        "relationship": {
            "marriage": _gen("relationship_marriage"),
            "compatibility": _gen("relationship_compatibility"),
            "family": _gen("relationship_family")
        },
        "financial": {
            "wealth": _gen("financial_wealth"),
            "habits": _gen("financial_habits"),
            "opportunities": _gen("financial_opportunities")
        },
        "health": {
            "physical": _gen("health_physical"),
            "mental": _gen("health_mental"),
            "lifestyle": _gen("health_lifestyle")
        },
        "spiritual": {
            "karma": _gen("spiritual_karma"),
            "lessons": _gen("spiritual_lessons"),
            "purpose": _gen("spiritual_purpose")
        }
    }

    return {
        "astrology_details": {
            "rasi": rasi,
            "nakshatra": nakshatra,
            "lagna": lagna,
            "zodiac": zodiac,
            "moon_sign": moon_sign,
            "birth_star": birth_star,
            "lucky_number": lucky_num,
            "lucky_color": lucky_color,
            "lucky_day": lucky_day,
            "planetary_positions": planetary_positions
        },
        "today_prediction": today_pred,
        "tomorrow_prediction": tomorrow_pred,
        "weekly_forecast": weekly_pred,
        "monthly_forecast": monthly_pred,
        "life_report": life_report
    }

# Endpoint for Generating Horoscope Preview
@api_router.post("/horoscope/generate")
async def generate_horoscope(request: HoroscopeCreate):
    report_id = str(uuid.uuid4())
    req_name = request.name.strip() if (request.name and request.name.strip()) else "Seeker"
    generated = generate_unique_horoscope(
        name=req_name,
        dob=request.dob,
        tob=request.tob,
        pob=request.pob,
        tab=request.tab,
        partner_name=request.partnerName,
        partner_dob=request.partnerDob
    )

    doc = {
        "id": report_id,
        "name": req_name,
        "dob": request.dob,
        "tob": request.tob,
        "pob": request.pob,
        "tab": request.tab,
        "partner_name": request.partnerName,
        "partner_dob": request.partnerDob,
        "timestamp": datetime.now(timezone.utc).isoformat(),
        "is_paid": False,
        "astrology_details": generated["astrology_details"],
        "today_prediction": generated["today_prediction"],
        "tomorrow_prediction": generated["tomorrow_prediction"],
        "weekly_forecast": generated.get("weekly_forecast", {}),
        "monthly_forecast": generated.get("monthly_forecast", {}),
        "life_report": generated["life_report"]
    }

    # Save to DB
    global use_local_db
    if not use_local_db:
        try:
            await db.horoscope_reports.insert_one(doc)
        except Exception as e:
            logger.warning(f"Failed to insert horoscope into MongoDB: {e}. Falling back to local DB.")
            use_local_db = True

    if use_local_db:
        local_data = read_local_db()
        doc.pop('_id', None)
        local_data["horoscope_reports"].append(doc)
        write_local_db(local_data)

    # Return preview (mask all sections of life_report except personality, and mask weekly/monthly forecasts unless calculator request)
    if request.is_calculator:
        preview_life_report = generated["life_report"]
        preview_weekly = generated.get("weekly_forecast", {})
        preview_monthly = generated.get("monthly_forecast", {})
    else:
        preview_life_report = {
            "personality": generated["life_report"]["personality"],
            "career": {k: f"🔒 [Locked Section: Career Forecast] Complete details are locked. Unlock the premium report to view your personalized {k} outlook." for k in generated["life_report"]["career"].keys()},
            "relationship": {k: f"🔒 [Locked Section: Marriage & Compatibility] Details are currently encrypted. Unlock the premium report to read your {k} outlook." for k in generated["life_report"]["relationship"].keys()},
            "financial": {k: f"🔒 [Locked Section: Wealth & Money] Wealth potential details are locked. Unlock the premium report to read your complete {k} outlook." for k in generated["life_report"]["financial"].keys()},
            "health": {k: f"🔒 [Locked Section: Health & Lifestyle] Physical and mental wellness details are locked. Unlock the premium report to read your {k} guidance." for k in generated["life_report"]["health"].keys()},
            "spiritual": {k: f"🔒 [Locked Section: Karma & Purpose] Karmic roadmap details are locked. Unlock the premium report to read your {k} analysis." for k in generated["life_report"]["spiritual"].keys()}
        }
        preview_weekly = {k: f"🔒 [Locked Section: Weekly Forecast] Complete details are locked. Unlock the premium report to view your personalized weekly {k} forecast." for k in generated.get("weekly_forecast", {}).keys()}
        preview_monthly = {k: f"🔒 [Locked Section: Monthly Forecast] Complete details are locked. Unlock the premium report to view your personalized monthly {k} forecast." for k in generated.get("monthly_forecast", {}).keys()}

    return {
        "id": report_id,
        "name": request.name,
        "dob": request.dob,
        "tob": request.tob,
        "pob": request.pob,
        "timestamp": doc["timestamp"],
        "is_paid": request.is_calculator,
        "astrology_details": generated["astrology_details"],
        "today_prediction": generated["today_prediction"],
        "tomorrow_prediction": generated["tomorrow_prediction"],
        "weekly_forecast": preview_weekly,
        "monthly_forecast": preview_monthly,
        "life_report": preview_life_report
    }

# Endpoint for Generating Razorpay Order
@api_router.post("/horoscope/create-order")
async def create_razorpay_order(request: OrderCreate):
    # Charge amount for premium report: ₹499 (49900 paise)
    amount = 49900
    currency = "INR"
    
    if razorpay_client and not RAZORPAY_KEY_ID.startswith("rzp_test_dummy"):
        try:
            order_data = {
                "amount": amount,
                "currency": currency,
                "receipt": request.report_id,
                "payment_capture": 1
            }
            order = razorpay_client.order.create(data=order_data)
            return {
                "order_id": order["id"],
                "amount": order["amount"],
                "currency": order["currency"],
                "key_id": RAZORPAY_KEY_ID,
                "is_mock": False
            }
        except Exception as e:
            logger.error(f"Razorpay order creation failed: {e}. Falling back to mock order.")
            
    # Mock order fallback for offline development or missing keys
    mock_order_id = f"order_mock_{uuid.uuid4().hex[:14].upper()}"
    return {
        "order_id": mock_order_id,
        "amount": amount,
        "currency": currency,
        "key_id": RAZORPAY_KEY_ID,
        "is_mock": True
    }

# Endpoint for Unlocking Premium Report
@api_router.post("/horoscope/unlock")
async def unlock_horoscope(request: HoroscopeUnlock):
    # If using real Razorpay checkout, verify the payment signature
    is_mock_payment = (
        request.payment_id.startswith("MOCK_TXN_") or 
        request.razorpay_order_id.startswith("order_mock_") or 
        not razorpay_client or 
        RAZORPAY_KEY_ID.startswith("rzp_test_dummy")
    )
    
    if not is_mock_payment:
        try:
            params_dict = {
                'razorpay_order_id': request.razorpay_order_id,
                'razorpay_payment_id': request.payment_id,
                'razorpay_signature': request.razorpay_signature
            }
            razorpay_client.utility.verify_payment_signature(params_dict)
            logger.info(f"Razorpay payment signature verified successfully for order {request.razorpay_order_id}")
        except Exception as e:
            logger.error(f"Razorpay signature verification failed: {e}")
            raise HTTPException(status_code=400, detail="Invalid payment signature or verification failure")
            
    global use_local_db
    report = None

    if not use_local_db:
        try:
            report = await db.horoscope_reports.find_one({"id": request.report_id})
            if report:
                await db.horoscope_reports.update_one(
                    {"id": request.report_id},
                    {"$set": {"is_paid": True}}
                )
                report["is_paid"] = True
        except Exception as e:
            logger.warning(f"MongoDB unlock lookup failed: {e}. Falling back to local DB.")
            use_local_db = True

    if use_local_db:
        local_data = read_local_db()
        found = False
        for r in local_data["horoscope_reports"]:
            if r["id"] == request.report_id:
                r["is_paid"] = True
                report = r
                found = True
                break
        if found:
            write_local_db(local_data)

    if not report:
        raise HTTPException(status_code=404, detail="Horoscope report not found")

    # Generate a mock PDF download link
    mock_pdf_filename = f"destiny_report_{request.report_id}.pdf"
    mock_pdf_path = UPLOAD_DIR / mock_pdf_filename
    
    # Write a quick placeholder file in uploads
    try:
        with open(mock_pdf_path, "w") as f:
            f.write(f"Astro Power 24 Premium Destiny Report for {report['name']}\n")
            f.write(f"Report ID: {report['id']}\n")
            f.write(f"Generated at: {report['timestamp']}\n")
            f.write(f"Zodiac: {report['astrology_details']['zodiac']}\n")
            f.write(f"This PDF simulates a generated copy emailed to the client.\n")
    except Exception as e:
        logger.error(f"Error creating mock PDF: {e}")

    logger.info(f"PDF generated and emailed successfully for {report['name']}.")

    return {
        "success": True,
        "id": report["id"],
        "name": report["name"],
        "dob": report["dob"],
        "tob": report["tob"],
        "pob": report.get("pob", ""),
        "timestamp": report["timestamp"],
        "is_paid": True,
        "pdf_url": f"/uploads/{mock_pdf_filename}",
        "astrology_details": report["astrology_details"],
        "today_prediction": report["today_prediction"],
        "tomorrow_prediction": report["tomorrow_prediction"],
        "weekly_forecast": report.get("weekly_forecast", {}),
        "monthly_forecast": report.get("monthly_forecast", {}),
        "life_report": report["life_report"]
    }

# Endpoint for Listing Generated Reports in Admin Panel
@api_router.get("/horoscope/reports")
async def get_horoscope_reports(admin: str = Depends(get_current_admin)):
    global use_local_db
    if not use_local_db:
        try:
            reports = await db.horoscope_reports.find({}, {"_id": 0}).to_list(1000)
            return reports
        except Exception as e:
            logger.warning(f"Failed to query horoscope reports from MongoDB: {e}. Falling back to local DB.")
            use_local_db = True

    local_data = read_local_db()
    return local_data.get("horoscope_reports", [])

# Endpoint for Fetching a Single Report
@api_router.get("/horoscope/reports/{report_id}")
async def get_horoscope_report(report_id: str):
    global use_local_db
    report = None
    if not use_local_db:
        try:
            report = await db.horoscope_reports.find_one({"id": report_id}, {"_id": 0})
        except Exception as e:
            logger.warning(f"Failed to fetch horoscope report from MongoDB: {e}. Falling back to local DB.")
            use_local_db = True

    if use_local_db or not report:
        local_data = read_local_db()
        for r in local_data.get("horoscope_reports", []):
            if r["id"] == report_id:
                report = dict(r)
                break

    if not report:
        raise HTTPException(status_code=404, detail="Horoscope report not found")

    is_paid = report.get("is_paid", False)
    
    if not is_paid:
        preview_life_report = {
            "personality": report["life_report"].get("personality", {}),
            "career": {k: f"🔒 [Locked Section: Career Forecast] Complete details are locked. Unlock the premium report to view your personalized {k} outlook." for k in report["life_report"].get("career", {}).keys()},
            "relationship": {k: f"🔒 [Locked Section: Marriage & Compatibility] Details are currently encrypted. Unlock the premium report to read your {k} outlook." for k in report["life_report"].get("relationship", {}).keys()},
            "financial": {k: f"🔒 [Locked Section: Wealth & Money] Wealth potential details are locked. Unlock the premium report to read your complete {k} outlook." for k in report["life_report"].get("financial", {}).keys()},
            "health": {k: f"🔒 [Locked Section: Health & Lifestyle] Physical and mental wellness details are locked. Unlock the premium report to read your {k} guidance." for k in report["life_report"].get("health", {}).keys()},
            "spiritual": {k: f"🔒 [Locked Section: Karma & Purpose] Karmic roadmap details are locked. Unlock the premium report to read your {k} analysis." for k in report["life_report"].get("spiritual", {}).keys()}
        }
        preview_weekly = {k: f"🔒 [Locked Section: Weekly Forecast] Complete details are locked. Unlock the premium report to view your personalized weekly {k} forecast." for k in report.get("weekly_forecast", {}).keys()}
        preview_monthly = {k: f"🔒 [Locked Section: Monthly Forecast] Complete details are locked. Unlock the premium report to view your personalized monthly {k} forecast." for k in report.get("monthly_forecast", {}).keys()}
        return {
            "id": report["id"],
            "name": report["name"],
            "dob": report["dob"],
            "tob": report["tob"],
            "pob": report.get("pob", ""),
            "timestamp": report["timestamp"],
            "is_paid": False,
            "astrology_details": report["astrology_details"],
            "today_prediction": report["today_prediction"],
            "tomorrow_prediction": report["tomorrow_prediction"],
            "weekly_forecast": preview_weekly,
            "monthly_forecast": preview_monthly,
            "life_report": preview_life_report
        }
    else:
        mock_pdf_filename = f"destiny_report_{report_id}.pdf"
        return {
            "id": report["id"],
            "name": report["name"],
            "dob": report["dob"],
            "tob": report["tob"],
            "pob": report.get("pob", ""),
            "timestamp": report["timestamp"],
            "is_paid": True,
            "pdf_url": f"/uploads/{mock_pdf_filename}",
            "astrology_details": report["astrology_details"],
            "today_prediction": report["today_prediction"],
            "tomorrow_prediction": report["tomorrow_prediction"],
            "weekly_forecast": report.get("weekly_forecast", {}),
            "monthly_forecast": report.get("monthly_forecast", {}),
            "life_report": report["life_report"]
        }

# Include the router in the main app
app.include_router(api_router)

# Mount the static files directory
app.mount("/uploads", StaticFiles(directory=str(UPLOAD_DIR)), name="uploads")

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=os.environ.get('CORS_ORIGINS', '*').split(','),
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("shutdown")
async def shutdown_db_client():
    if client:
        client.close()