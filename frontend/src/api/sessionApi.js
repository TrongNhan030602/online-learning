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

  // Thêm bài học vào buổi học
  addLessonToSession: (classroomId, sessionId, data) =>
    axiosClient.post(
      `/classrooms/${classroomId}/sessions/${sessionId}/lessons`,
      data
    ),

  // Cập nhật bài học của buổi học
  updateLessonInSession: (classroomId, sessionId, data) =>
    axiosClient.put(
      `/classrooms/${classroomId}/sessions/${sessionId}/lessons`,
      data
    ),

  // Xóa bài học khỏi buổi học
  removeLessonFromSession: (classroomId, sessionId, lessonId) =>
    axiosClient.delete(
      `/classrooms/${classroomId}/sessions/${sessionId}/lessons/${lessonId}`
    ),
};

export default sessionApi;
