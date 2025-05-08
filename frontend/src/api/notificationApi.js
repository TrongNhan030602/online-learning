import axiosClient from "./axiosClient";

const notificationApi = {
  getAll: () => axiosClient.get("/notifications"), // Lấy danh sách tất cả thông báo
  create: (data) => axiosClient.post("/notifications", data), // Tạo thông báo mới
  markAsRead: (notificationId) =>
    axiosClient.patch(`/notifications/${notificationId}/read`), // Đánh dấu thông báo là đã đọc
  getStatistics: () => axiosClient.get("/notifications/statistics"), // Lấy thống kê thông báo
  delete: (id) => axiosClient.delete(`/notifications/${id}`), // Xóa thông báo
  getByTrainingProgram: (trainingProgramId) =>
    axiosClient.get(`/notifications/training-program/${trainingProgramId}`), // Lấy thông báo theo chương trình đào tạo
};

export default notificationApi;
