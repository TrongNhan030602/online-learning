// src/api/studentTrainingProgramApi.js
import axiosClient from "./axiosClient";

const studentTrainingProgramApi = {
  // Đăng ký học viên vào chương trình đào tạo
  registerStudentToProgram: (data) =>
    axiosClient.post("/student-training-programs", data),

  // Lấy danh sách học viên trong chương trình đào tạo
  getStudentsInProgram: (trainingProgramId) =>
    axiosClient.get(
      `/student-training-programs/training-programs/${trainingProgramId}/students`
    ),
  //  Lấy danh sách học viên không có trong chương trình đào tạo
  getStudentsNotInProgram: (trainingProgramId) =>
    axiosClient.get(
      `/student-training-programs/training-programs/${trainingProgramId}/students/not-registered`
    ),

  // Lấy thông tin chi tiết học viên trong chương trình đào tạo
  getStudentInfo: (id) => axiosClient.get(`/student-training-programs/${id}`),

  // Xóa học viên khỏi chương trình đào tạo
  removeStudentFromProgram: (studentId, trainingProgramId) =>
    axiosClient.delete(
      `/student-training-programs/${studentId}/${trainingProgramId}`
    ),

  // Lấy chương trình đào tạo gần nhất của học viên
  getPreviousProgram: (studentId) =>
    axiosClient.get(`/student-training-programs/${studentId}/previous`),
};

export default studentTrainingProgramApi;
