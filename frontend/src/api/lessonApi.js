import axiosClient from "./axiosClient";

const lessonApi = {
  getLessons: (filters) => axiosClient.get("/lessons", { params: filters }),
  getLessonDetail: (id) => axiosClient.get(`/lessons/${id}`),
  createLesson: (data) =>
    axiosClient.post("/lessons", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateLesson: (id, data) => axiosClient.put(`/lessons/${id}`, data),
  deleteLesson: (id) => axiosClient.delete(`/lessons/${id}`),
  assignFiles: (lessonId, fileIds) =>
    axiosClient.post(`/lessons/${lessonId}/selected-files`, {
      file_ids: fileIds,
    }),
};

export default lessonApi;
