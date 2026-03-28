#!/usr/bin/env bash
# =============================================================================
# EduHome — Seed Data Script
# Loads sample schools, HDB blocks, transactions, and a test user
# into an already-initialized database.
#
# WARNING: This truncates existing data before inserting.
#          Only use for development/testing.
# =============================================================================

set -euo pipefail

DB_NAME="${EDUHOME_DB:-eduhome}"
DB_USER="${EDUHOME_DB_USER:-${USER}}"
DB_HOST="${EDUHOME_DB_HOST:-localhost}"
DB_PORT="${EDUHOME_DB_PORT:-5432}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

PSQL="psql -h ${DB_HOST} -p ${DB_PORT} -U ${DB_USER} -d ${DB_NAME}"

echo "=== EduHome Seed Data ==="
echo "    DB: ${DB_NAME} @ ${DB_HOST}:${DB_PORT}"
echo ""

# 1. Verify database exists
if ! psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    echo "[ERROR] Database '${DB_NAME}' not found. Run ./init_db.sh first."
    exit 1
fi

# 2. Clear existing data (respects FK order)
echo "[..] Clearing existing seed data..."
$PSQL -c "TRUNCATE watchlist_items, watchlists, transactions, hdb_blocks, priority_zones, primary_schools, users RESTART IDENTITY CASCADE;"
echo "[OK] Tables cleared."

# 3. Load seed data
echo "[..] Inserting seed data from seed_data.sql..."
$PSQL -f "${SCRIPT_DIR}/seed_data.sql"
echo "[OK] Seed data loaded."

# 4. Quick verification
echo ""
echo "--- Verification ---"
$PSQL -c "SELECT official_name, vacancies FROM primary_schools;"
$PSQL -c "SELECT street_name, block_num, lease_start_year FROM hdb_blocks;"
$PSQL -c "SELECT COUNT(*) AS transaction_count FROM transactions;"
$PSQL -c "SELECT email FROM users;"
echo ""
echo "=== Done. Database is ready for testing. ==="
