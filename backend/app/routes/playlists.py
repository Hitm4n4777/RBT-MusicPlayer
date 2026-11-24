
from pydantic import BaseModel
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models import Playlist, Song

router = APIRouter(prefix="/api/playlists", tags=["Playlists"])


    # ==========================================
    # REQUEST SCHEMAS
    # ==========================================

class PlaylistCreate(BaseModel):
    name: str
    description: str = ""


# ==========================================
# GET ALL PLAYLISTS
# ==========================================

@router.get("/")
def get_playlists(db: Session = Depends(get_db)):
    playlists = db.query(Playlist).order_by(
        Playlist.created_at.desc()
    ).all()

    return [
        {
            "id": playlist.id,
            "name": playlist.name,
            "description": playlist.description,
            "created_at": playlist.created_at,
            "song_count": len(playlist.songs)
        }
        for playlist in playlists
    ]


# ==========================================
# CREATE PLAYLIST
# ==========================================

@router.post("/")
def create_playlist(
    data: PlaylistCreate,
    db: Session = Depends(get_db)
):
    name = data.name.strip()

    if not name:
        raise HTTPException(
            status_code=400,
            detail="Playlist name cannot be empty"
        )

    playlist = Playlist(
        name=name,
        description=data.description.strip()
    )

    db.add(playlist)
    db.commit()
    db.refresh(playlist)

    return {
        "message": "Playlist created successfully",
        "playlist": {
            "id": playlist.id,
            "name": playlist.name,
            "description": playlist.description,
            "song_count": 0
        }
    }


# ==========================================
# GET PLAYLIST DETAILS
# ==========================================

@router.get("/{playlist_id}")
def get_playlist(
    playlist_id: int,
    db: Session = Depends(get_db)
):
    playlist = db.query(Playlist).filter(
        Playlist.id == playlist_id
    ).first()

    if not playlist:
        raise HTTPException(404, "Playlist not found")

    return {
        "id": playlist.id,
        "name": playlist.name,
        "description": playlist.description,
        "created_at": playlist.created_at,
        "songs": [
            {
                "id": song.id,
                "title": song.title,
                "artist": song.artist,
                "album": song.album,
                "duration": song.duration,
                "is_favorite": song.is_favorite
            }
            for song in playlist.songs
        ]
    }


# ==========================================
# ADD SONG TO PLAYLIST
# ==========================================

@router.post("/{playlist_id}/songs/{song_id}")
def add_song_to_playlist(
    playlist_id: int,
    song_id: int,
    db: Session = Depends(get_db)
):
    playlist = db.query(Playlist).filter(
        Playlist.id == playlist_id
    ).first()

    song = db.query(Song).filter(
        Song.id == song_id
    ).first()

    if not playlist:
        raise HTTPException(404, "Playlist not found")

    if not song:
        raise HTTPException(404, "Song not found")

    if song not in playlist.songs:
        playlist.songs.append(song)
        db.commit()

    return {
        "message": "Song added to playlist",
        "playlist_id": playlist_id,
        "song_id": song_id
    }


# ==========================================
# REMOVE SONG FROM PLAYLIST
# ==========================================

@router.delete("/{playlist_id}/songs/{song_id}")
def remove_song_from_playlist(
    playlist_id: int,
    song_id: int,
    db: Session = Depends(get_db)
):
    playlist = db.query(Playlist).filter(
        Playlist.id == playlist_id
    ).first()

    if not playlist:
        raise HTTPException(404, "Playlist not found")

    song = db.query(Song).filter(
        Song.id == song_id
    ).first()

    if not song:
        raise HTTPException(404, "Song not found")

    if song in playlist.songs:
        playlist.songs.remove(song)
        db.commit()

    return {"message": "Song removed from playlist"}


# ==========================================
# DELETE PLAYLIST
# ==========================================

@router.delete("/{playlist_id}")
def delete_playlist(
    playlist_id: int,
    db: Session = Depends(get_db)
):
    playlist = db.query(Playlist).filter(
        Playlist.id == playlist_id
    ).first()

    if not playlist:
        raise HTTPException(404, "Playlist not found")

    playlist.songs.clear()
    db.delete(playlist)
    db.commit()

    return {"message": "Playlist deleted successfully"}
