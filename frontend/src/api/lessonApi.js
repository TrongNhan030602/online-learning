import axiosClient from "./axiosClient";

const lessonApi = {
  getLessons: (courseId) =>
    axiosClient.get("/lessons", { params: { course_id: courseId } }),
  getSessionsByClass: (classId) =>
    axiosClient.get(`/classrooms/${classId}/sessions`),
  getLessonDetail: (id) => axiosClient.get(`/lessons/${id}`),
  createLesson: (data) =>
    axiosClient.post("/lessons", data, {
      headers: { "Content-Type": "application/json" },
    }),
  updateLesson: (id, data) => axiosClient.put(`/lessons/${id}`, data),
  deleteLesson: (id) => axiosClient.delete(`/lessons/${id}`),
  assignFiles: (lessonId, fileIds) =>
    axiosClient.post(`/lessons/${lessonId}/selected-files`, {
      file_ids: fileIds,
    }),
  // API để thêm tài liệu vào bài học
  addDocuments: (lessonId, documents) =>
    axiosClient.post(`/lessons/${lessonId}/documents`, documents, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  // API xóa tài liệu của bài học
  deleteDocument: (lessonId, documentId) =>
    axiosClient.delete(`/lessons/${lessonId}/documents/${documentId}`),
};

export default lessonApi;
