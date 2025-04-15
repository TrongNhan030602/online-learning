import axiosClient from "./axiosClient";

const classApi = {
  // Lấy danh sách lớp học theo khóa học
  getClassesByCourse: (courseId) =>
    axiosClient.get(`/classes/by-course/${courseId}`),

  // Lấy danh sách tất cả lớp học
  getAllClasses: () => axiosClient.get("/classes"),

  // Lấy thông tin chi tiết lớp học theo ID
  getClassById: (id) => axiosClient.get(`/classes/${id}`),

  // Tạo lớp học mới
  createClass: (data) => axiosClient.post("/classes", data),

  // Cập nhật thông tin lớp học
  updateClass: (id, data) => axiosClient.put(`/classes/${id}`, data),

  // Xóa lớp học
  deleteClass: (id) => axiosClient.delete(`/classes/${id}`),
};

export default classApi;
