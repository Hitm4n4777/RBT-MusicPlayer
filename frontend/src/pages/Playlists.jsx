import { useEffect, useState } from "react";
import {
  ListMusic,
  Music2,
  Play,
  Plus,
  RefreshCw,
  Trash2,
  X,
} from "lucide-react";
import {
  createPlaylist,
  deletePlaylist,
  getPlaylist,
  getPlaylists,
  removeSongFromPlaylist,
} from "../services/api";

function Playlists({ onSelectTrack, allSongs = [] }) {
  const [playlists, setPlaylists] = useState([]);
  const [selectedPlaylist, setSelectedPlaylist] = useState(null);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadPlaylists = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await getPlaylists();
      setPlaylists(data);
    } catch (err) {
      console.error("Failed to load playlists:", err);
      setError("Could not load your playlists.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPlaylists();
  }, []);

  const openPlaylist = async (playlistId) => {
    try {
      setError("");
      const data = await getPlaylist(playlistId);
      setSelectedPlaylist(data);
    } catch (err) {
      console.error("Failed to load playlist:", err);
      setError("Could not load that playlist.");
    }
  };

  const handleCreate = async (event) => {
    event.preventDefault();
    if (!name.trim()) return;

    try {
      const result = await createPlaylist(name, description);
      setName("");
      setDescription("");
      await loadPlaylists();
      await openPlaylist(result.playlist.id);
    } catch (err) {
      console.error("Failed to create playlist:", err);
      setError("Could not create the playlist.");
    }
  };

  const handleDelete = async (playlistId) => {
    try {
      await deletePlaylist(playlistId);
      if (selectedPlaylist?.id === playlistId) setSelectedPlaylist(null);
      await loadPlaylists();
    } catch (err) {
      console.error("Failed to delete playlist:", err);
      setError("Could not delete the playlist.");
    }
  };

  const handleRemoveSong = async (songId) => {
    if (!selectedPlaylist) return;

    try {
      await removeSongFromPlaylist(selectedPlaylist.id, songId);
      await openPlaylist(selectedPlaylist.id);
      await loadPlaylists();
    } catch (err) {
      console.error("Failed to remove song:", err);
      setError("Could not remove the song.");
    }
  };

  const formatDuration = (seconds) => {
    const minutes = Math.floor((seconds || 0) / 60);
    const remaining = Math.floor((seconds || 0) % 60);
    return `${minutes}:${String(remaining).padStart(2, "0")}`;
  };

  if (loading)
    return <div className="library-message">Loading playlists...</div>;

  return (
    <section className="playlists-page">
      <div className="library-header">
        <div>
          <h1>Playlists</h1>
          <p>{playlists.length} playlists</p>
        </div>
        <button onClick={loadPlaylists} title="Refresh playlists">
          <RefreshCw size={18} />
        </button>
      </div>

      {error && <div className="playlist-error">{error}</div>}

      <form className="playlist-create" onSubmit={handleCreate}>
        <div className="playlist-create-icon">
          <Plus size={20} />
        </div>
        <input
          value={name}
          onChange={(event) => setName(event.target.value)}
          placeholder="Playlist name"
          aria-label="Playlist name"
        />
        <input
          value={description}
          onChange={(event) => setDescription(event.target.value)}
          placeholder="Description (optional)"
          aria-label="Playlist description"
        />
        <button type="submit" disabled={!name.trim()}>
          Create
        </button>
      </form>

      <div className="playlist-layout">
        <div className="playlist-grid">
          {playlists.length === 0 ? (
            <div className="empty-library">
              <ListMusic size={48} />
              <h2>No playlists yet</h2>
              <p>Create one above to get started.</p>
            </div>
          ) : (
            playlists.map((playlist) => (
              <article
                className={`playlist-card ${selectedPlaylist?.id === playlist.id ? "active" : ""}`}
                key={playlist.id}
                onClick={() => openPlaylist(playlist.id)}
              >
                <div className="playlist-card-icon">
                  <ListMusic size={24} />
                </div>
                <div className="playlist-card-info">
                  <h3>{playlist.name}</h3>
                  <p>
                    {playlist.description || `${playlist.song_count} songs`}
                  </p>
                </div>
                <button
                  className="playlist-delete"
                  onClick={(event) => {
                    event.stopPropagation();
                    handleDelete(playlist.id);
                  }}
                  title="Delete playlist"
                >
                  <Trash2 size={16} />
                </button>
              </article>
            ))
          )}
        </div>

        {selectedPlaylist && (
          <aside className="playlist-detail">
            <div className="playlist-detail-header">
              <div>
                <h2>{selectedPlaylist.name}</h2>
                <p>{selectedPlaylist.songs.length} songs</p>
              </div>
              <button
                onClick={() => setSelectedPlaylist(null)}
                title="Close playlist"
              >
                <X size={18} />
              </button>
            </div>

            {selectedPlaylist.songs.length === 0 ? (
              <div className="playlist-detail-empty">
                <Music2 size={36} />
                <p>Add songs from your library.</p>
              </div>
            ) : (
              <div className="playlist-songs">
                {selectedPlaylist.songs.map((song) => {
                  const source =
                    allSongs.find((item) => item.id === song.id) || song;
                  return (
                    <div className="playlist-song" key={song.id}>
                      <button
                        className="playlist-song-play"
                        onClick={() => onSelectTrack(source)}
                        title="Play song"
                      >
                        <Play size={15} />
                      </button>
                      <div className="playlist-song-info">
                        <strong>{song.title}</strong>
                        <span>{song.artist || "Unknown Artist"}</span>
                      </div>
                      <span className="playlist-song-duration">
                        {formatDuration(song.duration)}
                      </span>
                      <button
                        className="playlist-song-remove"
                        onClick={() => handleRemoveSong(song.id)}
                        title="Remove from playlist"
                      >
                        <X size={15} />
                      </button>
                    </div>
                  );
                })}
              </div>
            )}
          </aside>
        )}
      </div>
    </section>
  );
}

export default Playlists;
