import axiosClient from "./axiosClient";

const materialApi = {
  // Lấy danh sách tài liệu của bài học
  getMaterialsByLessonId: (lessonId) =>
    axiosClient.get(`/materials/lesson/${lessonId}`),

  // Lấy thông tin chi tiết tài liệu
  getMaterialById: (id) => axiosClient.get(`/materials/${id}`),

  // Tạo tài liệu mới
  createMaterial: (data) =>
    axiosClient.post("/materials", data, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Cập nhật tài liệu (khi type ===  link)
  updateMaterial: (id, data) =>
    axiosClient.put(`/materials/${id}`, data, {
      headers: {
        "Content-Type": "application/json",
      },
    }),

  // Cập nhật tài liệu với file (multipart/form-data <==> type == file)
  updateMaterialWithFile: (id, formData) =>
    axiosClient.post(`/materials/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Xóa tài liệu
  deleteMaterial: (id) => axiosClient.delete(`/materials/${id}`),
};

export default materialApi;
