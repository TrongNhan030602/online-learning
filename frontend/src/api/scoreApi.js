import axiosClient from "./axiosClient";

const scoreApi = {
  // Lấy tất cả điểm (GET /scores)
  getAllScores: () => axiosClient.get("/scores"),

  // Tạo điểm mới
  createScore: (data) => axiosClient.post("/scores", data),

  // Cập nhật điểm theo ID (PUT hoặc PATCH)
  updateScore: (id, data) => axiosClient.put(`/scores/${id}`, data),

  // Xóa điểm theo ID
  deleteScore: (id) => axiosClient.delete(`/scores/${id}`),

  // Lấy bảng điểm của học viên theo studentId
  getScoresByStudent: (studentId) =>
    axiosClient.get(`/scores/student/${studentId}`),

  // Lấy bảng điểm của học viên đang đăng nhập
  getMyScores: () => axiosClient.get("/scores/me"),

  // Lấy bảng điểm của môn học theo courseId
  getScoresByCourse: (courseId) =>
    axiosClient.get(`/scores/course/${courseId}`),

  // Lấy bảng điểm của học viên theo học kỳ
  getScoresByStudentAndSemester: (studentId, semesterId) =>
    axiosClient.get(`/scores/student/${studentId}/semester/${semesterId}`),
};

export default scoreApi;
