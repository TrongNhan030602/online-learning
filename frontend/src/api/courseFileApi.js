import axiosClient from "./axiosClient";

const courseFileApi = {
  getFiles: (courseId) => axiosClient.get(`/courses/${courseId}/files`),
  uploadFile: (courseId, formData) =>
    axiosClient.post(`/courses/${courseId}/files`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  deleteFile: (courseId, fileId) =>
    axiosClient.delete(`/courses/${courseId}/files/${fileId}`),
};

export default courseFileApi;
