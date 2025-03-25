import axiosClient from "./axiosClient";

const userApi = {
  getUsers: (params) => axiosClient.get("/users", { params }),
  getUserDetail: (id) => axiosClient.get(`/users/${id}`),
  createUser: (data) => axiosClient.post("/users", data),
  updateUser: (id, data) => axiosClient.put(`/users/${id}`, data),
  deleteUser: (id) => axiosClient.delete(`/users/${id}`),
  resetPassword: (id) => axiosClient.post(`/users/${id}/reset-password`),
};

export default userApi;
