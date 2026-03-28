-- EduHome: Seed Data for Lab 3 Skeleton

-- 1. Insert Schools (Nanyang, Henry Park, Raffles)
INSERT INTO primary_schools (official_name, postal_code, location, vacancies) VALUES
('Nanyang Primary School', 266745, 'POINT(103.8061 1.3210)', 240),
('Henry Park Primary School', 279621, 'POINT(103.7844 1.3168)', 220),
('Raffles Girls Primary School', 288683, 'POINT(103.8065 1.3297)', 210);

-- 2. Insert Priority Zones
-- Use ST_Buffer(location, distance) to create the 1km and 2km polygons automatically
INSERT INTO priority_zones (school_id, radius_tier, boundary)
SELECT 
    school_id, 
    'GOLD_1KM', 
    ST_Buffer(location, 1000)::geography 
FROM primary_schools;

INSERT INTO priority_zones (school_id, radius_tier, boundary)
SELECT 
    school_id, 
    'SILVER_2KM', 
    ST_Buffer(location, 2000)::geography 
FROM primary_schools;

-- 3. Insert HDB Blocks (Strategically placed around Nanyang Primary)
INSERT INTO hdb_blocks (street_name, block_num, lease_start_year, total_units, location) VALUES
('Queen''s Road', '3', 1974, 120, 'POINT(103.8065 1.3200)'),   -- ~100m from Nanyang (GOLD)
('Farrer Road', '4', 1974, 150, 'POINT(103.8078 1.3185)'),    -- ~300m from Nanyang (GOLD)
('Commonwealth Drive', '84', 2015, 200, 'POINT(103.7990 1.3060)'), -- ~1.8km from Nanyang (SILVER)
('Clementi Ave 3', '441', 2012, 180, 'POINT(103.7650 1.3130)');   -- >2km (OUTSIDE)

-- 4. Insert Transactions (12-month history)
INSERT INTO transactions (block_id, resale_price, floor_area_sqm, transaction_date, flat_type) VALUES
(1, 650000, 92, '2025-05-10', '4 ROOM'),
(1, 680000, 92, '2025-11-20', '4 ROOM'),
(1, 710000, 92, '2026-03-20', '4 ROOM'); -- Latest price for PSF calc

-- 5. Insert Sample User & Watchlist (For Testing)
INSERT INTO users (email, password_hash, contact_no) 
VALUES ('kiasu_parent@ntu.edu.sg', 'hashed_pw_123', '91234567');

INSERT INTO watchlists (user_id) VALUES (1);

INSERT INTO watchlist_items (watchlist_id, school_id, min_budget, max_budget)
VALUES (1, 1, 500000, 950000);
