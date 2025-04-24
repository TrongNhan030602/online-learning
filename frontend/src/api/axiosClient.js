import axios from "axios";

const axiosClient = axios.create({
  // baseURL:
  //   import.meta.env.VITE_BACKEND_URL ||
  //   "https://elearning-api.design24.edu.vn/api",
  baseURL: import.meta.env.VITE_BACKEND_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor để tự động gán token
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      console.warn("Token hết hạn hoặc không hợp lệ, đăng xuất...");
      localStorage.removeItem("token");
      window.location.href = "/"; // Chuyển hướng về trang chủ
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
