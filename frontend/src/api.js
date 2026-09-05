import axios from "axios";

const api = axios.create({
  baseURL: "https://library-management-system-efu0.onrender.com",
});

// Ye endpoints public hain — inme token bhejne ki zaroorat nahi
const PUBLIC_ENDPOINTS = [
  "/api/user_login/",
  "/api/user_signup/",
  "/api/admin/login/",
  "/api/public_stats/",
  "/api/user/books/",
];

api.interceptors.request.use((config) => {
  const isPublic = PUBLIC_ENDPOINTS.some((url) => config.url.includes(url));

  if (!isPublic) {
    const token = localStorage.getItem("access_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default api;