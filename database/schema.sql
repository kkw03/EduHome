-- TODO: CREATE EXTENSION IF NOT EXISTS postgis;

-- TODO: CREATE TABLE users (
--   user_id     SERIAL PRIMARY KEY,
--   email       VARCHAR(255) UNIQUE NOT NULL,
--   password_hash VARCHAR(255) NOT NULL,
--   contact_no  VARCHAR(20)
-- );

-- TODO: CREATE TABLE primary_schools (
--   school_id     SERIAL PRIMARY KEY,
--   official_name VARCHAR(255) NOT NULL,
--   postal_code   INTEGER,
--   location      GEOGRAPHY(Point, 4326) NOT NULL,  -- PostGIS point (lat/lng)
--   vacancies     INTEGER DEFAULT 0
-- );

-- TODO: CREATE TABLE priority_zones (
--   zone_id      SERIAL PRIMARY KEY,
--   school_id    INTEGER REFERENCES primary_schools(school_id),
--   radius_tier  VARCHAR(10) CHECK (radius_tier IN ('GOLD_1KM', 'SILVER_2KM')),
--   boundary     GEOGRAPHY(Polygon, 4326) NOT NULL   -- PostGIS polygon
-- );

-- TODO: CREATE TABLE hdb_blocks (
--   block_id         SERIAL PRIMARY KEY,
--   street_name      VARCHAR(255),
--   block_num        VARCHAR(10),
--   lease_start_year INTEGER,
--   total_units      INTEGER,
--   location         GEOGRAPHY(Point, 4326) NOT NULL  -- PostGIS point
-- );

-- TODO: CREATE TABLE transactions (
--   transaction_id   SERIAL PRIMARY KEY,
--   block_id         INTEGER REFERENCES hdb_blocks(block_id),
--   resale_price     NUMERIC(12, 2),
--   floor_area_sqm   INTEGER,
--   transaction_date DATE,
--   flat_type        VARCHAR(50)
-- );

-- TODO: CREATE TABLE watchlists (
--   watchlist_id SERIAL PRIMARY KEY,
--   user_id      INTEGER UNIQUE REFERENCES users(user_id)
-- );

-- TODO: CREATE TABLE watchlist_items (
--   watch_id     SERIAL PRIMARY KEY,
--   watchlist_id INTEGER REFERENCES watchlists(watchlist_id),
--   school_id    INTEGER REFERENCES primary_schools(school_id),
--   min_budget   NUMERIC(12, 2),
--   max_budget   NUMERIC(12, 2),
--   is_active    BOOLEAN DEFAULT TRUE
-- );

-- TODO: CREATE INDEX idx_hdb_blocks_location ON hdb_blocks USING GIST (location);
--       Spatial index for < 2s radius queries (NFR1)

-- TODO: CREATE INDEX idx_transactions_date ON transactions (transaction_date);
--       For efficient 12-month trend queries (NFR4)

-- TODO: CREATE INDEX idx_transactions_block ON transactions (block_id);
--       For block-level transaction lookups
