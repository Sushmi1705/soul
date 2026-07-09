"""
muhurat_engine.py
Swiss Ephemeris-powered Muhurat Calculation Engine for Hindu Ceremonies.
Computes accurate auspicious dates and time windows using astronomical calculations.
"""

import libephemeris as swe
from datetime import datetime, timedelta, timezone
import math
import logging
from typing import List, Dict, Optional, Tuple

logger = logging.getLogger(__name__)

# ═══════════════════════════════════════════════════════════════════════
# CONSTANTS
# ═══════════════════════════════════════════════════════════════════════

NAKSHATRA_NAMES = [
    "Aswini", "Bharani", "Krithika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Aslesha", "Makha", "Purvaphalguni", "Uttaraphalguni",
    "Hasta", "Chitta", "Swathi", "Vishhaka", "Anuradha", "Jyeshta",
    "Moola", "Poorvashada", "Uttarashada", "Sravana", "Dhanishta",
    "Sathabhisha", "Purvabhadra", "Uttarabhadra", "Revathi"
]

TITHI_NAMES = [
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Purnima",
    "Pratipada", "Dwitiya", "Tritiya", "Chaturthi", "Panchami",
    "Shashthi", "Saptami", "Ashtami", "Navami", "Dashami",
    "Ekadashi", "Dwadashi", "Trayodashi", "Chaturdashi", "Amavasya"
]

ZODIAC_SIGNS = [
    "Aries", "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
    "Libra", "Scorpio", "Sagittarius", "Capricorn", "Aquarius", "Pisces"
]

DAY_NAMES = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]

# Rahu Kaal: which 1/8th part of the day is Rahu Kaal (weekday 0=Mon)
RAHU_PARTS = {0: 2, 1: 7, 2: 5, 3: 6, 4: 4, 5: 3, 6: 8}
# Yama Gandha
YAMA_PARTS = {0: 5, 1: 4, 2: 3, 3: 2, 4: 8, 5: 7, 6: 6}
# Gulika Kaal
GULIKA_PARTS = {0: 6, 1: 5, 2: 4, 3: 3, 4: 2, 5: 1, 6: 7}

# ═══════════════════════════════════════════════════════════════════════
# CEREMONY RULES (based on Muhurat Chintamani / Dharmashastra)
# ═══════════════════════════════════════════════════════════════════════

# All nakshatras except Bharani (matches verified reference data)
_ALL_AUSPICIOUS_NAKSHATRAS = [
    "Aswini", "Krithika", "Rohini", "Mrigashira", "Ardra",
    "Punarvasu", "Pushya", "Aslesha", "Makha", "Purvaphalguni",
    "Uttaraphalguni", "Hasta", "Chitta", "Swathi", "Vishhaka",
    "Anuradha", "Jyeshta", "Moola", "Poorvashada", "Uttarashada",
    "Sravana", "Dhanishta", "Sathabhisha", "Purvabhadra",
    "Uttarabhadra", "Revathi"
]

CEREMONY_RULES = {
    "yagyopavit": {
        "title": "Yagyopavit / Upanayana Muhurat",
        "desc": "The sacred thread ceremony (Upanayana or Yagyopavit) signifies the initiation of a student into education, spiritual practices, and moral responsibilities.",
        "auspicious_tithis": [1, 2, 3, 4, 5, 9, 10, 11, 12, 15],
        "shukla_only": False,
        "avoid_krishna_after": 6,  # avoid Krishna Shashthi onwards
        "auspicious_nakshatras": _ALL_AUSPICIOUS_NAKSHATRAS,
        "excluded_weekdays": [1],  # Tuesday
        "auspicious_lagnas": [
            "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
            "Sagittarius", "Aquarius", "Pisces"
        ],
        "avoid_adhik_maas": True,
    },
    "annaprashana": {
        "title": "Annaprashana Muhurat",
        "desc": "Annaprashana marks a baby's transition from liquids to solid food. Performing this ceremony during a Shubh Muhurat ensures excellent health and longevity.",
        "auspicious_tithis": [1, 2, 3, 4, 5, 9, 10, 11, 12, 13, 15],
        "shukla_only": False,
        "avoid_krishna_after": 6,
        "auspicious_nakshatras": _ALL_AUSPICIOUS_NAKSHATRAS,
        "excluded_weekdays": [1],  # Tuesday
        "auspicious_lagnas": [
            "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
            "Libra", "Sagittarius", "Aquarius", "Pisces"
        ],
        "avoid_adhik_maas": True,
    },
    "vidyarambh": {
        "title": "Vidyarambh Muhurat",
        "desc": "Vidyarambh marks the formal initiation of a child into the world of letters and learning, enhancing intellectual capacity and artistic capability.",
        "auspicious_tithis": [1, 2, 3, 4, 5, 9, 10, 11, 12, 15],
        "shukla_only": False,
        "avoid_krishna_after": 6,
        "auspicious_nakshatras": _ALL_AUSPICIOUS_NAKSHATRAS,
        "excluded_weekdays": [1, 5],  # Tuesday, Saturday
        "auspicious_lagnas": [
            "Taurus", "Gemini", "Leo", "Virgo",
            "Sagittarius", "Aquarius", "Pisces"
        ],
        "avoid_adhik_maas": True,
    },
    "namkaran": {
        "title": "Namkaran Muhurat",
        "desc": "The naming ceremony (Namkaran) is one of the most vital rites of passage. Choosing a name under positive planetary configurations aligns identity with strength and luck.",
        "auspicious_tithis": [1, 2, 3, 4, 5, 9, 10, 11, 12, 13, 15],
        "shukla_only": False,
        "avoid_krishna_after": 6,
        "auspicious_nakshatras": _ALL_AUSPICIOUS_NAKSHATRAS,
        "excluded_weekdays": [1],  # Tuesday
        "auspicious_lagnas": [
            "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
            "Libra", "Sagittarius", "Aquarius", "Pisces"
        ],
        "avoid_adhik_maas": True,
    },
    "vivah": {
        "title": "Vivah Muhurat",
        "desc": "Vivah Muhurat is selected with extreme care to ensure compatibility, longevity, happiness, and prosperity in a marriage.",
        "auspicious_tithis": [2, 3, 5, 7, 10, 11, 12, 13],
        "shukla_only": False,
        "avoid_krishna_after": 6,
        "auspicious_nakshatras": [
            "Rohini", "Mrigashira", "Makha", "Uttaraphalguni",
            "Hasta", "Swathi", "Anuradha", "Moola",
            "Uttarashada", "Sravana", "Uttarabhadra", "Revathi"
        ],
        "excluded_weekdays": [1, 5],  # Tuesday, Saturday
        "auspicious_lagnas": [
            "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
            "Libra", "Sagittarius", "Aquarius", "Pisces"
        ],
        "avoid_adhik_maas": True,
    },
    "mundan": {
        "title": "Mundan Muhurat",
        "desc": "Mundan (tonsure) cleanses past-life residues and stimulates excellent hair growth and intellectual development in children.",
        "auspicious_tithis": [1, 2, 3, 4, 5, 9, 10, 11, 12, 15],
        "shukla_only": False,
        "avoid_krishna_after": 6,
        "auspicious_nakshatras": _ALL_AUSPICIOUS_NAKSHATRAS,
        "excluded_weekdays": [1],  # Tuesday
        "auspicious_lagnas": [
            "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
            "Sagittarius", "Aquarius", "Pisces"
        ],
        "avoid_adhik_maas": True,
    },
    "karnavedha": {
        "title": "Karnavedha Muhurat",
        "desc": "Karnavedha (ear piercing) stimulates vital acupressure points that enhance intellectual capabilities and sensory organs.",
        "auspicious_tithis": [1, 2, 3, 4, 5, 9, 10, 11, 12, 13, 15],
        "shukla_only": False,
        "avoid_krishna_after": 6,
        "auspicious_nakshatras": _ALL_AUSPICIOUS_NAKSHATRAS,
        "excluded_weekdays": [1, 5],  # Tuesday, Saturday
        "auspicious_lagnas": [
            "Taurus", "Gemini", "Cancer", "Leo", "Virgo",
            "Libra", "Sagittarius", "Aquarius", "Pisces"
        ],
        "avoid_adhik_maas": True,
    },
}

# ═══════════════════════════════════════════════════════════════════════
# ASTRONOMICAL HELPER FUNCTIONS
# ═══════════════════════════════════════════════════════════════════════

def _init_swe():
    """Initialize Swiss Ephemeris with Lahiri Ayanamsa."""
    swe.set_sid_mode(swe.SIDM_LAHIRI, 0.0, 0.0)

def _datetime_to_jd(dt_utc: datetime) -> float:
    """Convert UTC datetime to Julian Day."""
    ut_hour = dt_utc.hour + dt_utc.minute / 60.0 + dt_utc.second / 3600.0
    return swe.julday(dt_utc.year, dt_utc.month, dt_utc.day, ut_hour)

def _jd_to_datetime(jd: float) -> datetime:
    """Convert Julian Day back to UTC datetime (approximate)."""
    # swe.revjul returns (year, month, day, hour_float)
    y, m, d, h = swe.revjul(jd)
    hour = int(h)
    minute = int((h - hour) * 60)
    second = int(((h - hour) * 60 - minute) * 60)
    return datetime(y, m, d, hour, minute, max(0, min(59, second)), tzinfo=timezone.utc)

def _get_zodiac_sign(lon_deg: float) -> str:
    """Get zodiac sign name from sidereal longitude."""
    idx = int((lon_deg % 360.0) / 30.0)
    return ZODIAC_SIGNS[idx]

def _get_nakshatra_name(moon_lon: float) -> str:
    """Get nakshatra name (without pada) from sidereal Moon longitude."""
    nak_width = 360.0 / 27.0
    nak_idx = int((moon_lon % 360.0) / nak_width)
    return NAKSHATRA_NAMES[nak_idx]

def _get_tithi(jd: float) -> Dict:
    """
    Calculate Tithi from Julian Day.
    Tithi = floor((Moon_lon - Sun_lon) % 360 / 12)
    Returns dict with index (0-29), name, paksha, and tithi number within paksha.
    """
    _init_swe()
    sun_res, _ = swe.calc_ut(jd, swe.SUN, swe.FLG_SIDEREAL)
    moon_res, _ = swe.calc_ut(jd, swe.MOON, swe.FLG_SIDEREAL)
    sun_lon = sun_res[0]
    moon_lon = moon_res[0]

    diff = (moon_lon - sun_lon) % 360.0
    tithi_idx = int(diff / 12.0)
    if tithi_idx >= 30:
        tithi_idx = 29

    paksha = "Shukla" if tithi_idx < 15 else "Krishna"
    tithi_num = (tithi_idx % 15) + 1  # 1-15 within paksha

    return {
        "index": tithi_idx,
        "name": TITHI_NAMES[tithi_idx],
        "paksha": paksha,
        "number": tithi_num,  # 1-15
    }

def _get_moon_nakshatra(jd: float) -> str:
    """Get Moon's nakshatra at a given Julian Day."""
    _init_swe()
    moon_res, _ = swe.calc_ut(jd, swe.MOON, swe.FLG_SIDEREAL)
    return _get_nakshatra_name(moon_res[0])

def _calculate_sunrise_sunset(dt_utc: datetime, lat: float, lon: float) -> Tuple[float, float, float]:
    """
    Calculate sunrise, sunset, and solar noon in UTC decimal hours.
    Uses the same formula as existing panchang endpoint for consistency.
    Returns (sunrise_utc, sunset_utc, noon_utc) as decimal hours.
    """
    n = dt_utc.timetuple().tm_yday
    dec = 0.4092 * math.sin(2 * math.pi / 365 * (n - 81))
    lat_rad = math.radians(lat)

    b = 2 * math.pi / 364 * (n - 81)
    eq_time = 9.87 * math.sin(2 * b) - 7.53 * math.cos(b) - 1.5 * math.sin(b)

    solar_noon_utc = 12.0 - (lon / 15.0) - (eq_time / 60.0)

    cos_h = (math.cos(math.radians(90.833)) - math.sin(lat_rad) * math.sin(dec)) / \
            (math.cos(lat_rad) * math.cos(dec))

    if cos_h > 1 or cos_h < -1:
        # Polar region fallback
        return 6.0, 18.0, solar_noon_utc

    H = math.acos(cos_h)
    h_hours = math.degrees(H) / 15.0

    return solar_noon_utc - h_hours, solar_noon_utc + h_hours, solar_noon_utc

def _get_inauspicious_periods(sunrise_local: float, sunset_local: float, weekday: int) -> List[Tuple[float, float]]:
    """
    Calculate Rahu Kaal and Gulika Kaal periods (local decimal hours).
    Returns list of (start, end) tuples representing inauspicious periods.
    """
    day_length = (sunset_local - sunrise_local) % 24
    day_part = day_length / 8.0

    periods = []

    # Rahu Kaal
    rahu_idx = RAHU_PARTS.get(weekday, 2)
    rahu_start = sunrise_local + (rahu_idx - 1) * day_part
    rahu_end = sunrise_local + rahu_idx * day_part
    periods.append((rahu_start, rahu_end))

    # Gulika Kaal
    gulika_idx = GULIKA_PARTS.get(weekday, 6)
    gulika_start = sunrise_local + (gulika_idx - 1) * day_part
    gulika_end = sunrise_local + gulika_idx * day_part
    periods.append((gulika_start, gulika_end))

    return periods

def _get_lagna_at_time(jd: float, lat: float, lon: float) -> str:
    """Calculate the Ascendant (Lagna) zodiac sign at a given Julian Day."""
    _init_swe()
    try:
        _, ascmc = swe.houses_ex(jd, lat, lon, ord('E'), swe.FLG_SIDEREAL)
        return _get_zodiac_sign(ascmc[0])
    except Exception:
        return "Aries"  # Fallback

# ═══════════════════════════════════════════════════════════════════════
# INTERVAL ARITHMETIC HELPERS
# ═══════════════════════════════════════════════════════════════════════

def _subtract_periods(windows: List[Tuple[float, float]],
                      exclusions: List[Tuple[float, float]]) -> List[Tuple[float, float]]:
    """
    Subtract exclusion periods from auspicious windows.
    All values are in local decimal hours.
    """
    result = list(windows)
    for ex_start, ex_end in exclusions:
        new_result = []
        for w_start, w_end in result:
            if ex_end <= w_start or ex_start >= w_end:
                # No overlap
                new_result.append((w_start, w_end))
            elif ex_start <= w_start and ex_end >= w_end:
                # Complete overlap — window removed
                pass
            elif ex_start > w_start and ex_end < w_end:
                # Exclusion in middle — split window
                new_result.append((w_start, ex_start))
                new_result.append((ex_end, w_end))
            elif ex_start <= w_start:
                # Exclusion covers start
                if ex_end < w_end:
                    new_result.append((ex_end, w_end))
            elif ex_end >= w_end:
                # Exclusion covers end
                if ex_start > w_start:
                    new_result.append((w_start, ex_start))
        result = new_result
    return result

def _merge_windows(windows: List[Tuple[float, float]], gap_minutes: float = 5.0) -> List[Tuple[float, float]]:
    """Merge adjacent or overlapping time windows. Gap tolerance in minutes."""
    if not windows:
        return []
    sorted_w = sorted(windows, key=lambda x: x[0])
    merged = [sorted_w[0]]
    gap = gap_minutes / 60.0  # Convert to hours

    for start, end in sorted_w[1:]:
        last_start, last_end = merged[-1]
        if start <= last_end + gap:
            merged[-1] = (last_start, max(last_end, end))
        else:
            merged.append((start, end))
    return merged

def _format_decimal_hour(h: float) -> str:
    """Convert decimal hours to HH:MM format (24-hour)."""
    h = h % 24
    hours = int(h)
    minutes = int(round((h - hours) * 60))
    if minutes == 60:
        hours = (hours + 1) % 24
        minutes = 0
    return f"{hours:02d}:{minutes:02d}"

# ═══════════════════════════════════════════════════════════════════════
# ADHIK MAAS (Extra Month) DETECTION
# ═══════════════════════════════════════════════════════════════════════

def _is_adhik_maas(jd: float) -> bool:
    """
    Check if a date falls in Adhik Maas (intercalary month).
    In 2026, Adhik Maas is approximately May 15 - June 13.
    In 2027, it does not occur.
    For precise calculation, we check if no Sankranti (solar ingress)
    occurs during the lunar month. Simplified approach uses known dates.
    """
    dt = _jd_to_datetime(jd)
    year = dt.year
    month = dt.month
    day = dt.day

    if year == 2026:
        # Adhik Jyeshtha: approx May 15 to June 13, 2026
        if (month == 5 and day >= 15) or (month == 6 and day <= 13):
            return True
    # 2027 has no Adhik Maas
    return False

# ═══════════════════════════════════════════════════════════════════════
# CORE MUHURAT CALCULATION
# ═══════════════════════════════════════════════════════════════════════

def compute_muhurat_for_day(
    date: datetime,
    lat: float,
    lon: float,
    tz_offset_hours: float,
    ceremony_type: str
) -> Optional[Dict]:
    """
    Compute muhurat windows for a single day and ceremony type.
    
    Returns a dict with date info and time windows, or None if the day
    is not auspicious for this ceremony.
    """
    rules = CEREMONY_RULES.get(ceremony_type)
    if not rules:
        return None

    _init_swe()

    # Build UTC datetime for sunrise calculation
    dt_utc = datetime(date.year, date.month, date.day, 12, 0, 0, tzinfo=timezone.utc)
    dt_utc = dt_utc - timedelta(hours=tz_offset_hours)  # Approximate noon in local time

    # 1. Calculate sunrise/sunset (UTC decimal hours)
    sunrise_utc, sunset_utc, noon_utc = _calculate_sunrise_sunset(dt_utc, lat, lon)

    # Convert to local decimal hours
    sunrise_local = (sunrise_utc + tz_offset_hours) % 24
    sunset_local = (sunset_utc + tz_offset_hours) % 24
    if sunset_local < sunrise_local:
        sunset_local += 24  # Handle wrap-around

    # 2. Calculate Julian Day at local sunrise
    sunrise_dt_utc = datetime(date.year, date.month, date.day, 0, 0, 0, tzinfo=timezone.utc)
    sunrise_dt_utc = sunrise_dt_utc + timedelta(hours=sunrise_utc)
    jd_sunrise = _datetime_to_jd(sunrise_dt_utc)

    # 3. Check Tithi at sunrise
    tithi = _get_tithi(jd_sunrise)
    tithi_num = tithi["number"]  # 1-15 within paksha

    if tithi_num not in rules["auspicious_tithis"]:
        return None

    # Check Shukla/Krishna restrictions
    if rules.get("shukla_only") and tithi["paksha"] == "Krishna":
        return None

    avoid_after = rules.get("avoid_krishna_after", 15)
    if tithi["paksha"] == "Krishna" and tithi_num >= avoid_after:
        return None

    # 4. Check Nakshatra at sunrise
    nakshatra = _get_moon_nakshatra(jd_sunrise)
    if nakshatra not in rules["auspicious_nakshatras"]:
        return None

    # 5. Check weekday
    weekday = date.weekday()  # 0=Mon, 6=Sun
    if weekday in rules.get("excluded_weekdays", []):
        return None

    # 6. Check Adhik Maas
    if rules.get("avoid_adhik_maas") and _is_adhik_maas(jd_sunrise):
        return None

    # ─── DAY IS AUSPICIOUS — Now compute time windows ─────────────

    # 7. Calculate Lagna-based auspicious windows
    auspicious_lagnas = rules.get("auspicious_lagnas", ZODIAC_SIGNS)
    lagna_windows = _compute_lagna_windows(
        date, sunrise_local, sunset_local,
        tz_offset_hours, lat, lon, auspicious_lagnas
    )

    if not lagna_windows:
        return None

    # 8. Get inauspicious periods
    inauspicious = _get_inauspicious_periods(sunrise_local, sunset_local, weekday)

    # 9. Subtract inauspicious periods from auspicious windows
    final_windows = _subtract_periods(lagna_windows, inauspicious)

    # 10. Merge nearby windows and filter tiny ones (< 15 min)
    final_windows = _merge_windows(final_windows)
    final_windows = [(s, e) for s, e in final_windows if (e - s) * 60 >= 15]

    if not final_windows:
        return None

    # Format output
    time_strings = [
        f"{_format_decimal_hour(s)}-{_format_decimal_hour(e)}"
        for s, e in final_windows
    ]

    return {
        "date": date.strftime("%d/%m/%Y"),
        "date_display": date.strftime("%B %d, %Y"),
        "day": DAY_NAMES[weekday],
        "tithi": f"{tithi['paksha']} {tithi['name']}",
        "nakshatra": nakshatra,
        "time_windows": time_strings,
        "time_display": ", ".join(time_strings),
    }

def _compute_lagna_windows(
    date: datetime,
    sunrise_local: float,
    sunset_local: float,
    tz_offset_hours: float,
    lat: float,
    lon: float,
    auspicious_lagnas: List[str],
    interval_minutes: int = 5
) -> List[Tuple[float, float]]:
    """
    Compute time windows where an auspicious Lagna is rising.
    Iterates through the day at `interval_minutes` intervals,
    checks the Ascendant sign, and builds windows.
    """
    windows = []
    current_window_start = None
    in_auspicious = False

    # Iterate from sunrise to sunset
    t = sunrise_local
    step = interval_minutes / 60.0  # Convert to hours

    while t <= sunset_local:
        # Convert local time to UTC JD
        local_hours_from_midnight = t % 24
        utc_hours = local_hours_from_midnight - tz_offset_hours
        dt_utc = datetime(date.year, date.month, date.day, 0, 0, 0, tzinfo=timezone.utc)
        dt_utc = dt_utc + timedelta(hours=utc_hours)
        jd = _datetime_to_jd(dt_utc)

        # Get Lagna at this time
        lagna = _get_lagna_at_time(jd, lat, lon)
        is_auspicious = lagna in auspicious_lagnas

        if is_auspicious and not in_auspicious:
            # Start new auspicious window
            current_window_start = t
            in_auspicious = True
        elif not is_auspicious and in_auspicious:
            # End current auspicious window
            windows.append((current_window_start, t))
            in_auspicious = False

        t += step

    # Close any open window at sunset
    if in_auspicious and current_window_start is not None:
        windows.append((current_window_start, min(t, sunset_local)))

    return windows

# ═══════════════════════════════════════════════════════════════════════
# YEAR MUHURAT GENERATOR
# ═══════════════════════════════════════════════════════════════════════

def generate_year_muhurats(
    year: int,
    ceremony_type: str,
    lat: float = 28.6139,
    lon: float = 77.2090,
    tz_offset_hours: float = 5.5
) -> Dict:
    """
    Generate all muhurat dates for a given year and ceremony type.
    Default location: New Delhi (28.6139, 77.2090), IST (+05:30).
    
    Returns a structured dict grouped by month.
    """
    rules = CEREMONY_RULES.get(ceremony_type)
    if not rules:
        return {"error": f"Unknown ceremony type: {ceremony_type}"}

    _init_swe()

    months_data = {}
    total_dates = 0
    month_names = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ]

    start_date = datetime(year, 1, 1)
    end_date = datetime(year, 12, 31)
    current = start_date

    while current <= end_date:
        result = compute_muhurat_for_day(current, lat, lon, tz_offset_hours, ceremony_type)

        if result:
            month_name = month_names[current.month - 1]
            if month_name not in months_data:
                months_data[month_name] = []
            months_data[month_name].append(result)
            total_dates += 1

        current += timedelta(days=1)

    return {
        "ceremony": ceremony_type,
        "title": rules["title"] + f" {year}",
        "desc": rules["desc"],
        "year": year,
        "location": {"lat": lat, "lon": lon, "tz_offset": tz_offset_hours},
        "source": "Swiss Ephemeris (Lahiri Ayanamsa)",
        "total_dates": total_dates,
        "months": months_data,
    }

# ═══════════════════════════════════════════════════════════════════════
# IN-MEMORY CACHE
# ═══════════════════════════════════════════════════════════════════════

_MUHURAT_CACHE: Dict[str, Dict] = {}

def _cache_key(year: int, ceremony: str, lat: float, lon: float) -> str:
    """Generate cache key. Round lat/lon to 1 decimal for nearby city sharing."""
    return f"{year}:{ceremony}:{round(lat, 1)}:{round(lon, 1)}"

def get_cached_muhurats(
    year: int,
    ceremony_type: str,
    lat: float = 28.6139,
    lon: float = 77.2090,
    tz_offset_hours: float = 5.5
) -> Dict:
    """
    Get muhurat data from cache, or compute and cache if not available.
    """
    key = _cache_key(year, ceremony_type, lat, lon)

    if key in _MUHURAT_CACHE:
        return _MUHURAT_CACHE[key]

    logger.info(f"Computing muhurats: year={year}, ceremony={ceremony_type}, "
                f"lat={lat}, lon={lon}")

    data = generate_year_muhurats(year, ceremony_type, lat, lon, tz_offset_hours)
    _MUHURAT_CACHE[key] = data

    logger.info(f"Cached muhurats: {data.get('total_dates', 0)} dates for {ceremony_type} {year}")
    return data

def get_all_ceremonies() -> List[Dict]:
    """Return list of available ceremony types with metadata."""
    return [
        {"id": key, "title": rules["title"], "desc": rules["desc"]}
        for key, rules in CEREMONY_RULES.items()
    ]

def precompute_default_city(years: List[int] = None):
    """
    Pre-compute muhurat data for New Delhi for all ceremonies.
    Call this on server startup for instant first-request response.
    """
    if years is None:
        years = [2026, 2027]

    for year in years:
        for ceremony in CEREMONY_RULES:
            try:
                get_cached_muhurats(year, ceremony)
            except Exception as e:
                logger.error(f"Failed to precompute {ceremony} {year}: {e}")
