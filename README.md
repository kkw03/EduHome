# EduHome: P1 Registration Strategist

A strategic property intelligence platform designed for Singaporean parents planning for Primary 1 Registration. EduHome identifies "undervalued" housing options by correlating real-time HDB resale prices with MOE School Priority Zones (1 km / 2 km). Unlike standard property portals, it treats school proximity as the primary asset class.

## Target Users

- **Kiasu Young Parents** — Planning moves for Phase 2C registration, 1–2 years in advance.
- **Property Investors** — Seeking high-rental-yield units near top primary schools.
- **Strategists** — Optimizing the trade-off between school distance and square footage.

---

## Design Methodology

### Entity-Boundary-Control (EBC)

The system follows the **Entity-Boundary-Control** architectural pattern, separating concerns into three layers:

| Layer | Role | Location |
|-------|------|----------|
| **Boundary** | UI routes (Flask blueprints) and external API clients | `backend/boundary/` |
| **Control** | Business logic — search, analytics, alerts, sync | `backend/control/` |
| **Entity** | Data models mapped to PostgreSQL via SQLAlchemy/GeoAlchemy2 | `backend/entity/` |

The React frontend mirrors this separation with **pages** (screen-level views), **components** (reusable UI), and **services** (API client functions that call the Boundary layer).

### Design Artefacts

| Artefact | File | Description |
|----------|------|-------------|
| Requirements | `requirements.txt` | Functional (FR1–FR8) and non-functional (NFR1–NFR5) requirements |
| Class Diagram | `class.txt` | PlantUML EBC class diagram with full attributes, methods, and relationships |
| Dialog Map | `dialog.txt` | PlantUML state diagram covering all 10 use cases and screen transitions |

---

## Tech Stack

### Frontend — React

| Technology | Purpose |
|------------|---------|
| React 18 | Component-based UI framework |
| React Router v6 | Client-side routing (`/`, `/search`, `/watchlist`) |
| React-Leaflet | Interactive map rendering with Leaflet.js |
| Chart.js + react-chartjs-2 | 12-month price trend charts (FR3) |
| Axios | HTTP client for backend API communication |
| React Context API | Authentication state management |

### Backend — Python / Flask

| Technology | Purpose |
|------------|---------|
| Flask | Lightweight web framework serving REST API endpoints |
| Flask-SQLAlchemy | ORM for database models and queries |
| GeoAlchemy2 | PostGIS geography column support (points, polygons, spatial queries) |
| psycopg2 | PostgreSQL database adapter |
| Flask-Login | Session-based authentication |
| Flask-Mail | Email alerts for watchlist notifications (FR7) |
| APScheduler | Background scheduler for daily data sync (UC5) |
| flask-cors | Cross-origin resource sharing for React dev server |
| pytest + pytest-flask | Unit and integration testing |

### Database — PostgreSQL + PostGIS

| Technology | Purpose |
|------------|---------|
| PostgreSQL | Relational database for all persistent data |
| PostGIS extension | Geospatial types (`GEOGRAPHY(Point)`, `GEOGRAPHY(Polygon)`) and spatial functions (`ST_DWithin`, `ST_Contains`) |
| GIST indexes | Spatial indexing on `hdb_blocks.location` for sub-2-second radius queries (NFR1) |
| B-tree indexes | On `transactions.transaction_date` and `transactions.block_id` for efficient trend and block lookups (NFR4) |

### External Data Sources

| Source | API | Usage |
|--------|-----|-------|
| MOE | School information dataset | Official list of primary schools and vacancy data |
| HDB | Resale transaction records | Historical resale prices for valuation and trend analysis |
| SLA | OneMap Search & Routing API | Geocoding postal codes and calculating commute times |
| URA | Master Plan | Future development overlays for long-term value assessment |

---

## Functional Requirements

| ID | Feature | Description |
|----|---------|-------------|
| FR1 | Priority Zone Search | Select a school; visualize all HDB blocks within 1 km (Gold) and 2 km (Silver) balloting radii |
| FR2 | Valuation Gap Analysis | Identify "Hidden Gems" — blocks in the 1 km zone with PSF significantly below the zone average |
| FR3 | Market Trend & Momentum | 12-month moving average trend line per block; classify as "Heating Up" or "Cooling Off" |
| FR4 | Affordability Heatmap | Colour-coded price overlay on the map to spot affordable pockets in expensive districts |
| FR5 | Balloting Risk Simulator | Estimate overcrowding risk based on residential unit density vs. school vacancies |
| FR6 | Lease Decay Guard | Flag flats where remaining lease is insufficient to cover 6 years of primary education |
| FR7 | Strategic Watchlist | Subscribe to a school zone and receive email alerts on new transactions |
| FR8 | Commute Optimizer | For users outside 1 km, find the block with the shortest direct bus travel time to the school |

## Non-Functional Requirements

| ID | Requirement | Target |
|----|-------------|--------|
| NFR1 | Geospatial Performance | Spatial queries across 10,000 blocks execute in < 2 seconds (PostGIS GIST indexing) |
| NFR2 | Regulatory Accuracy | Distance calculations adhere to SLA OneMap radial logic for balloting validity |
| NFR3 | System Reliability | Full "Demo Mode" operation using cached data when external APIs are offline |
| NFR4 | Data Scalability | Efficiently handle and index 5+ years of historical data (~150,000 rows) |
| NFR5 | Mobile Responsiveness | Map interface and dashboards fully navigable on mobile devices |

---

## Project Structure

```
EduHome/
├── frontend/                          # React (Create React App)
│   ├── package.json
│   ├── public/index.html
│   └── src/
│       ├── index.js                   # Entry point
│       ├── App.js                     # Route definitions
│       ├── App.css                    # Global styles
│       ├── pages/                     # Screen-level views
│       │   ├── HomePage.jsx
│       │   ├── SearchResultsPage.jsx
│       │   └── WatchlistPage.jsx
│       ├── components/                # Reusable UI components
│       │   ├── NavBar.jsx
│       │   ├── SearchBar.jsx
│       │   ├── MapView.jsx            # react-leaflet map
│       │   ├── FilterPanel.jsx
│       │   ├── HiddenGems.jsx
│       │   ├── TrendChart.jsx         # react-chartjs-2
│       │   ├── Heatmap.jsx
│       │   ├── BallotRisk.jsx
│       │   ├── LeaseGuard.jsx
│       │   ├── CommuteOptimizer.jsx
│       │   └── LoginModal.jsx
│       ├── services/                  # API client functions (Axios)
│       │   ├── api.js
│       │   ├── searchService.js
│       │   ├── filterService.js
│       │   ├── trendService.js
│       │   ├── ballotRiskService.js
│       │   ├── commuteService.js
│       │   ├── watchlistService.js
│       │   └── authService.js
│       ├── context/
│       │   └── AuthContext.jsx        # Authentication state
│       └── hooks/
│           ├── useSearch.js
│           └── useMapOverlays.js
│
├── backend/                           # Python Flask
│   ├── app.py                         # Flask app factory
│   ├── config.py                      # Configuration
│   ├── requirements.pip               # Python dependencies
│   ├── boundary/                      # API routes (Flask blueprints)
│   │   ├── search_map_routes.py
│   │   ├── filter_panel_routes.py
│   │   ├── watchlist_routes.py
│   │   ├── auth_routes.py
│   │   ├── trend_routes.py
│   │   ├── ballot_risk_routes.py
│   │   ├── commute_routes.py
│   │   └── external/                  # Third-party API clients
│   │       ├── onemap_api.py
│   │       └── govdata_api.py
│   ├── control/                       # Business logic
│   │   ├── search_controller.py
│   │   ├── analytics_controller.py
│   │   ├── watchlist_controller.py
│   │   ├── commute_controller.py
│   │   ├── datasync_controller.py
│   │   └── account_controller.py
│   ├── entity/                        # SQLAlchemy + GeoAlchemy2 models
│   │   ├── user.py
│   │   ├── primary_school.py
│   │   ├── priority_zone.py
│   │   ├── hdb_block.py
│   │   ├── transaction.py
│   │   ├── watchlist.py
│   │   ├── watchlist_item.py
│   │   └── persistent_store.py
│   └── tests/                         # pytest
│       ├── test_search_controller.py
│       ├── test_analytics_controller.py
│       ├── test_watchlist_controller.py
│       ├── test_commute_controller.py
│       ├── test_datasync_controller.py
│       └── test_account_controller.py
│
├── database/                          # PostgreSQL + PostGIS
│   ├── schema.sql                     # DDL with Geography columns and indexes
│   └── seed_data.sql                  # Sample data for development
│
├── requirements.txt                   # Project requirements document
├── class.txt                          # EBC class diagram (PlantUML)
└── dialog.txt                         # Dialog map / state diagram (PlantUML)
```

---

## Use Case Map

Each use case from the dialog map traces to specific frontend components, backend routes, controllers, and entity models:

| UC | Name | Frontend | Backend Route | Controller | Key Entities |
|----|------|----------|---------------|------------|--------------|
| UC1 | Search School Priority Zone | SearchBar, MapView | search_map_routes | SearchController | PrimarySchool, PriorityZone, HDBBlock |
| UC2 | Filter by Budget | FilterPanel | filter_panel_routes | SearchController | HDBBlock, Transaction |
| UC3 | Hidden Gems | HiddenGems | search_map_routes | AnalyticsController | HDBBlock, Transaction |
| UC4 | Manage Watchlist | WatchlistPage, LoginModal | watchlist_routes, auth_routes | WatchlistController, AccountController | User, Watchlist, WatchlistItem |
| UC5 | Update Market Data | _(background)_ | _(scheduler)_ | DataSyncController | Transaction, PersistentStore |
| UC6 | Market Trend | TrendChart | trend_routes | AnalyticsController | HDBBlock, Transaction |
| UC7 | Affordability Heatmap | Heatmap | search_map_routes | AnalyticsController | HDBBlock, Transaction |
| UC8 | Balloting Risk | BallotRisk | ballot_risk_routes | AnalyticsController | PrimarySchool, PriorityZone, HDBBlock |
| UC9 | Lease Decay Guard | LeaseGuard | filter_panel_routes | SearchController | HDBBlock |
| UC10 | Commute Optimizer | CommuteOptimizer | commute_routes | CommuteController | PrimarySchool, HDBBlock |

---

## Getting Started

### Prerequisites

- Node.js 18+
- Python 3.10+
- PostgreSQL 14+ with PostGIS extension

### Database Setup

```bash
createdb eduhome
psql -d eduhome -c "CREATE EXTENSION postgis;"
psql -d eduhome -f database/schema.sql
psql -d eduhome -f database/seed_data.sql
```

### Backend

```bash
cd backend
pip install -r requirements.pip
python app.py
```

The Flask API server starts on `http://localhost:5000`.

### Frontend

```bash
cd frontend
npm install
npm start
```

The React dev server starts on `http://localhost:3000` and proxies API requests to Flask.
