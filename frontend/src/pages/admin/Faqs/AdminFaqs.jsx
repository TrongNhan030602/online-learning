import { useCallback, useEffect, useState } from "react";
import { useToast } from "../../../hooks/useToast";
import faqApi from "@/api/faqApi";
import ConfirmDialog from "@/components/Common/ConfirmDialog";
import Loading from "@/components/Common/Loading";
import FaqList from "@/components/Faqs/FaqList";
import FaqModal from "@/components/Faqs/FaqModal";
import "../../../styles/faqs/admin-faqs.css";

const AdminFaqs = () => {
  const [faqs, setFaqs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingFaq, setEditingFaq] = useState(null);
  const [showFaqModal, setShowFaqModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    faqId: null,
  });

  const { addToast } = useToast();

  const fetchFaqs = useCallback(() => {
    setLoading(true);
    faqApi
      .getFaqs()
      .then((res) => {
        const data = res.data?.data;
        setFaqs(Array.isArray(data) ? data : []); // Đảm bảo luôn là mảng
        setLoading(false);
      })
      .catch((err) => {
        console.error("Lỗi khi lấy danh sách FAQs:", err);
        setFaqs([]); // Đảm bảo faqs không bị undefined
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    fetchFaqs();
  }, [fetchFaqs]);

  const handleEdit = (faq) => {
    setEditingFaq(faq);
    setShowFaqModal(true);
  };

  const handleAdd = () => {
    setEditingFaq(null);
    setShowFaqModal(true);
  };

  const handleDelete = (id) => {
    setConfirmDelete({ isOpen: true, faqId: id });
  };

  const confirmDeleteFaq = () => {
    faqApi.deleteFaq(confirmDelete.faqId).then(() => {
      addToast({
        title: "Thành công!",
        message: "Câu hỏi đã được xóa.",
        type: "success",
        duration: 3000,
      });
      fetchFaqs();
    });
    setConfirmDelete({ isOpen: false, faqId: null });
  };

  return (
    <div className="admin-faqs">
      <div className="admin-faqs__header">
        <h2 className="admin-faqs__title">Quản lý FAQs</h2>
        <div className="admin-faqs__actions">
          <button
            className="admin-faqs__btn admin-faqs__btn--primary"
            onClick={handleAdd}
          >
            + Thêm câu hỏi
          </button>
        </div>
      </div>

      {loading ? (
        <Loading
          text="Đang tải dữ liệu..."
          size="lg"
          variant="primary"
          textVariant="primary"
        />
      ) : (
        <FaqList
          faqs={faqs}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <FaqModal
        show={showFaqModal}
        handleClose={() => setShowFaqModal(false)}
        initialData={editingFaq}
        onSuccess={fetchFaqs}
      />

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa câu hỏi này không?"
        onConfirm={confirmDeleteFaq}
        onCancel={() => setConfirmDelete({ isOpen: false, faqId: null })}
      />
    </div>
  );
};

export default AdminFaqs;
