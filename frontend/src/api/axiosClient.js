import axios from "axios";

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:8000/api",
  headers: {
    "Content-Type": "application/json",
  },
});

axiosClient.interceptors.request.use((config) => {
  const tokenData = localStorage.getItem("token");
  if (tokenData) {
    let token;
    try {
      const parsed = tokenData;
      token = parsed.access_token || tokenData;
    } catch (error) {
      token = tokenData;
      console.log(error);
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login"; // Redirect nếu token hết hạn
    }
    return Promise.reject(error);
  }
);

export default axiosClient;
