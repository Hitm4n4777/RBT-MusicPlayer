import { useEffect, useState } from "react";
import { Heart, Music2, Play, RefreshCw } from "lucide-react";
import { getFavorites, getSongStreamUrl } from "../services/api";

function Favorites({ onSelectTrack, allSongs = [] }) {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadFavorites = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getFavorites();
      setFavorites(data);
    } catch (err) {
      console.error("Failed to load favorites:", err);
      setError("Could not load your favorites.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadFavorites();
  }, []);

  const formatDuration = (seconds) => {
    const minutes = Math.floor((seconds || 0) / 60);
    const remaining = Math.floor((seconds || 0) % 60);
    return `${minutes}:${String(remaining).padStart(2, "0")}`;
  };

  if (loading)
    return <div className="library-message">Loading favorites...</div>;

  return (
    <section className="home-page">
      <div className="library-header">
        <div>
          <h1>Favorites</h1>
          <p>{favorites.length} favorite songs</p>
        </div>
        <button onClick={loadFavorites} title="Refresh favorites">
          <RefreshCw size={18} />
        </button>
      </div>

      {error && <div className="playlist-error">{error}</div>}

      {favorites.length === 0 ? (
        <div className="empty-library">
          <Heart size={48} />
          <h2>No favorites yet</h2>
          <p>Use a song's menu to add it to favorites.</p>
        </div>
      ) : (
        <div className="song-list">
          {favorites.map((song) => {
            const source = allSongs.find((item) => item.id === song.id) || {
              ...song,
              streamUrl: getSongStreamUrl(song.id),
            };

            return (
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
                  {formatDuration(song.duration)}
                </span>
                <button
                  className="play-button"
                  onClick={() => onSelectTrack(source)}
                  title="Play song"
                >
                  <Play size={18} />
                </button>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
}

export default Favorites;
