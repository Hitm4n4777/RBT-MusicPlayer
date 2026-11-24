from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Song

router = APIRouter(prefix="/api/favorites", tags=["Favorites"])


class FavoriteUpdate(BaseModel):
    is_favorite: bool


# ==========================================
# GET FAVORITE SONGS
# ==========================================

@router.get("/")
def get_favorites(db: Session = Depends(get_db)):
    songs = db.query(Song).filter(
        Song.is_favorite == True
    ).order_by(Song.date_added.desc()).all()

    return [
        {
            "id": song.id,
            "title": song.title,
            "artist": song.artist,
            "album": song.album,
            "duration": song.duration,
            "is_favorite": song.is_favorite,
            "file_format": song.file_format
        }
        for song in songs
    ]


# ==========================================
# ADD OR REMOVE FAVORITE
# ==========================================

@router.patch("/{song_id}")
def update_favorite(
    song_id: int,
    data: FavoriteUpdate,
    db: Session = Depends(get_db)
):
    song = db.query(Song).filter(
        Song.id == song_id
    ).first()

    if not song:
        raise HTTPException(status_code=404, detail="Song not found")

    song.is_favorite = data.is_favorite

    db.commit()
    db.refresh(song)

    return {
        "message": "Favorite status updated",
        "song_id": song.id,
        "is_favorite": song.is_favorite
    }
