import axiosClient from "./axiosClient";

const sessionApi = {
  // Lấy danh sách buổi học của lớp học
  getSessionsByClassroom: (classroomId) =>
    axiosClient.get(`/classrooms/${classroomId}/sessions`),

  // Thêm buổi học mới vào lớp học
  createSession: (classroomId, data) =>
    axiosClient.post(`/classrooms/${classroomId}/sessions`, data),

  // Cập nhật buổi học
  updateSession: (classroomId, sessionId, data) =>
    axiosClient.put(`/classrooms/${classroomId}/sessions/${sessionId}`, data),

  // Xóa buổi học
  deleteSession: (classroomId, sessionId) =>
    axiosClient.delete(`/classrooms/${classroomId}/sessions/${sessionId}`),
  // Lấy danh sách bài học chưa có cho buổi học
  getAvailableLessons: (sessionId) =>
    axiosClient.get(`/classrooms/sessions/${sessionId}/available-lessons`),

  // Lấy danh sách bài học đang có cho buổi học
  getCurrentLessons: (sessionId) =>
    axiosClient.get(`/classrooms/sessions/${sessionId}/current-lessons`),
  // Thêm bài học vào buổi học
  addLessonsToSession: (sessionId, lessonIds) =>
    axiosClient.post(`/classrooms/sessions/${sessionId}/lessons`, {
      lesson_ids: lessonIds,
    }),

  // Xóa bài học khỏi buổi học
  removeLessonFromSession: (sessionId, lessonId) =>
    axiosClient.delete(`/classrooms/sessions/${sessionId}/lessons/${lessonId}`),
};

export default sessionApi;
