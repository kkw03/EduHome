#!/usr/bin/env bash
# =============================================================================
# EduHome — Database Initialization Script
# Creates the 'eduhome' database with PostGIS and applies the full schema.
# Safe to re-run: uses IF NOT EXISTS / CREATE OR REPLACE throughout.
# =============================================================================

set -euo pipefail

DB_NAME="${EDUHOME_DB:-eduhome}"
DB_USER="${EDUHOME_DB_USER:-${USER}}"
DB_HOST="${EDUHOME_DB_HOST:-localhost}"
DB_PORT="${EDUHOME_DB_PORT:-5432}"

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "=== EduHome Database Init ==="
echo "    DB: ${DB_NAME} @ ${DB_HOST}:${DB_PORT}"
echo ""

# 1. Create database if it doesn't already exist
if psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -lqt | cut -d \| -f 1 | grep -qw "$DB_NAME"; then
    echo "[OK] Database '${DB_NAME}' already exists — skipping creation."
else
    echo "[..] Creating database '${DB_NAME}'..."
    createdb -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" "$DB_NAME"
    echo "[OK] Database created."
fi

# 2. Apply schema (extensions, tables, indexes, views)
echo "[..] Applying schema from schema.sql..."
psql -h "$DB_HOST" -p "$DB_PORT" -U "$DB_USER" -d "$DB_NAME" -f "${SCRIPT_DIR}/schema.sql"
echo "[OK] Schema applied."

echo ""
echo "=== Done. Run ./seed_db.sh next to load test data. ==="
