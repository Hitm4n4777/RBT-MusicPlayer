import { useState } from "react";

import Home from "./pages/Home";
import Player from "./components/Player";
import SoftAurora from "./components/SoftAurora";
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
      {/* GLOBAL AURORA BACKGROUND */}
      <div className="app-aurora">
        <SoftAurora
          speed={0.6}
          scale={1.5}
          brightness={0.7}
          color1="#f7f7f7"
          color2="#e100ff"
          bandHeight={0.56}
          bandSpread={1}
          enableMouseInteraction={false}
          mouseInfluence={0.25}
        />
      </div>

      {/* SIDEBAR */}
      <aside className="sidebar">
        <h2 className="app-logo">MusicPlayer</h2>

        <nav>
          <button className="nav-item active">Library</button>
          <button className="nav-item">Playlists</button>
          <button className="nav-item">Favorites</button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <div className="main-content-inner">
          <Home onSelectTrack={handleSelectTrack} onSongsLoaded={setSongs} />
        </div>
      </main>

      {/* MUSIC PLAYER */}
      <Player
        currentTrack={currentTrack}
        songs={songs}
        onSelectTrack={handleSelectTrack}
      />
    </div>
  );
}

export default App;
