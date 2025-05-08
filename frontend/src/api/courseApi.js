// src/api/courseApi.js
import axiosClient from "./axiosClient";

const courseApi = {
  // Lấy danh sách môn học
  getCourses: () => axiosClient.get("/courses"),

  // Lấy chi tiết môn học
  getCourseDetail: (id) => axiosClient.get(`/courses/${id}`),

  // Tạo mới môn học
  createCourse: (data) => axiosClient.post("/courses", data),

  // Cập nhật môn học
  updateCourse: (id, data) => axiosClient.put(`/courses/${id}`, data),

  // Cập nhật trạng thái môn học (active/inactive)
  updateStatus: (id, status) =>
    axiosClient.put(`/courses/${id}/status/${status}`),

  // Xóa môn học
  deleteCourse: (id) => axiosClient.delete(`/courses/${id}`),

  // Lấy thông tin chi tiết học môn (dành cho học viên)
  getLearningDetail: (id) => axiosClient.get(`/courses/learningDetail/${id}`),
};

export default courseApi;
