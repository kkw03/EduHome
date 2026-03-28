from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from backend.entity.user import User                    # noqa: E402
from backend.entity.primary_school import PrimarySchool  # noqa: E402
from backend.entity.priority_zone import PriorityZone    # noqa: E402
from backend.entity.hdb_block import HDBBlock            # noqa: E402
from backend.entity.transaction import Transaction       # noqa: E402
from backend.entity.watchlist import Watchlist            # noqa: E402
from backend.entity.watchlist_item import WatchlistItem   # noqa: E402
from backend.entity.persistent_store import PersistentStore  # noqa: E402
