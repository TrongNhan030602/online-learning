// src/api/courseApi.js
import axiosClient from "./axiosClient";

const courseApi = {
  getCourses: () => axiosClient.get("/courses"),
  getCourseDetail: (id) => axiosClient.get(`/courses/${id}`),
  createCourse: (data) =>
    axiosClient.post("/courses", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),
  updateCourse: (id, data) => axiosClient.put(`/courses/${id}`, data),
  updateCourseImage: (id, imageFile) => {
    const formData = new FormData();
    formData.append("image_url", imageFile);

    return axiosClient.post(`/courses/${id}/update-image`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },
  deleteCourse: (id) => axiosClient.delete(`/courses/${id}`),
};

export default courseApi;
