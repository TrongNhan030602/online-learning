import axiosClient from "./axiosClient";

const semesterApi = {
  // Lấy danh sách học kỳ
  getAllSemesters: () => axiosClient.get("/semesters"),

  // Lấy chi tiết học kỳ theo ID
  getSemesterById: (id) => axiosClient.get(`/semesters/${id}`),

  // Tạo học kỳ mới
  createSemester: (data) => axiosClient.post("/semesters", data),

  // Cập nhật học kỳ theo ID
  updateSemester: (id, data) => axiosClient.put(`/semesters/${id}`, data),

  // Xóa học kỳ theo ID
  deleteSemester: (id) => axiosClient.delete(`/semesters/${id}`),

  // Lấy danh sách môn học chưa được gán vào học kỳ trong CTĐT
  getCoursesNotInSemester: (trainingProgramId) =>
    axiosClient.get(
      `/training-programs/${trainingProgramId}/courses-not-in-semesters`
    ),

  // Gán môn học vào học kỳ
  addCoursesToSemester: (semesterId, courseIds) =>
    axiosClient.post(`/semesters/${semesterId}/add-courses`, {
      course_ids: courseIds,
    }),

  removeCoursesFromSemester: (semesterId, courseIds) =>
    axiosClient.post(`/semesters/${semesterId}/remove-courses`, {
      course_ids: courseIds,
    }),
};

export default semesterApi;
