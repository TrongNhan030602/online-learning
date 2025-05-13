import axiosClient from "./axiosClient";

const lessonApi = {
  // Lấy danh sách bài học theo buổi học
  getLessonsBySession: (courseSessionId) => {
    return axiosClient.get(`/lessons/course-session/${courseSessionId}`);
  },

  // Lấy chi tiết bài học theo ID
  getLessonById: (id) => {
    return axiosClient.get(`/lessons/${id}`);
  },

  // Tạo mới bài học
  createLesson: (data) => {
    return axiosClient.post("/lessons", data);
  },

  // Cập nhật bài học
  updateLesson: (id, data) => {
    return axiosClient.put(`/lessons/${id}`, data);
  },

  // Xóa bài học
  deleteLesson: (id) => {
    return axiosClient.delete(`/lessons/${id}`);
  },
};

export default lessonApi;
