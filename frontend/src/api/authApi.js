import axiosClient from "./axiosClient";

const authApi = {
  login: (data) => axiosClient.post("/auth/login", data),
  register: (data) => axiosClient.post("/auth/register", data),
  logout: () => axiosClient.post("/auth/logout"),
  refresh: () => axiosClient.post("/auth/refresh"),
  getUser: () => axiosClient.get("/auth/me"),
  // Gửi email khôi phục mật khẩu (POST /auth/reset-password)
  sendResetPasswordEmail: (email) =>
    axiosClient.post("/auth/reset-password", { email }),
  // Đổi mật khẩu (PUT /auth/reset-password/{token})
  resetPassword: (token, password, password_confirmation) =>
    axiosClient.put(`/auth/reset-password/${token}`, {
      password,
      password_confirmation,
    }),

  getPersonalInfo: () => axiosClient.get("/auth/personal-info"),
};

export default authApi;
