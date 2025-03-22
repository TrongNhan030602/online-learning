import { useState, useEffect, useCallback } from "react";
import couponApi from "../../../api/couponApi";
import CouponList from "../../../components/CouPons/CouponList";
import CouponModal from "../../../components/CouPons/CouponModal";
import ConfirmDialog from "../../../components/Common/ConfirmDialog";
import Loading from "../../../components/Common/Loading";
import { useToast } from "../../../hooks/useToast";
import "../../../styles/coupon/admin-coupons.css";

const AdminCoupons = () => {
  const [coupons, setCoupons] = useState([]);
  const [activeCoupons, setActiveCoupons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingCoupon, setEditingCoupon] = useState(null);
  const [showCouponModal, setShowCouponModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    couponId: null,
  });

  const { addToast } = useToast();

  // 🟢 Lấy danh sách mã giảm giá
  const fetchCoupons = useCallback(() => {
    setLoading(true);
    couponApi
      .getCoupons()
      .then((res) => {
        setCoupons(res.data);
      })
      .catch((err) => console.error("Lỗi khi lấy danh sách mã giảm giá:", err))
      .finally(() => setLoading(false));
  }, []);

  // 🔵 Lấy danh sách mã giảm giá còn hạn
  const fetchActiveCoupons = useCallback(() => {
    couponApi
      .getActiveCoupons()
      .then((res) => setActiveCoupons(res.data))
      .catch((err) =>
        console.error("Lỗi khi lấy danh sách mã giảm giá còn hạn:", err)
      );
  }, []);

  useEffect(() => {
    fetchCoupons();
    fetchActiveCoupons();
  }, [fetchCoupons, fetchActiveCoupons]);

  const handleEdit = (coupon) => {
    setEditingCoupon(coupon);
    setShowCouponModal(true);
  };

  const handleAdd = () => {
    setEditingCoupon(null);
    setShowCouponModal(true);
  };

  const handleDelete = (id) => {
    setConfirmDelete({ isOpen: true, couponId: id });
  };

  const confirmDeleteCoupon = () => {
    couponApi
      .deleteCoupon(confirmDelete.couponId)
      .then(() => {
        addToast({
          title: "Thành công!",
          message: "Mã giảm giá đã được xóa.",
          type: "success",
          duration: 3000,
        });
        fetchCoupons();
        fetchActiveCoupons(); // Chỉ gọi khi cần
      })
      .catch((err) => {
        addToast({
          title: "Lỗi!",
          message: err.response?.data?.message || "Xóa mã giảm giá thất bại.",
          type: "error",
          duration: 3000,
        });
      })
      .finally(() => setConfirmDelete({ isOpen: false, couponId: null }));
  };

  return (
    <div className="admin-coupons">
      <div className="admin-coupons__header">
        <h2 className="admin-coupons__title">Quản lý Mã Giảm Giá</h2>
        <div className="admin-coupons__actions">
          <button
            className="admin-coupons__btn admin-coupons__btn--primary"
            onClick={handleAdd}
          >
            + Thêm Mã Giảm Giá
          </button>
        </div>
      </div>

      {loading ? (
        <Loading
          text="Đang tải mã giảm giá..."
          size="lg"
        />
      ) : (
        <CouponList
          coupons={coupons}
          activeCoupons={activeCoupons}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <CouponModal
        show={showCouponModal}
        handleClose={() => setShowCouponModal(false)}
        initialData={editingCoupon}
        onSuccess={() => {
          fetchCoupons();
          fetchActiveCoupons();
        }}
      />

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa mã giảm giá này không?"
        onConfirm={confirmDeleteCoupon}
        onCancel={() => setConfirmDelete({ isOpen: false, couponId: null })}
      />
    </div>
  );
};

export default AdminCoupons;
