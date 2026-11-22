import { useEffect, useRef, useState } from "react";
import {
  Play,
  Pause,
  SkipBack,
  SkipForward,
  Volume2,
  VolumeX,
} from "lucide-react";

function Player({ currentTrack, songs, onSelectTrack }) {
  const audioRef = useRef(null);

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);

  // Load and play selected track
  useEffect(() => {
    const audio = audioRef.current;

    if (!audio || !currentTrack) {
      setIsPlaying(false);
      return;
    }

    audio.src = currentTrack.streamUrl;
    audio.volume = volume;
    audio.load();

    audio
      .play()
      .then(() => setIsPlaying(true))
      .catch((error) => {
        console.error("Playback failed:", error);
        setIsPlaying(false);
      });

    setCurrentTime(0);
  }, [currentTrack?.id]);

  // Update audio volume
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.volume = volume;
    }
  }, [volume]);

  const togglePlay = async () => {
    const audio = audioRef.current;

    if (!audio || !currentTrack) return;

    if (audio.paused) {
      try {
        await audio.play();
        setIsPlaying(true);
      } catch (error) {
        console.error("Playback failed:", error);
      }
    } else {
      audio.pause();
      setIsPlaying(false);
    }
  };

  const playNext = () => {
    if (!songs.length || !currentTrack) return;

    const index = songs.findIndex((song) => song.id === currentTrack.id);

    const nextIndex = (index + 1) % songs.length;
    onSelectTrack(songs[nextIndex]);
  };

  const playPrevious = () => {
    if (!songs.length || !currentTrack) return;

    const audio = audioRef.current;

    if (audio && audio.currentTime > 3) {
      audio.currentTime = 0;
      return;
    }

    const index = songs.findIndex((song) => song.id === currentTrack.id);

    const previousIndex = (index - 1 + songs.length) % songs.length;

    onSelectTrack(songs[previousIndex]);
  };

  const handleSeek = (event) => {
    const time = Number(event.target.value);

    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  };

  const formatTime = (time) => {
    if (!Number.isFinite(time)) return "0:00";

    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);

    return `${minutes}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <footer className="player-bar">
      <audio
        ref={audioRef}
        onTimeUpdate={(event) => setCurrentTime(event.target.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.target.duration)}
        onEnded={playNext}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
      />

      <div className="player-track">
        {currentTrack ? (
          <>
            <div className="player-artwork">♪</div>

            <div className="player-track-info">
              <strong>{currentTrack.title}</strong>
              <span>{currentTrack.artist || "Unknown Artist"}</span>
            </div>
          </>
        ) : (
          <div className="player-track-info">
            <strong>No song selected</strong>
            <span>Choose a song to start listening</span>
          </div>
        )}
      </div>

      <div className="player-controls">
        <div className="control-buttons">
          <button
            onClick={playPrevious}
            disabled={!currentTrack || songs.length === 0}
            title="Previous"
          >
            <SkipBack />
          </button>

          <button
            className="main-play-button"
            onClick={togglePlay}
            disabled={!currentTrack}
            title={isPlaying ? "Pause" : "Play"}
          >
            {isPlaying ? <Pause /> : <Play />}
          </button>

          <button
            onClick={playNext}
            disabled={!currentTrack || songs.length === 0}
            title="Next"
          >
            <SkipForward />
          </button>
        </div>

        <div className="progress-container">
          <span>{formatTime(currentTime)}</span>

          <input
            type="range"
            min="0"
            max={duration || 0}
            value={Math.min(currentTime, duration || 0)}
            onChange={handleSeek}
            disabled={!currentTrack || !duration}
          />

          <span>{formatTime(duration)}</span>
        </div>
      </div>

      <div className="volume-control">
        <button
          onClick={() => setVolume(volume === 0 ? 0.7 : 0)}
          title="Mute / Unmute"
        >
          {volume === 0 ? <VolumeX /> : <Volume2 />}
        </button>

        <input
          type="range"
          min="0"
          max="1"
          step="0.01"
          value={volume}
          onChange={(event) => setVolume(Number(event.target.value))}
        />
      </div>
    </footer>
  );
}

export default Player;
