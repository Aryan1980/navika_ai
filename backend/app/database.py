"""SQLite Database Layer for Navika AI conversations and telemetry with serverless resilience."""
import sqlite3
import json
import os
import tempfile
from datetime import datetime, timezone
from typing import List, Dict, Any, Optional

# In-memory fallback message cache if filesystem is strictly read-only
_MEM_CACHE: Dict[str, List[Dict[str, Any]]] = {}

def get_db_path() -> str:
    """Resolve a writable path for SQLite database, supporting serverless (Vercel, AWS Lambda) environments."""
    # Explicit DATA_DIR override
    data_dir = os.environ.get("DATA_DIR")
    if data_dir:
        try:
            os.makedirs(data_dir, exist_ok=True)
            return os.path.join(data_dir, "samudra_ai.db")
        except Exception:
            pass

    # Serverless environments (Vercel, AWS Lambda, etc.) have read-only filesystems except /tmp
    if os.environ.get("VERCEL") or os.environ.get("AWS_LAMBDA_FUNCTION_NAME") or os.environ.get("LAMBDA_TASK_ROOT"):
        return os.path.join(tempfile.gettempdir(), "samudra_ai.db")

    # Try local backend directory
    local_db = os.path.abspath(os.path.join(os.path.dirname(__file__), "..", "samudra_ai.db"))
    local_dir = os.path.dirname(local_db)

    # Test writability of directory
    try:
        test_path = os.path.join(local_dir, ".write_test")
        with open(test_path, "w") as f:
            f.write("ok")
        os.remove(test_path)
        return local_db
    except (OSError, IOError, PermissionError):
        # Local dir is read-only, fallback to temp directory
        return os.path.join(tempfile.gettempdir(), "samudra_ai.db")

DB_FILE = get_db_path()

def get_db():
    global DB_FILE
    try:
        conn = sqlite3.connect(DB_FILE, timeout=5.0)
        conn.row_factory = sqlite3.Row
        return conn
    except Exception as e:
        # Fallback to in-memory if disk file cannot be opened
        try:
            temp_db = os.path.join(tempfile.gettempdir(), "samudra_ai.db")
            conn = sqlite3.connect(temp_db, timeout=5.0)
            conn.row_factory = sqlite3.Row
            DB_FILE = temp_db
            return conn
        except Exception:
            conn = sqlite3.connect(":memory:", timeout=5.0)
            conn.row_factory = sqlite3.Row
            return conn

def init_db():
    try:
        with get_db() as conn:
            conn.execute("""
                CREATE TABLE IF NOT EXISTS conversations (
                    id TEXT PRIMARY KEY,
                    title TEXT,
                    created_at TEXT,
                    language TEXT DEFAULT 'en',
                    last_lat REAL,
                    last_lon REAL
                )
            """)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS messages (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    conversation_id TEXT,
                    role TEXT,
                    content TEXT,
                    response_metadata TEXT,
                    created_at TEXT,
                    FOREIGN KEY (conversation_id) REFERENCES conversations(id)
                )
            """)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS user_bookmarks (
                    id INTEGER PRIMARY KEY AUTOINCREMENT,
                    name TEXT,
                    latitude REAL,
                    longitude REAL,
                    notes TEXT,
                    created_at TEXT
                )
            """)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS users (
                    phone TEXT PRIMARY KEY,
                    name TEXT,
                    vessel_name TEXT,
                    vessel_type TEXT,
                    home_port TEXT,
                    created_at TEXT
                )
            """)
            conn.execute("""
                CREATE TABLE IF NOT EXISTS voyages (
                    id TEXT PRIMARY KEY,
                    user_phone TEXT,
                    voyage_date TEXT,
                    origin_name TEXT,
                    destination_name TEXT,
                    distance_nm REAL,
                    distance_km REAL,
                    duration_mins REAL,
                    fuel_liters REAL,
                    catch_kg REAL,
                    catch_species TEXT,
                    safety_rating TEXT,
                    notes TEXT,
                    created_at TEXT,
                    FOREIGN KEY (user_phone) REFERENCES users(phone)
                )
            """)
            conn.commit()
    except Exception as e:
        print(f"Notice: SQLite init_db operating with in-memory or degraded state: {e}")

def get_or_create_user(phone: str, name: str = "Captain Murugan", vessel_name: str = "Matsya Sagar - KL-07-AB-402", vessel_type: str = "Motorized Country Craft (9.9 HP)", home_port: str = "Fort Kochi Coastal Harbor") -> Dict[str, Any]:
    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    clean_phone = phone.strip()
    try:
        with get_db() as conn:
            cursor = conn.execute("SELECT * FROM users WHERE phone = ?", (clean_phone,))
            row = cursor.fetchone()
            if row:
                return dict(row)
            
            conn.execute(
                "INSERT INTO users (phone, name, vessel_name, vessel_type, home_port, created_at) VALUES (?, ?, ?, ?, ?, ?)",
                (clean_phone, name, vessel_name, vessel_type, home_port, now_str)
            )
            # Seed 3 default realistic voyages for this new captain so history is immediately rich
            seed_voyages = [
                (
                    f"voy_{clean_phone}_1", clean_phone, "Yesterday, 05:30 AM", "Fort Kochi Coastal Harbor",
                    "Nearshore Thermal Front Alpha", 3.8, 7.0, 24.0, 1.1, 340.0, "Indian Oil Sardine", "SAFE",
                    "SST gradient front was highly visible with surface feeding schools. Good net haul under 45 mins.", now_str
                ),
                (
                    f"voy_{clean_phone}_2", clean_phone, "3 days ago, 06:15 AM", "Fort Kochi Coastal Harbor",
                    "Coastal Upwelling Convergence", 4.6, 8.5, 30.0, 1.4, 210.0, "Indian Mackerel & Anchovies", "SAFE",
                    "Upwelling boundary water temperature dropped to 27.6°C. High quality commercial pelagic catch.", now_str
                ),
                (
                    f"voy_{clean_phone}_3", clean_phone, "Last week, 05:00 AM", "Fort Kochi Coastal Harbor",
                    "Nearshore Thermal Front Beta", 2.8, 5.2, 18.0, 0.8, 185.0, "Mixed Pelagics (Trevally, Sardine)", "SAFE",
                    "Short nautical transit under 3 NM. Saved ~0.6 L engine fuel compared to blind coastal scouting.", now_str
                )
            ]
            conn.executemany(
                """INSERT OR IGNORE INTO voyages 
                   (id, user_phone, voyage_date, origin_name, destination_name, distance_nm, distance_km, duration_mins, fuel_liters, catch_kg, catch_species, safety_rating, notes, created_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                seed_voyages
            )
            conn.commit()

            cursor = conn.execute("SELECT * FROM users WHERE phone = ?", (clean_phone,))
            return dict(cursor.fetchone())
    except Exception as e:
        return {
            "phone": clean_phone,
            "name": name,
            "vessel_name": vessel_name,
            "vessel_type": vessel_type,
            "home_port": home_port,
            "created_at": now_str
        }

def update_user_profile(phone: str, name: str, vessel_name: str, vessel_type: str, home_port: str) -> Dict[str, Any]:
    clean_phone = phone.strip()
    try:
        with get_db() as conn:
            conn.execute(
                "UPDATE users SET name = ?, vessel_name = ?, vessel_type = ?, home_port = ? WHERE phone = ?",
                (name, vessel_name, vessel_type, home_port, clean_phone)
            )
            conn.commit()
            cursor = conn.execute("SELECT * FROM users WHERE phone = ?", (clean_phone,))
            row = cursor.fetchone()
            if row:
                return dict(row)
    except Exception:
        pass
    return {
        "phone": clean_phone,
        "name": name,
        "vessel_name": vessel_name,
        "vessel_type": vessel_type,
        "home_port": home_port
    }

def get_user_voyages(phone: str) -> List[Dict[str, Any]]:
    clean_phone = phone.strip()
    try:
        with get_db() as conn:
            cursor = conn.execute(
                "SELECT * FROM voyages WHERE user_phone = ? ORDER BY id DESC",
                (clean_phone,)
            )
            return [dict(row) for row in cursor.fetchall()]
    except Exception:
        return []

def save_user_voyage(voyage_data: Dict[str, Any]) -> Dict[str, Any]:
    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    voy_id = voyage_data.get("id") or f"voy_{int(datetime.now(timezone.utc).timestamp()*1000)}"
    try:
        with get_db() as conn:
            conn.execute(
                """INSERT INTO voyages 
                   (id, user_phone, voyage_date, origin_name, destination_name, distance_nm, distance_km, duration_mins, fuel_liters, catch_kg, catch_species, safety_rating, notes, created_at)
                   VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)""",
                (
                    voy_id,
                    voyage_data.get("user_phone", ""),
                    voyage_data.get("voyage_date") or datetime.now().strftime("%d %b %Y, %I:%M %p"),
                    voyage_data.get("origin_name", "Fort Kochi Harbor"),
                    voyage_data.get("destination_name", "Nearshore Thermal Front"),
                    float(voyage_data.get("distance_nm", 0.0)),
                    float(voyage_data.get("distance_km", 0.0)),
                    float(voyage_data.get("duration_mins", 0.0)),
                    float(voyage_data.get("fuel_liters", 0.0)),
                    float(voyage_data.get("catch_kg", 0.0)),
                    voyage_data.get("catch_species", "Mixed Pelagics"),
                    voyage_data.get("safety_rating", "SAFE"),
                    voyage_data.get("notes", "Good weather and calm sea conditions."),
                    now_str
                )
            )
            conn.commit()
    except Exception as e:
        print(f"Notice saving voyage: {e}")
    voyage_data["id"] = voy_id
    voyage_data["created_at"] = now_str
    return voyage_data

def save_message(conv_id: str, role: str, content: str, meta: Optional[Dict[str, Any]] = None):
    now_str = datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%SZ")
    
    # Store in memory cache
    if conv_id not in _MEM_CACHE:
        _MEM_CACHE[conv_id] = []
    _MEM_CACHE[conv_id].append({
        "role": role,
        "content": content,
        "response_metadata": json.dumps(meta or {}),
        "created_at": now_str
    })

    try:
        with get_db() as conn:
            conn.execute(
                "INSERT INTO messages (conversation_id, role, content, response_metadata, created_at) VALUES (?, ?, ?, ?, ?)",
                (conv_id, role, content, json.dumps(meta or {}), now_str)
            )
            conn.commit()
    except Exception as e:
        # Non-fatal error; memory cache already preserves session
        pass

def get_conversation_history(conv_id: str) -> List[Dict[str, Any]]:
    try:
        with get_db() as conn:
            cursor = conn.execute(
                "SELECT role, content, response_metadata, created_at FROM messages WHERE conversation_id = ? ORDER BY id ASC",
                (conv_id,)
            )
            rows = [dict(row) for row in cursor.fetchall()]
            if rows:
                return rows
    except Exception:
        pass
    
    return _MEM_CACHE.get(conv_id, [])

