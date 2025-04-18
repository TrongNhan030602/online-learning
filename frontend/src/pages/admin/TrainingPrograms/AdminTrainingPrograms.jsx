import { useEffect, useState } from "react";
import { useToast } from "../../../hooks/useToast";
import trainingProgramApi from "../../../api/trainingProgramApi";
import courseApi from "../../../api/courseApi";

import TrainingProgramList from "../../../components/TrainingPrograms/TrainingProgramList";
import TrainingProgramModal from "../../../components/TrainingPrograms/TrainingProgramModal";
import ConfirmDialog from "../../../components/Common/ConfirmDialog";
import Loading from "../../../components/Common/Loading";
import "../../../styles/trainingPrograms/admin-training-programs.css";

const AdminTrainingPrograms = () => {
  const [courses, setCourses] = useState([]); // Lưu danh sách khóa học

  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingProgram, setEditingProgram] = useState(null);
  const [showProgramModal, setShowProgramModal] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    programId: null,
  });

  const { addToast } = useToast();

  useEffect(() => {
    const fetchPrograms = async () => {
      setLoading(true);
      try {
        const res = await trainingProgramApi.getAll();
        setPrograms(Array.isArray(res.data) ? res.data : []); // Đảm bảo rằng res.data là mảng
      } catch (err) {
        console.error("Lỗi khi lấy chương trình đào tạo:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchPrograms();
  }, []);
  // Fetch danh sách khóa học
  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const coursesRes = await courseApi.getCourses();
        setCourses(coursesRes.data);
      } catch (err) {
        console.error("Lỗi khi lấy dữ liệu khóa học:", err);
      }
    };

    fetchCourses();
  }, []);
  const handleAdd = () => {
    setEditingProgram(null);
    setShowProgramModal(true);
  };

  const handleEdit = (program) => {
    setEditingProgram(program);
    setShowProgramModal(true);
  };

  const handleDelete = (id) => {
    setConfirmDelete({ isOpen: true, programId: id });
  };

  const confirmDeleteProgram = async () => {
    try {
      await trainingProgramApi.delete(confirmDelete.programId);
      setPrograms(programs.filter((p) => p.id !== confirmDelete.programId));
      addToast({
        title: "Thành công!",
        message: "Đã xóa chương trình đào tạo.",
        type: "success",
        duration: 3000,
      });
    } catch (err) {
      console.error("Lỗi khi xoá:", err);
      addToast({
        title: "Lỗi!",
        message: "Không thể xoá chương trình.",
        type: "error",
      });
    } finally {
      setConfirmDelete({ isOpen: false, programId: null });
    }
  };

  return (
    <div className="admin-training-programs">
      <div className="admin-training-programs__header">
        <h2>Quản lý Chương trình đào tạo</h2>
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
        courses={courses || []}
        onSuccess={() => {
          setLoading(true);
          trainingProgramApi
            .getAll()
            .then((res) => {
              setPrograms(Array.isArray(res.data) ? res.data : []);
            })
            .catch((err) => {
              console.error("Lỗi reload:", err);
            })
            .finally(() => setLoading(false));
        }}
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
