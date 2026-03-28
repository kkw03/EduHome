-- =============================================================================
-- EduHome: Seed Data — Static Reference Data Only
--
-- Schools, priority zones, and test users are seeded here.
-- HDB blocks and transactions are populated dynamically via
-- DataSyncController.trigger_daily_update() from real data.gov.sg data.
-- =============================================================================

-- 1. Primary Schools (10 — matching frontend SCHOOLS array)
INSERT INTO primary_schools (school_id, official_name, postal_code, location, vacancies) VALUES
(1,  'Raffles Girls'' Primary School',          298981, ST_SetSRID(ST_MakePoint(103.8198, 1.3048), 4326)::geography, 30),
(2,  'Nanyang Primary School',                  267923, ST_SetSRID(ST_MakePoint(103.8050, 1.3150), 4326)::geography, 45),
(3,  'Tao Nan School',                          428903, ST_SetSRID(ST_MakePoint(103.9020, 1.3067), 4326)::geography, 60),
(4,  'Henry Park Primary School',               278120, ST_SetSRID(ST_MakePoint(103.7850, 1.3230), 4326)::geography, 25),
(5,  'Ai Tong School',                          579646, ST_SetSRID(ST_MakePoint(103.8380, 1.3540), 4326)::geography, 50),
(6,  'CHIJ St. Nicholas Girls'' School',        571402, ST_SetSRID(ST_MakePoint(103.8488, 1.3530), 4326)::geography, 40),
(7,  'Catholic High School (Primary)',          579767, ST_SetSRID(ST_MakePoint(103.8350, 1.3559), 4326)::geography, 35),
(8,  'Rosyth School',                           546417, ST_SetSRID(ST_MakePoint(103.8810, 1.3575), 4326)::geography, 55),
(9,  'Pei Hwa Presbyterian Primary School',     279747, ST_SetSRID(ST_MakePoint(103.7990, 1.3180), 4326)::geography, 38),
(10, 'Red Swastika School',                     369117, ST_SetSRID(ST_MakePoint(103.8830, 1.3260), 4326)::geography, 42);

SELECT setval('primary_schools_school_id_seq', 10);

-- 2. Priority Zones (auto-generate 1km and 2km buffers for each school)
INSERT INTO priority_zones (school_id, radius_tier, boundary)
SELECT school_id, 'GOLD_1KM', ST_Buffer(location, 1000)::geography
FROM primary_schools;

INSERT INTO priority_zones (school_id, radius_tier, boundary)
SELECT school_id, 'SILVER_2KM', ST_Buffer(location, 2000)::geography
FROM primary_schools;

-- 3. Test Users & Watchlists
INSERT INTO users (user_id, email, password_hash, contact_no) VALUES
(1, 'kiasu_parent@ntu.edu.sg',    'pbkdf2:sha256:260000$salt$hash1', '91234567'),
(2, 'property_investor@gmail.com', 'pbkdf2:sha256:260000$salt$hash2', '98765432'),
(3, 'strategist@outlook.com',      'pbkdf2:sha256:260000$salt$hash3', '90001111');

SELECT setval('users_user_id_seq', 3);

INSERT INTO watchlists (watchlist_id, user_id) VALUES (1, 1), (2, 2), (3, 3);
SELECT setval('watchlists_watchlist_id_seq', 3);

INSERT INTO watchlist_items (watchlist_id, school_id, min_budget, max_budget) VALUES
(1, 1, 400000, 600000),
(1, 2, 500000, 950000);

INSERT INTO watchlist_items (watchlist_id, school_id, min_budget, max_budget) VALUES
(2, 4, 600000, 1200000),
(2, 3, 350000, 700000);

INSERT INTO watchlist_items (watchlist_id, school_id, min_budget, max_budget, is_active) VALUES
(3, 5, 450000, 700000, FALSE);

-- =============================================================================
-- NOTE: HDB blocks and transactions are NOT seeded here.
-- Run DataSyncController.trigger_daily_update() to fetch real data from
-- data.gov.sg. The controller auto-creates HDB blocks via OneMap geocoding
-- as it encounters new (block_num, street_name) pairs in the resale data.
-- =============================================================================
