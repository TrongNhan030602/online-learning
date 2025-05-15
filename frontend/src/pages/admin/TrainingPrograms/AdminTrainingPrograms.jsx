import { useEffect, useState, useCallback } from "react";
import { useToast } from "@/hooks/useToast";
import trainingProgramApi from "@/api/trainingProgramApi";
import userApi from "@/api/userApi";
import ConfirmDialog from "@/components/Common/ConfirmDialog";
import Loading from "@/components/common/Loading";
import TrainingProgramList from "@/components/TrainingPrograms/TrainingProgramList";
import TrainingProgramModal from "@/components/TrainingPrograms/TrainingProgramModal";
import "../../../styles/trainingPrograms/admin-training-programs.css";

const AdminTrainingPrograms = () => {
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProgram, setEditingProgram] = useState(null);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    programId: null,
  });
  const [advisors, setAdvisors] = useState([]);
  const { addToast } = useToast();

  // Hàm fetch dữ liệu (dùng useCallback để tránh việc gọi lại khi không cần thiết)
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const programsRes = await trainingProgramApi.getAll();
      const fetchedPrograms = Array.isArray(programsRes.data?.data)
        ? programsRes.data.data
        : [];
      setPrograms(fetchedPrograms);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu:", error);
      addToast({
        title: "Lỗi",
        message: "Không thể tải dữ liệu chương trình đào tạo.",
        type: "error",
        duration: 1500,
      });
    } finally {
      setLoading(false);
    }
  }, [addToast]);

  useEffect(() => {
    fetchData();
    const fetchAdvisors = async () => {
      try {
        const res = await userApi.getUsers({ role: "advisor" });
        setAdvisors(res.data || []);
      } catch (error) {
        console.error("Lỗi khi tải danh sách cố vấn:", error);
        addToast({
          title: "Lỗi",
          message: "Không thể tải danh sách cố vấn.",
          type: "error",
        });
      }
    };
    fetchAdvisors();
  }, [fetchData, addToast]);

  // Hàm thêm mới chương trình đào tạo
  const handleAdd = () => {
    setEditingProgram(null);
    setShowProgramModal(true);
  };

  // Hàm chỉnh sửa chương trình đào tạo
  const handleEdit = (program) => {
    setEditingProgram(program);
    setShowProgramModal(true);
  };

  // Hàm xoá chương trình đào tạo
  const handleDelete = (id) => {
    setConfirmDelete({ isOpen: true, programId: id });
  };

  // Xác nhận xoá chương trình đào tạo
  const confirmDeleteProgram = async () => {
    try {
      const response = await trainingProgramApi.delete(confirmDelete.programId);

      if (response.status === 200) {
        setPrograms((prev) =>
          prev.filter((p) => p.id !== confirmDelete.programId)
        );

        addToast({
          title: "Thành công!",
          message: "Chương trình đào tạo đã được xóa.",
          type: "success",
          duration: 3000,
        });
      }
    } catch (error) {
      console.error("Lỗi khi xoá chương trình:", error);
      addToast({
        title: "Lỗi!",
        message: error.response?.data?.message || "Không thể xoá chương trình.",
        type: "error",
        duration: 3000,
      });
    } finally {
      setConfirmDelete({ isOpen: false, programId: null });
    }
  };

  // Hàm xử lý khi thêm mới hoặc chỉnh sửa chương trình
  const handleModalSuccess = async () => {
    setShowProgramModal(false);
    addToast({
      title: "Thành công!",
      message: editingProgram
        ? "Chỉnh sửa chương trình đào tạo thành công."
        : "Thêm mới chương trình đào tạo thành công.",
      type: "success",
    });
    fetchData();
  };

  return (
    <div className="admin-training-programs">
      <div className="admin-training-programs__header">
        <h2 className="admin-training-programs__title">
          Quản lý Chương trình đào tạo
        </h2>
        <button
          className="admin-training-programs__btn admin-training-programs__btn--primary"
          onClick={handleAdd}
        >
          + Thêm chương trình
        </button>
      </div>

      {loading ? (
        <Loading text="Đang tải dữ liệu..." />
      ) : (
        <TrainingProgramList
          trainingPrograms={programs}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}

      <TrainingProgramModal
        show={showProgramModal}
        handleClose={() => setShowProgramModal(false)}
        initialData={editingProgram}
        onSuccess={handleModalSuccess}
        advisors={advisors}
      />

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        title="Xác nhận xoá"
        message="Bạn có chắc chắn muốn xoá chương trình này?"
        onConfirm={confirmDeleteProgram}
        onCancel={() => setConfirmDelete({ isOpen: false, programId: null })}
      />
    </div>
  );
};

export default AdminTrainingPrograms;
