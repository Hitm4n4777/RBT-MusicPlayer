
from mutagen import File
from pathlib import Path


def extract_metadata(file_path: str):
    audio = File(file_path, easy=True)

    if audio is None:
        raise ValueError("Unsupported or invalid audio file")

    def get_tag(name, fallback):
        values = audio.get(name, [])
        return str(values[0]).strip() if values and str(values[0]).strip() else fallback

    return {
        "title": get_tag("title", Path(file_path).stem),
        "artist": get_tag("artist", "Unknown Artist"),
        "album": get_tag("album", "Unknown Album"),
        "genre": get_tag("genre", "Unknown"),
        "duration": audio.info.length if audio.info else 0
    }
