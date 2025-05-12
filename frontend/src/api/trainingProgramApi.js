import axiosClient from "./axiosClient";

const trainingProgramApi = {
  getAll: () => axiosClient.get("/training-programs"), // Lấy tất cả chương trình đào tạo
  getById: (id) => axiosClient.get(`/training-programs/${id}`), // Lấy chi tiết chương trình đào tạo theo id
  filterByLevel: (level) =>
    axiosClient.get(`/training-programs/filter/${level}`), // Lọc chương trình theo level
  create: (data) => axiosClient.post("/training-programs", data), // Tạo mới chương trình
  update: (id, data) => axiosClient.put(`/training-programs/${id}`, data), // Cập nhật chương trình
  delete: (id) => axiosClient.delete(`/training-programs/${id}`), // Xoá chương trình

  // Lấy danh sách học kỳ của chương trình đào tạo
  getSemesters: (id) => axiosClient.get(`/training-programs/${id}/semesters`),

  // Lấy danh sách học viên chưa nhập điểm rèn luyện cho học kỳ cụ thể
  getStudentsWithoutScores: (id, semesterId) =>
    axiosClient.get(
      `/training-programs/${id}/semesters/${semesterId}/students-without-scores`
    ),
};

export default trainingProgramApi;
