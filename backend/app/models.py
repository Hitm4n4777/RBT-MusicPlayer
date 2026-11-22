
from sqlalchemy import (
    Column,
    Integer,
    String,
    Boolean,
    Float,
    DateTime,
    ForeignKey,
    Table,
    func
)
from sqlalchemy.orm import relationship

from app.database import Base


# ==========================================
# Playlist-Song Relationship
# ==========================================

playlist_songs = Table(
    "playlist_songs",
    Base.metadata,

    Column(
        "playlist_id",
        Integer,
        ForeignKey("playlists.id", ondelete="CASCADE"),
        primary_key=True
    ),

    Column(
        "song_id",
        Integer,
        ForeignKey("songs.id", ondelete="CASCADE"),
        primary_key=True
    )
)


# ==========================================
# Genre Model
# ==========================================

class Genre(Base):
    __tablename__ = "genres"

    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(100), unique=True, nullable=False)

    songs = relationship(
        "Song",
        back_populates="genre"
    )


# ==========================================
# Song Model
# ==========================================

class Song(Base):
    __tablename__ = "songs"

    id = Column(Integer, primary_key=True, index=True)

    title = Column(String(255), nullable=False)
    artist = Column(String(255))
    album = Column(String(255))

    genre_id = Column(
        Integer,
        ForeignKey("genres.id"),
        nullable=True
    )

    duration = Column(Float, default=0)

    file_path = Column(String(500), unique=True, nullable=False)
    artwork_path = Column(String(500))

    file_format = Column(String(20))
    file_size = Column(Integer)

    is_favorite = Column(Boolean, default=False)
    play_count = Column(Integer, default=0)

    date_added = Column(
        DateTime,
        server_default=func.now()
    )

    genre = relationship(
        "Genre",
        back_populates="songs"
    )

    playlists = relationship(
        "Playlist",
        secondary=playlist_songs,
        back_populates="songs"
    )


# ==========================================
# Playlist Model
# ==========================================

class Playlist(Base):
    __tablename__ = "playlists"

    id = Column(Integer, primary_key=True, index=True)

    name = Column(String(255), nullable=False)
    description = Column(String(500))

    created_at = Column(
        DateTime,
        server_default=func.now()
    )

    songs = relationship(
        "Song",
        secondary=playlist_songs,
        back_populates="playlists"
    )
