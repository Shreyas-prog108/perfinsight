import axios from "axios";

const apiOrigin =
  typeof import.meta.env.VITE_API_URL === "string"
    ? import.meta.env.VITE_API_URL.trim().replace(/\/$/, "")
    : "";
const apiBaseURL = apiOrigin ? `${apiOrigin}/api` : "/api";

const api = axios.create({ baseURL: apiBaseURL });

api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("perfinsight_auth");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export async function loginRequest(data) {
  const res = await axios.post(`${apiBaseURL}/auth/login`, data);
  return res.data;
}
