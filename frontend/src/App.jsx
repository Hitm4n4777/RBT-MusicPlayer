import { useState } from "react";

import Home from "./pages/Home";
import Playlists from "./pages/Playlists";
import Player from "./components/Player";
import SoftAurora from "./components/SoftAurora";
import { getSongStreamUrl } from "./services/api";

import "./App.css";

function App() {
  const [songs, setSongs] = useState([]);
  const [currentTrack, setCurrentTrack] = useState(null);
  const [activeTab, setActiveTab] = useState("library");

  // ==========================================
  // TRACK SELECTION
  // ==========================================

  const handleSelectTrack = (song) => {
    setCurrentTrack({
      ...song,
      streamUrl: getSongStreamUrl(song.id),
    });
  };

  // ==========================================
  // NAVIGATION
  // ==========================================

  const renderPage = () => {
    switch (activeTab) {
      case "library":
        return (
          <Home onSelectTrack={handleSelectTrack} onSongsLoaded={setSongs} />
        );

      case "playlists":
        return <Playlists allSongs={songs} onSelectTrack={handleSelectTrack} />;

      case "favorites":
        return (
          <div className="page-placeholder">
            <h1>Favorites</h1>
            <p>Your favorite songs will appear here.</p>
          </div>
        );

      default:
        return null;
    }
  };

  // ==========================================
  // APP LAYOUT
  // ==========================================

  return (
    <div className="app">
      {/* GLOBAL AURORA BACKGROUND */}
      <div className="app-aurora">
        <SoftAurora
          speed={0.6}
          scale={1.5}
          brightness={0.9}
          color1="#f7f7f7"
          color2="#ff1cf4"
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
          <button
            className={`nav-item ${activeTab === "library" ? "active" : ""}`}
            onClick={() => setActiveTab("library")}
          >
            Library
          </button>

          <button
            className={`nav-item ${activeTab === "playlists" ? "active" : ""}`}
            onClick={() => setActiveTab("playlists")}
          >
            Playlists
          </button>

          <button
            className={`nav-item ${activeTab === "favorites" ? "active" : ""}`}
            onClick={() => setActiveTab("favorites")}
          >
            Favorites
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">
        <div className="main-content-inner">{renderPage()}</div>
      </main>

      {/* MUSIC PLAYER - PERSISTS BETWEEN TABS */}
      <Player
        currentTrack={currentTrack}
        songs={songs}
        onSelectTrack={handleSelectTrack}
      />
    </div>
  );
}

export default App;
