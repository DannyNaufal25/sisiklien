import axios from "../AxiosInstance";

// Ambil semua data chart
export const getAllChartData = () => axios.get("/chart");
