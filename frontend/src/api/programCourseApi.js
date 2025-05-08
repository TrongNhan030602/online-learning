import axiosClient from "./axiosClient";

const programCourseApi = {
  // Lấy danh sách môn học chưa được gán vào chương trình đào tạo
  getAvailableCourses: (trainingProgramId) =>
    axiosClient.get(`/program-courses/available-courses/${trainingProgramId}`),

  // Thêm môn vào chương trình đào tạo
  assignCourses: (data) => axiosClient.post("/program-courses/assign", data),

  // Xóa môn học khỏi chương trình đào tạo
  deleteProgramCourse: (programCourseId) =>
    axiosClient.delete(`/program-courses/${programCourseId}`),
};

export default programCourseApi;
