// src/api/trainingProgramApi.js
import axiosClient from "./axiosClient";

const trainingProgramApi = {
  getAll: () => axiosClient.get("/training-program"), // Lấy tất cả chương trình đào tạo
  getById: (id) => axiosClient.get(`/training-program/${id}`), // Lấy chi tiết chương trình đào tạo theo id
  getByCourseId: (courseId) =>
    axiosClient.get(`/training-program/course/${courseId}`), // Lấy chương trình đào tạo theo course
  create: (data) => axiosClient.post("/training-program", data), // Tạo mới
  update: (id, data) => axiosClient.put(`/training-program/${id}`, data), // Cập nhật
  delete: (id) => axiosClient.delete(`/training-program/${id}`), // Xóa
};

export default trainingProgramApi;
