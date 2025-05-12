import axiosClient from "./axiosClient";

const disciplineScoreApi = {
  // Lấy danh sách điểm rèn luyện
  getDisciplineScores: () => axiosClient.get("/discipline-scores"),

  // Lấy chi tiết điểm rèn luyện
  getDisciplineScoreById: (id) => axiosClient.get(`/discipline-scores/${id}`),

  // Tạo mới điểm rèn luyện
  createDisciplineScore: (data) => axiosClient.post("/discipline-scores", data),

  // Cập nhật điểm rèn luyện
  updateDisciplineScore: (id, data) =>
    axiosClient.put(`/discipline-scores/${id}`, data),

  // Xóa điểm rèn luyện
  deleteDisciplineScore: (id) => axiosClient.delete(`/discipline-scores/${id}`),

  // Lấy điểm rèn luyện của học viên
  getDisciplineScoreByStudent: () =>
    axiosClient.get("/discipline-scores/student/points"),
};

export default disciplineScoreApi;
