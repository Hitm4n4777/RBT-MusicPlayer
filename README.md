# RBT-WebPlayer

A personal, self-hosted music library and web-based audio player built
with React and FastAPI.

RBT-WebPlayer is a personal alternative to traditional music streaming
platforms. It allows users to upload, organize, manage, and play their
own music collection through a clean, modern web interface.

The project focuses on simplicity, local storage, and a lightweight
architecture without relying on external music streaming services.

---

https://github.com/user-attachments/assets/c55b2ee2-a601-46c3-9970-4a2ac35af01e

## Overview

RBT-WebPlayer was created to provide a dedicated space for managing and
listening to personal music collections.

Instead of depending on streaming platforms, the application stores
audio files locally and makes them accessible through a browser-based
music player.

The interface follows a unique dark aesthetic, combining charcoal
backgrounds, muted green accents, and a minimal design inspired by
modern music applications.

## Features

### Music Library

- Upload personal audio files.
- Automatically extract embedded audio metadata.
- Display song titles, artists, albums, genres, and durations.
- Browse the personal music collection.
- Store music files locally.

### Audio Player

- Stream audio directly from the backend.
- Play and pause tracks.
- Skip to the next or previous track.
- Seek through audio using a progress bar.
- Adjust playback volume.
- Display current playback information.

### Music Management

- Retrieve songs from the local database.
- Upload new audio files.
- Remove songs from the collection.
- Maintain song information and metadata.

### Interface

- Modern dark-themed interface.
- Responsive layout.
- Dedicated music library.
- Sidebar navigation.
- Persistent playback controls.
- Muted green accent colors and minimal styling.

---

## Tech Stack

### Frontend

Technology Purpose

---

React 19 Component-based UI
Vite Frontend development and build tool
JavaScript (JSX) Application logic
CSS Styling and responsive layouts
Axios API communication
Lucide React Interface icons

### Backend

Technology Purpose

---

Python Backend development
FastAPI REST API
SQLAlchemy Database ORM
SQLite Local database
Mutagen Audio metadata extraction
Uvicorn ASGI server
Python Multipart Audio file uploads

---

### How It Works

1.  The user interacts with the React frontend.
2.  Axios sends requests to the FastAPI backend.
3.  FastAPI processes requests and interacts with SQLite through
    SQLAlchemy.
4.  Uploaded audio files are stored in the local music directory.
5.  Mutagen extracts available metadata from uploaded files.
6.  The backend returns song information to the frontend.
7.  Audio files are streamed to the browser through dedicated API
    endpoints.
8.  The browser's audio playback functionality handles playback.

---

## Installation and Setup

### Prerequisites

Make sure you have the following installed:

- Python 3.10+
- Node.js and npm
- Git

### 1. Clone the Repository

```bash
git clone https://github.com/Hitm4n4777/RBT-WebPlayer.git
cd RBT-WebPlayer
```

### 2. Backend Setup

Navigate to the backend directory:

```bash
cd backend
```

Create a virtual environment:

```bash
python -m venv .venv
```

Activate it on Windows:

```powershell
.venv\Scripts\activate
```

Install dependencies:

```bash
pip install fastapi "uvicorn[standard]" sqlalchemy mutagen python-multipart
```

Save installed dependencies:

```bash
pip freeze > requirements.txt
```

Start the backend server:

```bash
uvicorn app.main:app --reload
```

The backend will run at:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

### 3. Frontend Setup

Open another terminal and navigate to the frontend directory:

```bash
cd frontend
```

Install dependencies:

```bash
npm install
```

Install the required packages if they are not already installed:

```bash
npm install axios lucide-react
```

Start the development server:

```bash
npm run dev
```

The frontend will typically be available at:

```text
http://localhost:5173
```

---

## API Endpoints

The backend exposes REST API endpoints for interacting with the music
library.

Method Endpoint Description

---

GET `/api/status` Check API status
GET `/api/songs/` Retrieve all songs
POST `/api/songs/upload` Upload a new song
GET `/api/songs/{id}/stream` Stream an audio file
DELETE `/api/songs/{id}` Delete a song

---

## Development Challenges

Building RBT-WebPlayer involved several challenges, particularly around
handling audio files, extracting metadata, and connecting the frontend
to the backend.

### 1. Handling Audio File Uploads

One of the first challenges was implementing a reliable way to upload
actual audio files rather than simply storing song names in a database.

The solution involved using FastAPI's `UploadFile` functionality and
storing uploaded files in a dedicated local directory.

UUID-based filenames were introduced to prevent filename collisions when
multiple songs were uploaded.

### 2. Audio Metadata Extraction

Audio files contain metadata such as title, artist, album, and genre,
but not every file has complete or properly formatted tags.

Mutagen was integrated to extract available metadata automatically.

Fallback values were also introduced for missing information. Another
challenge was ensuring that the original uploaded filename was preserved
as the fallback title instead of displaying the generated UUID.

### 3. Database and File Synchronization

The project uses SQLite for storing song information while keeping the
actual audio files on the filesystem.

This creates an important challenge: database records and physical files
must remain consistent when songs are uploaded or deleted.

SQLAlchemy handles database operations, while Python's filesystem
utilities manage the actual audio files.

### 4. Audio Streaming

Serving audio files through an API is different from simply returning
JSON data.

FastAPI's `FileResponse` was used to serve audio files, allowing the
browser to load and play music through the HTML5 Audio API.

### 5. Frontend and Backend Integration

Connecting React to FastAPI required handling asynchronous API requests,
loading states, error handling, and dynamically updating the music
library.

Axios was introduced to centralize API communication and simplify
frontend requests.

### 6. Building a Consistent User Interface

Another challenge was moving beyond a basic functional interface and
creating something that feels like a dedicated music application.

The design evolved towards a dark, minimal aesthetic with muted green
accents, responsive layouts, and dedicated playback controls.

---

## Future Improvements

RBT-WebPlayer is an ongoing project. Planned improvements include:

- [ ] Playlist creation and management.
- [ ] Album artwork extraction and display.
- [ ] Search and filtering.
- [ ] Favorite tracks.
- [ ] Recently played songs.
- [ ] Shuffle and repeat playback.
- [ ] Queue management.
- [ ] Editing song metadata.
- [ ] Importing entire music folders.
- [ ] Improved audio player controls.
- [ ] Better mobile responsiveness.
- [ ] Playback history and statistics.

---

## Project Goals

The main goal of RBT-WebPlayer is to create a lightweight, personal
music platform that provides control over a local music collection
without unnecessary complexity.

The project also serves as a practical exploration of full-stack
development, REST API design, database management, file handling, audio
metadata processing, and modern React development.

---

## License

This project is intended for personal use and educational purposes.

---

**Built with React, FastAPI, Python, and a love for music.**
