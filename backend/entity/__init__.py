# TODO: Export entity/model classes

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

from backend.entity.user import User
from backend.entity.primary_school import PrimarySchool
from backend.entity.hdb_block import HDBBlock
from backend.entity.transaction import Transaction
from backend.entity.watchlist import Watchlist
from backend.entity.watchlist_item import WatchlistItem
