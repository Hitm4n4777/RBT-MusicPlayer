
from pathlib import Path
import shutil
import uuid
import mimetypes

from fastapi import (
    APIRouter,
    UploadFile,
    File,
    Depends,
    HTTPException
)
from fastapi.responses import FileResponse
from sqlalchemy.orm import Session

from app.database import get_db, MUSIC_DIR
from app.models import Song, Genre
from app.metadata import extract_metadata


router = APIRouter(prefix="/api/songs", tags=["Songs"])

ALLOWED_EXTENSIONS = {
    ".mp3",
    ".wav",
    ".flac",
    ".m4a",
    ".ogg",
    ".aac"
}


# GET ALL SONGS
@router.get("/")
def get_songs(db: Session = Depends(get_db)):
    songs = db.query(Song).order_by(
        Song.date_added.desc()
    ).all()

    return [
        {
            "id": song.id,
            "title": song.title,
            "artist": song.artist,
            "album": song.album,
            "genre": song.genre.name if song.genre else "Unknown",
            "duration": song.duration,
            "file_format": song.file_format,
            "file_size": song.file_size,
            "is_favorite": song.is_favorite,
            "play_count": song.play_count,
            "date_added": song.date_added
        }
        for song in songs
    ]


# STREAM A SONG
@router.get("/{song_id}/stream")
def stream_song(
    song_id: int,
    db: Session = Depends(get_db)
):
    song = db.query(Song).filter(
        Song.id == song_id
    ).first()

    if not song:
        raise HTTPException(
            status_code=404,
            detail="Song not found"
        )

    file_path = Path(str(song.file_path))

    if not file_path.is_file():
        raise HTTPException(
            status_code=404,
            detail="Audio file not found"
        )

    media_type, _ = mimetypes.guess_type(str(file_path))

    return FileResponse(
        path=file_path,
        media_type=media_type or "application/octet-stream"
    )


# DELETE A SONG
@router.delete("/{song_id}")
def delete_song(
    song_id: int,
    db: Session = Depends(get_db)
):
    song = db.query(Song).filter(
        Song.id == song_id
    ).first()

    if not song:
        raise HTTPException(
            status_code=404,
            detail="Song not found"
        )

    file_path = Path(str(song.file_path))

    try:
        # Remove playlist associations
        song.playlists.clear()

        # Delete database record
        db.delete(song)
        db.commit()

        # Delete physical audio file
        if file_path.is_file():
            file_path.unlink()

        return {
            "message": "Song deleted successfully",
            "song_id": song_id
        }

    except Exception as error:
        db.rollback()

        raise HTTPException(
            status_code=500,
            detail=f"Failed to delete song: {str(error)}"
        )


# UPLOAD A SONG
@router.post("/upload")
async def upload_song(
    file: UploadFile = File(...),
    db: Session = Depends(get_db)
):
    if not file.filename:
        raise HTTPException(
            status_code=400,
            detail="No filename provided"
        )

    # Preserve the original filename for metadata fallback
    original_filename = file.filename.replace("\\", "/")
    original_title = Path(original_filename).stem.strip()

    if not original_title:
        raise HTTPException(
            status_code=400,
            detail="Invalid filename"
        )

    extension = Path(original_filename).suffix.lower()

    if extension not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=400,
            detail="Unsupported audio format"
        )

    # Generate a unique storage filename
    unique_name = f"{uuid.uuid4()}{extension}"
    file_path = MUSIC_DIR / unique_name

    try:
        # Save uploaded audio
        with file_path.open("wb") as buffer:
            shutil.copyfileobj(file.file, buffer)

        # Get file size
        file_size = file_path.stat().st_size

        # Extract embedded metadata
        metadata = extract_metadata(str(file_path))

        # If no embedded title exists, use original filename
        if metadata["title"] == file_path.stem:
            metadata["title"] = original_title

        # Find or create genre
        genre_name = metadata["genre"]

        genre = db.query(Genre).filter(
            Genre.name == genre_name
        ).first()

        if not genre:
            genre = Genre(name=genre_name)
            db.add(genre)
            db.flush()

        # Create song record
        song = Song(
            title=metadata["title"],
            artist=metadata["artist"],
            album=metadata["album"],
            genre_id=genre.id,
            duration=metadata["duration"],
            file_path=str(file_path),
            file_format=extension.lstrip("."),
            file_size=file_size
        )

        db.add(song)
        db.commit()
        db.refresh(song)

        return {
            "message": "Song uploaded successfully",
            "song": {
                "id": song.id,
                "title": song.title,
                "artist": song.artist,
                "album": song.album,
                "genre": genre.name,
                "duration": song.duration,
                "file_size": song.file_size
            }
        }

    except Exception as error:
        db.rollback()

        if file_path.exists():
            file_path.unlink()

        raise HTTPException(
            status_code=500,
            detail=f"Upload failed: {str(error)}"
        )

    finally:
        await file.close()
