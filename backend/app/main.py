
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.database import Base, engine
from app import models
from app.routes import songs

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="MusicPlayer API",
    description="Personal Music Library and Streaming API",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(songs.router)


@app.get("/")
def root():
    return {
        "app": "MusicPlayer",
        "status": "running"
    }


@app.get("/api/status")
def status():
    return {
        "status": "success",
        "message": "API is operational",
        "database": "initialized"
    }
