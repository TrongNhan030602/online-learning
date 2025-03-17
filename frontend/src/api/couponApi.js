import axiosClient from "./axiosClient";

const couponApi = {
  getCoupons: () => axiosClient.get("/coupons"), // ✅ Lấy danh sách mã giảm giá
  getCouponById: (id) => axiosClient.get(`/coupons/${id}`), // ✅ Lấy chi tiết mã giảm giá
  createCoupon: (data) => axiosClient.post("/coupons", data), // ✅ Tạo mới mã giảm giá
  updateCoupon: (id, data) => axiosClient.put(`/coupons/${id}`, data), // ✅ Cập nhật mã giảm giá
  deleteCoupon: (id) => axiosClient.delete(`/coupons/${id}`), // ✅ Xóa mã giảm giá

  getActiveCoupons: () => axiosClient.get("/coupons/active"), // ✅ Lấy danh sách mã còn hạn
  applyCoupon: (code) => axiosClient.get(`/coupons/apply/${code}`), // ✅ Kiểm tra & áp dụng mã
  resetUsage: (id) => axiosClient.post(`/coupons/reset-usage/${id}`), // ✅ Reset số lần sử dụng
};

export default couponApi;
