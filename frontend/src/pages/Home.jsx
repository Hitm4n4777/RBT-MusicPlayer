import { useEffect, useState } from "react";
import { Music2, Play, RefreshCw } from "lucide-react";
import { getSongs, getSongStreamUrl } from "../services/api";

function Home({ onSelectTrack, onSongsLoaded }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadSongs = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await getSongs();
      setSongs(data);
      onSongsLoaded(data);
    } catch (err) {
      console.error("Failed to load songs:", err);
      setError("Could not load your music library.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadSongs();
  }, []);

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  if (loading) {
    return <div className="library-message">Loading your library...</div>;
  }

  if (error) {
    return (
      <div className="library-message">
        <p>{error}</p>
        <button onClick={loadSongs}>
          <RefreshCw size={16} /> Try Again
        </button>
      </div>
    );
  }

  return (
    <section className="home-page">
      <div className="library-header">
        <div>
          <h1>Your Library</h1>
          <p>{songs.length} songs in your collection</p>
        </div>

        <button onClick={loadSongs} title="Refresh library">
          <RefreshCw size={18} />
        </button>
      </div>

      {songs.length === 0 ? (
        <div className="empty-library">
          <Music2 size={48} />
          <h2>Your library is empty</h2>
          <p>Import some music to get started.</p>
        </div>
      ) : (
        <div className="song-list">
          {songs.map((song) => (
            <div className="song-item" key={song.id}>
              <div className="song-artwork">
                <Music2 size={22} />
              </div>

              <div className="song-info">
                <h3>{song.title}</h3>
                <p>{song.artist || "Unknown Artist"}</p>
              </div>

              <span className="song-album">
                {song.album || "Unknown Album"}
              </span>

              <span className="song-duration">
                {formatDuration(song.duration || 0)}
              </span>

              <button
                className="play-button"
                onClick={() =>
                  onSelectTrack({
                    ...song,
                    streamUrl: getSongStreamUrl(song.id),
                  })
                }
                title="Play song"
              >
                <Play size={18} />
              </button>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Home;
