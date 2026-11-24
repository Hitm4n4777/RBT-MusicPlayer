import axios from "axios";

const api = axios.create({
    baseURL: "http://127.0.0.1:8000/api",
});

// GET ALL SONGS
export const getSongs = async () => {
    const response = await api.get("/songs/");
    return response.data;
};

// GET SONG STREAM URL
export const getSongStreamUrl = (songId) => {
    return `http://127.0.0.1:8000/api/songs/${songId}/stream`;
};

// UPLOAD SONGS
export const uploadSong = async (file, onUploadProgress) => {
    const formData = new FormData();
    formData.append("file", file);

    const response = await api.post("/songs/upload", formData, {
        onUploadProgress,
    });

    return response.data;
};

// DELETE SONG
export const deleteSong = async (songId) => {
    const response = await api.delete(`/songs/${songId}`);
    return response.data;
};

// GET ALL PLAYLISTS
export const getPlaylists = async () => {
    const response = await api.get("/playlists/");
    return response.data;
};

// GET PLAYLIST DETAILS
export const getPlaylist = async (playlistId) => {
    const response = await api.get(`/playlists/${playlistId}`);
    return response.data;
};

// CREATE PLAYLIST
export const createPlaylist = async (name, description = "") => {
    const response = await api.post("/playlists/", { name, description });
    return response.data;
};

// ADD SONG TO PLAYLIST
export const addSongToPlaylist = async (playlistId, songId) => {
    const response = await api.post(`/playlists/${playlistId}/songs/${songId}`);
    return response.data;
};

// REMOVE SONG FROM PLAYLIST
export const removeSongFromPlaylist = async (playlistId, songId) => {
    const response = await api.delete(`/playlists/${playlistId}/songs/${songId}`);
    return response.data;
};

// DELETE PLAYLIST
export const deletePlaylist = async (playlistId) => {
    const response = await api.delete(`/playlists/${playlistId}`);
    return response.data;
};

// UPDATE FAVORITE STATUS
export const updateFavorite = async (songId, isFavorite) => {
    const response = await api.patch(`/favorites/${songId}`, {
        is_favorite: isFavorite,
    });
    return response.data;
};

// GET FAVORITE SONGS
export const getFavorites = async () => {
    const response = await api.get("/favorites/");
    return response.data;
};

export default api;
