import { useEffect, useRef, useState } from "react";
import { ChevronRight, Heart, ListPlus, MoreVertical } from "lucide-react";

function DotMenu({ song, playlists = [], onToggleFavorite, onAddToPlaylist }) {
  const [isOpen, setIsOpen] = useState(false);
  const [showPlaylists, setShowPlaylists] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setIsOpen(false);
        setShowPlaylists(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const closeMenu = () => {
    setIsOpen(false);
    setShowPlaylists(false);
  };

  return (
    <div className="dot-menu" ref={menuRef}>
      <button
        className="dot-menu-trigger"
        onClick={() => {
          setIsOpen((open) => !open);
          setShowPlaylists(false);
        }}
        aria-label={`More options for ${song.title}`}
        aria-expanded={isOpen}
      >
        <MoreVertical size={20} />
      </button>

      {isOpen && (
        <div className="dot-menu-dropdown">
          <button
            className={`dot-menu-option ${
              song.is_favorite ? "favorite-active" : ""
            }`}
            onClick={() => {
              onToggleFavorite(song.id, Boolean(song.is_favorite));
              closeMenu();
            }}
          >
            <Heart
              size={16}
              fill={song.is_favorite ? "currentColor" : "none"}
            />
            <span>
              {song.is_favorite ? "Remove from favorites" : "Add to favorites"}
            </span>
          </button>

          <div className="dot-submenu-wrap">
            <button
              className="dot-menu-option"
              onClick={() => setShowPlaylists((open) => !open)}
              aria-expanded={showPlaylists}
            >
              <ListPlus size={16} />
              <span>Add to playlist</span>
              <ChevronRight className="dot-submenu-chevron" size={15} />
            </button>

            {showPlaylists && (
              <div className="dot-submenu">
                {playlists.length === 0 ? (
                  <span className="dot-submenu-empty">No playlists yet</span>
                ) : (
                  playlists.map((playlist) => (
                    <button
                      className="dot-submenu-option"
                      key={playlist.id}
                      onClick={() => {
                        onAddToPlaylist(playlist.id, song.id);
                        closeMenu();
                      }}
                    >
                      {playlist.name}
                    </button>
                  ))
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default DotMenu;
