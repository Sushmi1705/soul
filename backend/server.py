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
from datetime import datetime, timezone, timedelta
from jose import jwt, JWTError

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
        return {"status_checks": [], "blogs": []}
    try:
        with open(DB_FILE, "r") as f:
            return json.load(f)
    except Exception as e:
        logger.error(f"Error reading local DB file: {e}")
        return {"status_checks": [], "blogs": []}

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