import { useState } from "react";

import Home from "./pages/Home";
import Player from "./components/Player";
import { getSongStreamUrl } from "./services/api";

import "./App.css";

function App() {
  const [songs, setSongs] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);

  const handleSelectTrack = (song) => {
    setCurrentTrack({
      ...song,
      streamUrl: getSongStreamUrl(song.id),
    });
  };

  return (
    <div className="app">
      <aside className="sidebar">
        <h2 className="app-logo">MusicPlayer</h2>

        <nav>
          <button className="nav-item active">Library</button>

          <button className="nav-item">Playlists</button>

          <button className="nav-item">Favorites</button>
        </nav>
      </aside>

      <main className="main-content">
        <Home onSelectTrack={handleSelectTrack} onSongsLoaded={setSongs} />
      </main>

      <Player
        currentTrack={currentTrack}
        songs={songs}
        onSelectTrack={handleSelectTrack}
      />
    </div>
  );
}

export default App;
