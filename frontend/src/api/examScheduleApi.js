import axiosClient from "./axiosClient";

const examScheduleApi = {
  // ✅ Lấy tất cả lịch thi (có thể lọc theo các tham số)
  getAllExamSchedules: (filters) =>
    axiosClient.get("/exam-schedules", { params: filters }),

  // ✅ Lấy chi tiết lịch thi theo ID
  getExamScheduleById: (id) => axiosClient.get(`/exam-schedules/${id}`),

  // ✅ Tạo lịch thi mới
  createExamSchedule: (data) => axiosClient.post("/exam-schedules", data),

  // ✅ Cập nhật lịch thi
  updateExamSchedule: (id, data) =>
    axiosClient.put(`/exam-schedules/${id}`, data),

  // ✅ Xóa lịch thi
  deleteExamSchedule: (id) => axiosClient.delete(`/exam-schedules/${id}`),

  // ✅ Lịch thi cho học viên
  getStudentSchedules: (studentId) =>
    axiosClient.get(`/exam-schedules/student/${studentId}`),

  // ✅ Lịch thi sắp tới cho học viên
  getUpcomingSchedules: (studentId) =>
    axiosClient.get(`/exam-schedules/student/${studentId}/upcoming`),

  // ✅ Lịch thi cho môn học cụ thể của học viên
  getCourseSchedule: (studentId, courseId) =>
    axiosClient.get(`/exam-schedules/student/${studentId}/course/${courseId}`),

  // ✅ Lịch thi lại cho học viên
  getRetakeSchedule: (studentId, courseId) =>
    axiosClient.get(`/exam-schedules/student/${studentId}/retake/${courseId}`),

  // ✅ Lịch thi cho học viên hiện tại (đăng nhập)
  getMySchedules: () => axiosClient.get("/exam-schedules/me/schedules"),
};

export default examScheduleApi;
