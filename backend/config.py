# TODO: class Config — base configuration
# TODO: SQLALCHEMY_DATABASE_URI = "postgresql+psycopg2://user:pass@localhost:5432/eduhome"
# TODO: SECRET_KEY for Flask session signing
# TODO: ONEMAP_BASE_URL = "https://www.onemap.gov.sg/api" — SLA OneMap API
# TODO: ONEMAP_TOKEN — OneMap authentication token
# TODO: GOVDATA_HDB_URL — data.gov.sg HDB resale endpoint
# TODO: GOVDATA_MOE_URL — data.gov.sg MOE school info endpoint
# TODO: MAIL_SERVER, MAIL_PORT, MAIL_USERNAME, MAIL_PASSWORD — SMTP for watchlist alerts (FR7)
# TODO: DEMO_MODE = False — toggle cached-data fallback when APIs are offline (NFR3)
# TODO: SYNC_INTERVAL_HOURS = 24 — background data sync frequency (UC5)

import os


class Config:
    # this can be whatever that we want
    SECRET_KEY = os.environ.get("SECRET_KEY", "")

    SQLALCHEMY_DATABASE_URI = os.environ.get(
        "DATABASE_URL",
        "postgresql+psycopg2://postgres:postgres@localhost:5432/eduhome"
    )
    SQLALCHEMY_TRACK_MODIFICATIONS = False

    # External APIs
    ONEMAP_BASE_URL = "https://www.onemap.gov.sg/api"
    ONEMAP_TOKEN = os.environ.get("ONEMAP_TOKEN", "")
    GOVDATA_HDB_URL = "https://data.gov.sg/api/action/datastore_search"
    GOVDATA_MOE_URL = "https://data.gov.sg/api/action/datastore_search"
    GOV_DATA_API = os.environ.get("GOV_DATA_API", "")

    # Mail (for watchlist alerts — FR7)
    MAIL_SERVER = os.environ.get("MAIL_SERVER", "")
    MAIL_PORT = int(os.environ.get("MAIL_PORT", 587))
    MAIL_USERNAME = os.environ.get("MAIL_USERNAME", "")
    MAIL_PASSWORD = os.environ.get("MAIL_PASSWORD", "")

    # System settings
    DEMO_MODE = os.environ.get("DEMO_MODE", "false").lower() == "true"
    SYNC_INTERVAL_HOURS = int(os.environ.get("SYNC_INTERVAL_HOURS", 24))
