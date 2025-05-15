import { useEffect, useState } from "react";
import { useToast } from "@/hooks/useToast";
import ConfirmDialog from "@/components/Common/ConfirmDialog";
import Loading from "@/components/Common/Loading";
import disciplineScoreApi from "@/api/disciplineScoreApi";
import DisciplineScoreList from "@/components/DisciplineScores/DisciplineScoreList";
import "../../../styles/discipline-scores/admin-discipline-scores.css";

const AdminDisciplineScores = () => {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [confirmDelete, setConfirmDelete] = useState({
    isOpen: false,
    scoreId: null,
  });

  const { addToast } = useToast();

  const fetchScores = async () => {
    setLoading(true);
    try {
      const res = await disciplineScoreApi.getDisciplineScores();
      setScores(res.data || []);
    } catch (error) {
      console.error("Lỗi khi tải điểm rèn luyện:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchScores();
  }, []);

  const handleDelete = (id) => {
    setConfirmDelete({ isOpen: true, scoreId: id });
  };

  const confirmDeleteScore = async () => {
    try {
      await disciplineScoreApi.deleteDisciplineScore(confirmDelete.scoreId);
      setScores((prev) =>
        prev.filter((item) => item.id !== confirmDelete.scoreId)
      );
      addToast({
        title: "Thành công!",
        message: "Đã xóa điểm rèn luyện.",
        type: "success",
        duration: 3000,
      });
    } catch (err) {
      console.error("Lỗi khi xóa điểm:", err);
      addToast({
        title: "Lỗi!",
        message: "Không thể xóa điểm rèn luyện.",
        type: "error",
        duration: 3000,
      });
    } finally {
      setConfirmDelete({ isOpen: false, scoreId: null });
    }
  };

  const handleUpdate = async () => {
    try {
      await fetchScores();
    } catch (error) {
      console.error("Lỗi khi tải lại điểm rèn luyện:", error);
      addToast({
        title: "Lỗi!",
        message: "Không thể tải lại dữ liệu điểm rèn luyện.",
        type: "error",
        duration: 3000,
      });
    }
  };

  return (
    <div className="admin-discipline-scores">
      <div className="admin-discipline-scores__header">
        <h2 className="admin-discipline-scores__title">
          Quản lý điểm rèn luyện
        </h2>
      </div>

      {loading ? (
        <Loading text="Đang tải dữ liệu..." />
      ) : (
        <DisciplineScoreList
          scores={scores}
          onDelete={handleDelete}
          onUpdate={handleUpdate}
        />
      )}

      <ConfirmDialog
        isOpen={confirmDelete.isOpen}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa điểm rèn luyện này không?"
        onConfirm={confirmDeleteScore}
        onCancel={() => setConfirmDelete({ isOpen: false, scoreId: null })}
      />
    </div>
  );
};

export default AdminDisciplineScores;
