-- Uzhavan Hub - Relational Database Schema
-- Compatible with PostgreSQL (and mapped for SQLite fallback)

CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(64) PRIMARY KEY,
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(120) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    language_pref VARCHAR(10) DEFAULT 'en',
    role VARCHAR(20) DEFAULT 'farmer',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS farmer_profiles (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) UNIQUE NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    state VARCHAR(60) DEFAULT 'Tamil Nadu',
    district VARCHAR(60) NOT NULL,
    village VARCHAR(100) NOT NULL,
    farmer_type VARCHAR(30) DEFAULT 'Owner',
    experience_years INTEGER DEFAULT 5,
    primary_activity VARCHAR(60) DEFAULT 'Grains & Oilseeds',
    avatar VARCHAR(20) DEFAULT '👨‍🌾',
    bio TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS land_plots (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plot_name VARCHAR(100) NOT NULL,
    area_acres NUMERIC(6, 2) NOT NULL,
    area_original NUMERIC(8, 2),
    area_unit VARCHAR(20) DEFAULT 'acres',
    soil_type VARCHAR(60) NOT NULL,
    soil_ph NUMERIC(3, 1) DEFAULT 7.0,
    organic_carbon VARCHAR(20) DEFAULT '0.65%',
    fertility_notes TEXT,
    irrigation_source VARCHAR(60) NOT NULL,
    water_availability VARCHAR(40) DEFAULT 'Abundant',
    current_crop VARCHAR(80),
    previous_crop VARCHAR(80),
    planned_crop VARCHAR(80),
    sowing_date DATE,
    estimated_budget NUMERIC(10, 2) DEFAULT 25000,
    is_active BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS user_sessions (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    session_token VARCHAR(255) UNIQUE NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    expires_at TIMESTAMP NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS farm_tasks (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    plot_id VARCHAR(64) REFERENCES land_plots(id) ON DELETE CASCADE,
    week_number INTEGER NOT NULL,
    stage_name VARCHAR(100) NOT NULL,
    task_title VARCHAR(255) NOT NULL,
    category VARCHAR(50) DEFAULT 'Agronomy',
    due_date DATE,
    is_completed BOOLEAN DEFAULT FALSE,
    completed_at TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS community_posts (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL,
    district VARCHAR(60) NOT NULL,
    crop_tag VARCHAR(50) NOT NULL,
    category VARCHAR(50) DEFAULT 'General Discussion',
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    likes_count INTEGER DEFAULT 0,
    replies_count INTEGER DEFAULT 0,
    is_verified_expert BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS community_replies (
    id VARCHAR(64) PRIMARY KEY,
    post_id VARCHAR(64) NOT NULL REFERENCES community_posts(id) ON DELETE CASCADE,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    author_name VARCHAR(100) NOT NULL,
    content TEXT NOT NULL,
    is_expert BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS labour_bookings (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    worker_id VARCHAR(64) NOT NULL,
    worker_name VARCHAR(120) NOT NULL,
    operation_type VARCHAR(80) NOT NULL,
    booking_date DATE NOT NULL,
    working_hours VARCHAR(40) DEFAULT 'Full Day (8 hrs)',
    required_workers INTEGER DEFAULT 1,
    total_amount NUMERIC(10, 2) NOT NULL,
    plot_name VARCHAR(100),
    status VARCHAR(30) DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS machinery_bookings (
    id VARCHAR(64) PRIMARY KEY,
    user_id VARCHAR(64) NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    machinery_id VARCHAR(64) NOT NULL,
    machinery_name VARCHAR(120) NOT NULL,
    rental_type VARCHAR(20) DEFAULT 'Hourly',
    duration INTEGER DEFAULT 1,
    start_date DATE NOT NULL,
    total_amount NUMERIC(10, 2) NOT NULL,
    plot_name VARCHAR(100),
    status VARCHAR(30) DEFAULT 'Pending',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_users_email ON users(email);
CREATE INDEX IF NOT EXISTS idx_land_plots_user ON land_plots(user_id);
CREATE INDEX IF NOT EXISTS idx_sessions_token ON user_sessions(session_token);
CREATE INDEX IF NOT EXISTS idx_community_posts_crop ON community_posts(crop_tag);
CREATE INDEX IF NOT EXISTS idx_labour_bookings_user ON labour_bookings(user_id);
CREATE INDEX IF NOT EXISTS idx_machinery_bookings_user ON machinery_bookings(user_id);
