CREATE EXTENSION IF NOT EXISTS postgis;

-- 1. Users Table (Entity: User)
CREATE TABLE IF NOT EXISTS users (
    user_id       SERIAL PRIMARY KEY,
    email         VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    contact_no    VARCHAR(20)
);

-- 2. Primary Schools (Entity: PrimarySchool)
CREATE TABLE IF NOT EXISTS primary_schools (
    school_id     SERIAL PRIMARY KEY,
    official_name VARCHAR(255) NOT NULL,
    postal_code   INTEGER,
    location      GEOGRAPHY(Point, 4326) NOT NULL, -- GPS Coordinates
    vacancies     INTEGER DEFAULT 0
);

-- 3. PRIORITY ZONES (Entity: PriorityZone)
CREATE TABLE IF NOT EXISTS priority_zones (
    zone_id      SERIAL PRIMARY KEY,
    school_id    INTEGER REFERENCES primary_schools(school_id) ON DELETE CASCADE,
    radius_tier  VARCHAR(20) CHECK (radius_tier IN ('GOLD_1KM', 'SILVER_2KM')),
    boundary     GEOGRAPHY(Polygon, 4326) NOT NULL 
);

-- 4. HDB Blocks (Entity: HDBBlock)
CREATE TABLE IF NOT EXISTS hdb_blocks (
    block_id         SERIAL PRIMARY KEY,
    street_name      VARCHAR(255), 
    block_num        VARCHAR(10),
    lease_start_year INTEGER,
    total_units      INTEGER,
    location         GEOGRAPHY(Point, 4326) NOT NULL 
);

-- 5. Transactions (Entity: Transaction)
CREATE TABLE IF NOT EXISTS transactions (
    transaction_id   SERIAL PRIMARY KEY,
    block_id         INTEGER REFERENCES hdb_blocks(block_id) ON DELETE CASCADE,
    resale_price     NUMERIC(12, 2),
    floor_area_sqm   INTEGER,
    transaction_date DATE NOT NULL,
    flat_type        VARCHAR(50)
);

-- 6. Watchlists (Entity: Watchlist)
CREATE TABLE IF NOT EXISTS watchlists (
    watchlist_id SERIAL PRIMARY KEY,
    user_id      INTEGER UNIQUE REFERENCES users(user_id) ON DELETE CASCADE
);

-- 7. Watchlist Items (Entity: WatchlistItem)
CREATE TABLE IF NOT EXISTS watchlist_items (
    watch_id     SERIAL PRIMARY KEY,
    watchlist_id INTEGER REFERENCES watchlists(watchlist_id) ON DELETE CASCADE,
    school_id    INTEGER REFERENCES primary_schools(school_id),
    min_budget   NUMERIC(12, 2),
    max_budget   NUMERIC(12, 2),
    is_active    BOOLEAN DEFAULT TRUE
);

-- PERFORMANCE & OPTIMIZATION
-- 1. Spatial Indexes: Optimizes 1km/2km Radius Queries
CREATE INDEX IF NOT EXISTS idx_hdb_location ON hdb_blocks USING GIST (location);
CREATE INDEX IF NOT EXISTS idx_school_location ON primary_schools USING GIST (location);

-- 2. Foreign Key Indexes: Optimizes JOINs for Market Trends
-- This ensures clicking an HDB block shows price history instantly
CREATE INDEX IF NOT EXISTS idx_transactions_block_id ON transactions (block_id);

-- 3. B-Tree Indexes: Optimizes Search, Filter, and Sort
CREATE INDEX IF NOT EXISTS idx_schools_name ON primary_schools (official_name);
CREATE INDEX IF NOT EXISTS idx_transactions_price ON transactions (resale_price);
CREATE INDEX IF NOT EXISTS idx_transactions_date ON transactions (transaction_date DESC);

-- ADVANCED DESIGN: ANALYTICS VIEWS 

-- This automatically calculates PSF for every transaction.
CREATE OR REPLACE VIEW v_transaction_analysis AS
SELECT 
    t.*,
    (t.resale_price / NULLIF(t.floor_area_sqm, 0)) as calculated_psf
FROM transactions t;
