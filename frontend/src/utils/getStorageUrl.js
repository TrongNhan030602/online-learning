// src/utils/getStorageUrl.js

export const getStorageUrl = (path) => {
  // Lấy URL backend từ biến môi trường, nếu không có thì dùng mặc định
  const baseUrl = import.meta.env.VITE_BACKEND_URL || "http://127.0.0.1:8000";

  return `${baseUrl.replace(/\/+$/, "")}/storage/${path}`;
};
