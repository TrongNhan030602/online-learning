import axiosClient from "./axiosClient";

const studentClassApi = {
  // ✅ API lấy danh sách lớp học mà học viên đã ghi danh
  getMyClasses: () => axiosClient.get("/student/my-classes"),

  // ✅ API lấy danh sách buổi học + bài học, video, tài liệu của lớp học cụ thể
  getSessionsWithLessons: (classroomId) =>
    axiosClient.get(`/student/my-classes/${classroomId}/sessions-with-lessons`),
};

export default studentClassApi;
