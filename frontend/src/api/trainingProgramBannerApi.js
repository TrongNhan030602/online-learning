import axiosClient from "./axiosClient";

const trainingProgramBannerApi = {
  // Lấy danh sách banner theo chương trình đào tạo
  getByProgramId: (programId) =>
    axiosClient.get(`/training-program-banners/${programId}`),

  // Thêm banner mới (FormData gồm: training_program_id, title, description, image)
  create: (formData) =>
    axiosClient.post("/training-program-banners", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Cập nhật banner (FormData gồm các field cần cập nhật, có thể có image mới)
  update: (id, formData) =>
    axiosClient.post(`/training-program-banners/${id}`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    }),

  // Xoá banner theo ID
  delete: (id) => axiosClient.delete(`/training-program-banners/${id}`),
};

export default trainingProgramBannerApi;
