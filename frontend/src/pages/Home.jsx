import { useEffect, useState } from "react";
import { ListPlus, Music2, Play, RefreshCw } from "lucide-react";
import {
  addSongToPlaylist,
  getPlaylists,
  getSongs,
  getSongStreamUrl,
} from "../services/api";
import SoftAurora from "../components/SoftAurora";

function Home({ onSelectTrack, onSongsLoaded }) {
  const [songs, setSongs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [playlists, setPlaylists] = useState([]);
  const [openMenuSongId, setOpenMenuSongId] = useState(null);

  const loadSongs = async () => {
    try {
      setLoading(true);
      setError("");

      const [data, playlistData] = await Promise.all([
        getSongs(),
        getPlaylists(),
      ]);
      setSongs(data);
      setPlaylists(playlistData);
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

  const handleAddToPlaylist = async (playlistId, songId) => {
    try {
      await addSongToPlaylist(playlistId, songId);
      setOpenMenuSongId(null);
      setError("");
    } catch (err) {
      console.error("Failed to add song to playlist:", err);
      setError("Could not add the song to that playlist.");
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);

    return `${minutes}:${String(remainingSeconds).padStart(2, "0")}`;
  };

  if (loading) {
    return <div className="library-message">Loading your library...</div>;
  }

  if (error && songs.length === 0) {
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

      {error && <div className="playlist-error library-error">{error}</div>}

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

              <div className="song-actions">
                <div className="playlist-menu-wrap">
                  <button
                    className="add-playlist-button"
                    onClick={() =>
                      setOpenMenuSongId(
                        openMenuSongId === song.id ? null : song.id,
                      )
                    }
                    title="Add to playlist"
                    disabled={playlists.length === 0}
                  >
                    <ListPlus size={17} />
                  </button>
                  {openMenuSongId === song.id && (
                    <div className="playlist-menu">
                      {playlists.map((playlist) => (
                        <button
                          key={playlist.id}
                          onClick={() =>
                            handleAddToPlaylist(playlist.id, song.id)
                          }
                        >
                          {playlist.name}
                        </button>
                      ))}
                    </div>
                  )}
                </div>

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
            </div>
          ))}
        </div>
      )}
    </section>
  );
}

export default Home;
