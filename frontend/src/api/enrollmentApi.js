import axiosClient from "./axiosClient";

const enrollmentApi = {
  enroll: (data) => axiosClient.post("/enrollments/enroll", data), // Ghi danh học viên vào lớp
  getByClassroom: (classroomId) =>
    axiosClient.get(`/enrollments/by-classroom/${classroomId}`), // Lấy danh sách học viên trong lớp
  getByStudent: (userId) =>
    axiosClient.get(`/enrollments/by-student/${userId}`), // Lấy danh sách lớp của học viên
  approve: (id) => axiosClient.put(`/enrollments/approve/${id}`), // Duyệt ghi danh học viên (hiện chưa dùng)
  reject: (id) => axiosClient.put(`/enrollments/reject/${id}`), // Từ chối ghi danh học viên
  remove: (id) => axiosClient.delete(`/enrollments/${id}`), // Xóa ghi danh
};

export default enrollmentApi;
