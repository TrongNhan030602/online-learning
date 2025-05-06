// src/api/studentTrainingApi.js
import axiosClient from "./axiosClient";

const studentTrainingApi = {
  // Lấy danh sách chương trình đào tạo mà học viên đang tham gia
  getStudentPrograms: () => axiosClient.get("/student/training-programs"),

  // Lấy chi tiết chương trình đào tạo
  getProgramDetail: (id) =>
    axiosClient.get(`/student/training-programs/${id}/detail`),

  // Lấy chi tiết học môn (API chi tiết môn học)
  getCourseLearningDetail: (courseId) =>
    axiosClient.get(`/student/courses/${courseId}/learning`),
};

export default studentTrainingApi;
