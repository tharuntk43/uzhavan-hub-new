# Uzhavan Hub - Database Layer & User/Land Management
# SQLite-backed persistent relational database with PBKDF2 password hashing and multi-plot land support

import sqlite3
import os
import hashlib
import secrets
from datetime import datetime, timedelta

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "uzhavan.db")

def get_connection():
    conn = sqlite3.connect(DB_PATH)
    conn.row_factory = sqlite3.Row
    conn.execute("PRAGMA foreign_keys = ON")
    return conn

def hash_password(password: str, salt: str = None) -> tuple[str, str]:
    if not salt:
        salt = secrets.token_hex(16)
    # NIST-compliant PBKDF2-HMAC-SHA256 with 100,000 iterations
    pwd_hash = hashlib.pbkdf2_hmac(
        'sha256',
        password.encode('utf-8'),
        salt.encode('utf-8'),
        100000
    ).hex()
    return pwd_hash, salt

def verify_password(password: str, pwd_hash: str, salt: str) -> bool:
    check_hash, _ = hash_password(password, salt)
    return secrets.compare_digest(pwd_hash, check_hash)

def convert_to_acres(area: float, unit: str) -> float:
    unit = (unit or 'acres').strip().lower()
    if unit in ['hectare', 'hectares', 'ha']:
        return round(area * 2.47105, 2)
    elif unit in ['cent', 'cents']:
        return round(area * 0.01, 2)
    return round(area, 2)

def init_db():
    conn = get_connection()
    cursor = conn.cursor()

    # 1. Users Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            password_hash TEXT NOT NULL,
            salt TEXT NOT NULL,
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL
        )
    """)

    # 2. Farmer Profiles Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS farmer_profiles (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER UNIQUE NOT NULL,
            full_name TEXT NOT NULL,
            mobile_number TEXT NOT NULL,
            preferred_language TEXT DEFAULT 'ta',
            state TEXT DEFAULT 'Tamil Nadu',
            district TEXT NOT NULL,
            village TEXT DEFAULT '',
            farmer_type TEXT DEFAULT 'Owner',
            farming_experience INTEGER DEFAULT 0,
            primary_activity TEXT DEFAULT 'Grain & Oilseed Cultivation',
            profile_photo TEXT DEFAULT '',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    """)

    # 3. Land Plots Table (Multiple plots per farmer)
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS land_plots (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            user_id INTEGER NOT NULL,
            plot_name TEXT NOT NULL,
            state TEXT DEFAULT 'Tamil Nadu',
            district TEXT NOT NULL,
            village TEXT DEFAULT '',
            location_address TEXT DEFAULT '',
            coordinates TEXT DEFAULT '',
            area REAL NOT NULL DEFAULT 1.0,
            area_unit TEXT DEFAULT 'acres',
            area_acres REAL NOT NULL DEFAULT 1.0,
            ownership_status TEXT DEFAULT 'owned',
            soil_type TEXT DEFAULT 'Red Soil',
            soil_ph TEXT DEFAULT 'Unknown',
            fertility_details TEXT DEFAULT '',
            irrigation_source TEXT DEFAULT 'Borewell',
            water_availability TEXT DEFAULT 'Moderate',
            current_crop TEXT DEFAULT '',
            previous_crop TEXT DEFAULT '',
            planned_crop TEXT DEFAULT '',
            planting_date TEXT DEFAULT '',
            farming_budget REAL DEFAULT 50000.0,
            soil_report_file TEXT DEFAULT '',
            created_at TEXT NOT NULL,
            updated_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    """)

    # 4. Sessions Table
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS sessions (
            token TEXT PRIMARY KEY,
            user_id INTEGER NOT NULL,
            created_at TEXT NOT NULL,
            expires_at TEXT NOT NULL,
            FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
        )
    """)

    conn.commit()
    seed_demo_accounts(conn)
    conn.close()

def seed_demo_accounts(conn):
    cursor = conn.cursor()
    now = datetime.now().isoformat()

    # Demo Farmer 1: Murugan P. (Madurai)
    cursor.execute("SELECT id FROM users WHERE email = 'murugan@uzhavan.hub'")
    if not cursor.fetchone():
        p_hash, salt = hash_password("Farmer@123")
        cursor.execute(
            "INSERT INTO users (email, password_hash, salt, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
            ('murugan@uzhavan.hub', p_hash, salt, now, now)
        )
        u1_id = cursor.lastrowid
        cursor.execute("""
            INSERT INTO farmer_profiles 
            (user_id, full_name, mobile_number, preferred_language, state, district, village, farmer_type, farming_experience, primary_activity, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (u1_id, 'Murugan P.', '9876543210', 'ta', 'Tamil Nadu', 'Madurai', 'Vadipatti', 'Owner', 15, 'Oilseed & Pulses Farming', now, now))

        # Plot 1
        cursor.execute("""
            INSERT INTO land_plots
            (user_id, plot_name, state, district, village, location_address, area, area_unit, area_acres, ownership_status, soil_type, soil_ph, irrigation_source, water_availability, current_crop, previous_crop, planned_crop, planting_date, farming_budget, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (u1_id, 'Vadipatti North Field', 'Tamil Nadu', 'Madurai', 'Vadipatti', 'Survey No. 42/B, North Block', 3.0, 'acres', 3.0, 'owned', 'Red Soil', '6.8', 'Borewell', 'Moderate', 'Groundnut', 'Cotton', 'Groundnut TMV-7', '2026-10-15', 60000, now, now))

        # Plot 2
        cursor.execute("""
            INSERT INTO land_plots
            (user_id, plot_name, state, district, village, location_address, area, area_unit, area_acres, ownership_status, soil_type, soil_ph, irrigation_source, water_availability, current_crop, previous_crop, planned_crop, planting_date, farming_budget, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (u1_id, 'Vaigai Riverbank Plot', 'Tamil Nadu', 'Madurai', 'Sholavandan', 'River Road Canal Basin', 2.5, 'acres', 2.5, 'owned', 'Alluvial Soil', '7.2', 'Canal', 'Abundant / Year-round', 'Paddy', 'Banana', 'Ponni Rice', '2026-11-01', 50000, now, now))

    # Demo Farmer 2: Anitha R. (Thanjavur)
    cursor.execute("SELECT id FROM users WHERE email = 'anitha@uzhavan.hub'")
    if not cursor.fetchone():
        p_hash, salt = hash_password("Farmer@123")
        cursor.execute(
            "INSERT INTO users (email, password_hash, salt, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
            ('anitha@uzhavan.hub', p_hash, salt, now, now)
        )
        u2_id = cursor.lastrowid
        cursor.execute("""
            INSERT INTO farmer_profiles 
            (user_id, full_name, mobile_number, preferred_language, state, district, village, farmer_type, farming_experience, primary_activity, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (u2_id, 'Anitha R.', '9842109876', 'ta', 'Tamil Nadu', 'Thanjavur', 'Kumbakonam', 'Both (Owner & Tenant)', 8, 'Paddy & Horticulture Cultivation', now, now))

        cursor.execute("""
            INSERT INTO land_plots
            (user_id, plot_name, state, district, village, location_address, area, area_unit, area_acres, ownership_status, soil_type, soil_ph, irrigation_source, water_availability, current_crop, previous_crop, planned_crop, planting_date, farming_budget, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (u2_id, 'Delta Paddy Fields', 'Tamil Nadu', 'Thanjavur', 'Kumbakonam', 'Kallanai Canal Canal Feeder', 4.0, 'acres', 4.0, 'owned', 'Clay Soil', '7.0', 'Canal', 'Abundant / Year-round', 'Rice', 'Blackgram', 'Samba Paddy', '2026-10-20', 75000, now, now))

    conn.commit()

# --- Auth Service Functions ---

def register_farmer(data: dict) -> tuple[bool, dict]:
    email = (data.get('email') or '').strip().lower()
    password = data.get('password') or ''
    confirm_password = data.get('confirm_password') or ''
    full_name = (data.get('full_name') or '').strip()
    mobile = (data.get('mobile_number') or '').strip()
    district = (data.get('district') or 'Madurai').strip()

    # Validation
    if not email or '@' not in email or '.' not in email:
        return False, {"error": "Please provide a valid email address."}
    if not password or len(password) < 6:
        return False, {"error": "Password must be at least 6 characters long."}
    if password != confirm_password:
        return False, {"error": "Password and confirmation do not match."}
    if not full_name:
        return False, {"error": "Full name is required."}
    if not mobile or len(mobile.replace('+', '').replace(' ', '')) < 10:
        return False, {"error": "Please enter a valid 10-digit mobile number."}

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT id FROM users WHERE email = ?", (email,))
        if cursor.fetchone():
            return False, {"error": f"An account with email '{email}' already exists. Please log in instead."}

        now = datetime.now().isoformat()
        pwd_hash, salt = hash_password(password)

        cursor.execute(
            "INSERT INTO users (email, password_hash, salt, created_at, updated_at) VALUES (?, ?, ?, ?, ?)",
            (email, pwd_hash, salt, now, now)
        )
        user_id = cursor.lastrowid

        # Insert Farmer Profile
        cursor.execute("""
            INSERT INTO farmer_profiles 
            (user_id, full_name, mobile_number, preferred_language, state, district, village, farmer_type, farming_experience, primary_activity, profile_photo, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            user_id,
            full_name,
            mobile,
            data.get('preferred_language', 'ta'),
            data.get('state', 'Tamil Nadu'),
            district,
            data.get('village', ''),
            data.get('farmer_type', 'Owner'),
            int(data.get('farming_experience') or 0),
            data.get('primary_activity', 'Grain & Oilseed Cultivation'),
            data.get('profile_photo', ''),
            now,
            now
        ))

        # Insert Plots if provided
        plots = data.get('plots') or []
        for p in plots:
            area = float(p.get('area') or 1.0)
            unit = p.get('area_unit', 'acres')
            area_acres = convert_to_acres(area, unit)

            cursor.execute("""
                INSERT INTO land_plots
                (user_id, plot_name, state, district, village, location_address, coordinates, area, area_unit, area_acres, ownership_status, soil_type, soil_ph, fertility_details, irrigation_source, water_availability, current_crop, previous_crop, planned_crop, planting_date, farming_budget, soil_report_file, created_at, updated_at)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
            """, (
                user_id,
                p.get('plot_name', 'Farm Plot 1'),
                p.get('state', data.get('state', 'Tamil Nadu')),
                p.get('district', district),
                p.get('village', data.get('village', '')),
                p.get('location_address', ''),
                p.get('coordinates', ''),
                area,
                unit,
                area_acres,
                p.get('ownership_status', 'owned'),
                p.get('soil_type', 'Red Soil'),
                p.get('soil_ph', 'Unknown'),
                p.get('fertility_details', ''),
                p.get('irrigation_source', 'Borewell'),
                p.get('water_availability', 'Moderate'),
                p.get('current_crop', ''),
                p.get('previous_crop', ''),
                p.get('planned_crop', ''),
                p.get('planting_date', ''),
                float(p.get('farming_budget') or 50000.0),
                p.get('soil_report_file', ''),
                now,
                now
            ))

        # Generate active session token
        token = secrets.token_hex(32)
        expires = (datetime.now() + timedelta(days=30)).isoformat()
        cursor.execute("INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)", (token, user_id, now, expires))

        conn.commit()

        user_data = get_user_by_id(user_id, conn)
        return True, {"token": token, "user": user_data, "message": "Farmer registered successfully!"}

    except Exception as e:
        conn.rollback()
        return False, {"error": f"Database error: {str(e)}"}
    finally:
        conn.close()

def login_farmer(email: str, password: str) -> tuple[bool, dict]:
    email = (email or '').strip().lower()
    if not email or not password:
        return False, {"error": "Email and password are required."}

    conn = get_connection()
    cursor = conn.cursor()

    try:
        cursor.execute("SELECT id, email, password_hash, salt FROM users WHERE email = ?", (email,))
        user = cursor.fetchone()
        if not user or not verify_password(password, user['password_hash'], user['salt']):
            return False, {"error": "Invalid email or password. Please verify your credentials."}

        now = datetime.now().isoformat()
        token = secrets.token_hex(32)
        expires = (datetime.now() + timedelta(days=30)).isoformat()

        cursor.execute("INSERT INTO sessions (token, user_id, created_at, expires_at) VALUES (?, ?, ?, ?)", (token, user['id'], now, expires))
        conn.commit()

        user_data = get_user_by_id(user['id'], conn)
        return True, {"token": token, "user": user_data, "message": "Login successful!"}

    except Exception as e:
        return False, {"error": f"Login failed: {str(e)}"}
    finally:
        conn.close()

def authenticate_session(token: str) -> dict | None:
    if not token:
        return None
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT user_id, expires_at FROM sessions WHERE token = ?", (token,))
        sess = cursor.fetchone()
        if not sess:
            return None
        if datetime.fromisoformat(sess['expires_at']) < datetime.now():
            cursor.execute("DELETE FROM sessions WHERE token = ?", (token,))
            conn.commit()
            return None
        return get_user_by_id(sess['user_id'], conn)
    finally:
        conn.close()

def logout_session(token: str) -> bool:
    if not token:
        return True
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM sessions WHERE token = ?", (token,))
        conn.commit()
        return True
    finally:
        conn.close()

def get_user_by_id(user_id: int, conn = None) -> dict | None:
    should_close = False
    if not conn:
        conn = get_connection()
        should_close = True

    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id, email, created_at FROM users WHERE id = ?", (user_id,))
        u = cursor.fetchone()
        if not u:
            return None

        cursor.execute("SELECT * FROM farmer_profiles WHERE user_id = ?", (user_id,))
        p = cursor.fetchone()

        cursor.execute("SELECT * FROM land_plots WHERE user_id = ? ORDER BY id ASC", (user_id,))
        plots = cursor.fetchall()

        # Calculate total acreage
        total_acres = sum(row['area_acres'] for row in plots)

        return {
            "id": u['id'],
            "email": u['email'],
            "created_at": u['created_at'],
            "profile": dict(p) if p else {},
            "plots": [dict(plot) for plot in plots],
            "total_acres": round(total_acres, 2),
            "plots_count": len(plots)
        }
    finally:
        if should_close:
            conn.close()

# --- Plot Operations with strict user_id isolation ---

def add_land_plot(user_id: int, p: dict) -> tuple[bool, dict]:
    conn = get_connection()
    cursor = conn.cursor()
    try:
        now = datetime.now().isoformat()
        area = float(p.get('area') or 1.0)
        unit = p.get('area_unit', 'acres')
        area_acres = convert_to_acres(area, unit)

        cursor.execute("""
            INSERT INTO land_plots
            (user_id, plot_name, state, district, village, location_address, coordinates, area, area_unit, area_acres, ownership_status, soil_type, soil_ph, fertility_details, irrigation_source, water_availability, current_crop, previous_crop, planned_crop, planting_date, farming_budget, soil_report_file, created_at, updated_at)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        """, (
            user_id,
            p.get('plot_name', 'My Plot'),
            p.get('state', 'Tamil Nadu'),
            p.get('district', 'Madurai'),
            p.get('village', ''),
            p.get('location_address', ''),
            p.get('coordinates', ''),
            area,
            unit,
            area_acres,
            p.get('ownership_status', 'owned'),
            p.get('soil_type', 'Red Soil'),
            p.get('soil_ph', 'Unknown'),
            p.get('fertility_details', ''),
            p.get('irrigation_source', 'Borewell'),
            p.get('water_availability', 'Moderate'),
            p.get('current_crop', ''),
            p.get('previous_crop', ''),
            p.get('planned_crop', ''),
            p.get('planting_date', ''),
            float(p.get('farming_budget') or 50000.0),
            p.get('soil_report_file', ''),
            now,
            now
        ))
        plot_id = cursor.lastrowid
        conn.commit()

        cursor.execute("SELECT * FROM land_plots WHERE id = ?", (plot_id,))
        created = dict(cursor.fetchone())
        return True, created
    except Exception as e:
        conn.rollback()
        return False, {"error": str(e)}
    finally:
        conn.close()

def update_land_plot(user_id: int, plot_id: int, p: dict) -> tuple[bool, dict]:
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # Check ownership
        cursor.execute("SELECT id FROM land_plots WHERE id = ? AND user_id = ?", (plot_id, user_id))
        if not cursor.fetchone():
            return False, {"error": "Land plot not found or unauthorized access denied."}

        now = datetime.now().isoformat()
        area = float(p.get('area') or 1.0)
        unit = p.get('area_unit', 'acres')
        area_acres = convert_to_acres(area, unit)

        cursor.execute("""
            UPDATE land_plots SET
                plot_name = ?,
                state = ?,
                district = ?,
                village = ?,
                location_address = ?,
                coordinates = ?,
                area = ?,
                area_unit = ?,
                area_acres = ?,
                ownership_status = ?,
                soil_type = ?,
                soil_ph = ?,
                fertility_details = ?,
                irrigation_source = ?,
                water_availability = ?,
                current_crop = ?,
                previous_crop = ?,
                planned_crop = ?,
                planting_date = ?,
                farming_budget = ?,
                soil_report_file = ?,
                updated_at = ?
            WHERE id = ? AND user_id = ?
        """, (
            p.get('plot_name'),
            p.get('state'),
            p.get('district'),
            p.get('village'),
            p.get('location_address'),
            p.get('coordinates'),
            area,
            unit,
            area_acres,
            p.get('ownership_status'),
            p.get('soil_type'),
            p.get('soil_ph'),
            p.get('fertility_details'),
            p.get('irrigation_source'),
            p.get('water_availability'),
            p.get('current_crop'),
            p.get('previous_crop'),
            p.get('planned_crop'),
            p.get('planting_date'),
            float(p.get('farming_budget') or 50000.0),
            p.get('soil_report_file', ''),
            now,
            plot_id,
            user_id
        ))
        conn.commit()

        cursor.execute("SELECT * FROM land_plots WHERE id = ?", (plot_id,))
        updated = dict(cursor.fetchone())
        return True, updated
    except Exception as e:
        conn.rollback()
        return False, {"error": str(e)}
    finally:
        conn.close()

def delete_land_plot(user_id: int, plot_id: int) -> tuple[bool, dict]:
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("SELECT id FROM land_plots WHERE id = ? AND user_id = ?", (plot_id, user_id))
        if not cursor.fetchone():
            return False, {"error": "Land plot not found or unauthorized access denied."}

        cursor.execute("DELETE FROM land_plots WHERE id = ? AND user_id = ?", (plot_id, user_id))
        conn.commit()
        return True, {"message": f"Plot #{plot_id} deleted successfully."}
    except Exception as e:
        conn.rollback()
        return False, {"error": str(e)}
    finally:
        conn.close()

def update_farmer_profile(user_id: int, p: dict) -> tuple[bool, dict]:
    conn = get_connection()
    cursor = conn.cursor()
    try:
        now = datetime.now().isoformat()
        cursor.execute("""
            UPDATE farmer_profiles SET
                full_name = ?,
                mobile_number = ?,
                preferred_language = ?,
                state = ?,
                district = ?,
                village = ?,
                farmer_type = ?,
                farming_experience = ?,
                primary_activity = ?,
                profile_photo = ?,
                updated_at = ?
            WHERE user_id = ?
        """, (
            p.get('full_name'),
            p.get('mobile_number'),
            p.get('preferred_language', 'ta'),
            p.get('state', 'Tamil Nadu'),
            p.get('district', 'Madurai'),
            p.get('village', ''),
            p.get('farmer_type', 'Owner'),
            int(p.get('farming_experience') or 0),
            p.get('primary_activity', 'Grain & Oilseed Cultivation'),
            p.get('profile_photo', ''),
            now,
            user_id
        ))
        conn.commit()
        updated_user = get_user_by_id(user_id, conn)
        return True, updated_user
    except Exception as e:
        conn.rollback()
        return False, {"error": str(e)}
    finally:
        conn.close()

if __name__ == "__main__":
    print("Initializing Uzhavan Hub SQLite Database...")
    init_db()
    print("Database initialized with demo accounts!")
