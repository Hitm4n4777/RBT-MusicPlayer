from pathlib import Path
from sqlalchemy import create_engine
from sqlalchemy.orm import declarative_base, sessionmaker

BASE_DIR = Path(__file__).resolve().parent.parent

STORAGE_DIR = BASE_DIR / "storage"
MUSIC_DIR = STORAGE_DIR / "music"
ARTWORK_DIR = STORAGE_DIR / "artwork"

STORAGE_DIR.mkdir(parents=True, exist_ok=True)
MUSIC_DIR.mkdir(parents=True, exist_ok=True)
ARTWORK_DIR.mkdir(parents=True, exist_ok=True)

DATABASE_PATH = STORAGE_DIR / "music.db"

DATABASE_URL = f"sqlite:///{DATABASE_PATH.as_posix()}"

engine = create_engine(
    DATABASE_URL,
    connect_args={"check_same_thread": False}
)

SessionLocal = sessionmaker(
    autocommit=False,
    autoflush=False,
    bind=engine
)

Base = declarative_base()


def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()