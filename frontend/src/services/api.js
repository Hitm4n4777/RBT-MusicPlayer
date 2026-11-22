
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

export default api;
