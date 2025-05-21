import axiosClient from "./axiosClient";

const reExamRegistrationApi = {
  // Lấy tất cả đăng ký thi lại
  getAll: (params) => axiosClient.get("/re-exam-registrations", { params }),

  // Lấy đăng ký thi lại theo ID
  getById: (id) => axiosClient.get(`/re-exam-registrations/${id}`),

  // Tạo mới đăng ký thi lại
  create: (data) => axiosClient.post("/re-exam-registrations", data),

  // Cập nhật đăng ký thi lại theo ID
  update: (id, data) => axiosClient.put(`/re-exam-registrations/${id}`, data),

  // Xóa đăng ký thi lại theo ID
  delete: (id) => axiosClient.delete(`/re-exam-registrations/${id}`),

  // Lấy đăng ký thi lại theo user
  getByUser: (userId) =>
    axiosClient.get(`/re-exam-registrations/user/${userId}`),

  // Lấy đăng ký thi lại theo trạng thái
  getByStatus: (status) =>
    axiosClient.get(`/re-exam-registrations/status/${status}`),

  // Thay đổi trạng thái đăng ký thi lại
  changeStatus: (id, status) =>
    axiosClient.patch(`/re-exam-registrations/${id}/status/${status}`),

  // Lấy đăng ký thi lại của người dùng hiện tại
  getMine: () => axiosClient.get("/re-exam-registrations/me"),
};

export default reExamRegistrationApi;
