import axios from "../AxiosInstance";

// Ambil semua mata kuliah
export const getAllMataKuliah = () => axios.get("/mata-kuliah");

// Ambil satu mata kuliah
export const getMataKuliah = (id) => axios.get(`/mata-kuliah/${id}`);

// Tambah mata kuliah
export const storeMataKuliah = (data) => axios.post("/mata-kuliah", data);

// Update mata kuliah
export const updateMataKuliah = (id, data) => axios.put(`/mata-kuliah/${id}`, data);

// Hapus mata kuliah
export const deleteMataKuliah = (id) => axios.delete(`/mata-kuliah/${id}`);
