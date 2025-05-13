import axiosClient from "./axiosClient";

const sessionApi = {
  // ✅ Lấy danh sách buổi học
  getAll: () => axiosClient.get("/course-sessions"),

  // ✅ Lấy chi tiết 1 buổi học
  getById: (id) => axiosClient.get(`/course-sessions/${id}`),

  // ✅ Tạo buổi học mới
  createSession: (data) => axiosClient.post("/course-sessions", data),

  // ✅ Cập nhật buổi học
  update: (id, data) => axiosClient.put(`/course-sessions/${id}`, data),

  // ✅ Xóa buổi học
  remove: (id) => axiosClient.delete(`/course-sessions/${id}`),
};

export default sessionApi;
