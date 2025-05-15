import axiosClient from "./axiosClient";

const userApi = {
  getUsers: (params) => axiosClient.get("/users", { params }),
  getUserDetail: (id) => axiosClient.get(`/users/${id}`),
  createUser: (data) => axiosClient.post("/users", data),
  updateUser: (id, data) => axiosClient.put(`/users/${id}`, data),
  deleteUser: (id) => axiosClient.delete(`/users/${id}`),
  resetPassword: (id, data) =>
    axiosClient.post(`/users/${id}/reset-password`, data),

  // Lấy người dùng theo vai trò
  getUsersByRole: (role) => axiosClient.get(`/users/role/${role}`),

  // Lấy chi tiết người dùng theo ID
  getUserDetailById: (id) => axiosClient.get(`/users/${id}/detail`),
};

export default userApi;
