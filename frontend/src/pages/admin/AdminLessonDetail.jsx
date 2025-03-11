import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import lessonApi from "../../api/lessonApi";
import "../../styles/course/admin-lesson-detail.css";
import { useToast } from "../../hooks/useToast";
import ConfirmDialog from "../../components/Common/ConfirmDialog";
import Loading from "../../components/Common/Loading";

const AdminLessonDetail = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();
  const [lesson, setLesson] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false); // Trạng thái hộp thoại
  const [formData, setFormData] = useState({
    title: "",
    content: "",
    video_url: "",
    order: "",
  });

  useEffect(() => {
    lessonApi
      .getLessonDetail(lessonId)
      .then((res) => {
        setLesson(res.data);
        setFormData({
          title: res.data.title,
          content: res.data.content,
          video_url: res.data.video_url || "",
          order: res.data.order,
        });
        setLoading(false);
      })
      .catch((err) => {
        setError(
          err.response?.data?.message || "Không thể lấy chi tiết bài học."
        );
        setLoading(false);
      });
  }, [lessonId]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleUpdate = (e) => {
    e.preventDefault();
    lessonApi
      .updateLesson(lessonId, formData)
      .then((res) => {
        setLesson(res.data);
        addToast({
          title: "Thành công",
          message: "Cập nhật bài học thành công.",
          type: "success",
          duration: 3000,
        });
      })
      .catch((err) => {
        addToast({
          title: "Thất bại",
          message: err.response?.data?.message || "Cập nhật bài học thất bại.",
          type: "error",
          duration: 3000,
        });
      });
  };

  const handleDelete = () => {
    setIsConfirmOpen(true); // Mở hộp thoại xác nhận
  };

  const confirmDelete = () => {
    lessonApi
      .deleteLesson(lessonId)
      .then(() => {
        addToast({
          title: "Thành công",
          message: "Xóa bài học thành công.",
          type: "success",
          duration: 3000,
        });
        navigate(`/admin/courses/${courseId}`);
      })
      .catch((err) => {
        addToast({
          title: "Thất bại",
          message: err.response?.data?.message || "Xóa bài học thất bại.",
          type: "error",
          duration: 3000,
        });
      })
      .finally(() => {
        setIsConfirmOpen(false); // Đóng hộp thoại sau khi xử lý xong
      });
  };

  if (loading)
    return (
      <div>
        <Loading
          text="Đang tải dữ liệu..."
          size="lg"
        />
      </div>
    );
  if (error)
    return (
      <div className="admin-lesson-detail__error text-danger">{error}</div>
    );
  if (!lesson) return null;

  return (
    <div className="admin-lesson-detail">
      <header className="admin-lesson-detail__header">
        <h2 className="admin-lesson-detail__title">Chi tiết bài học</h2>
        <Link
          to={`/admin/courses/${courseId}`}
          className="admin-lesson-detail__back-link"
        >
          &larr; Quay lại khóa học
        </Link>
      </header>

      <form
        onSubmit={handleUpdate}
        className="admin-lesson-detail__form"
      >
        <div className="admin-lesson-detail__form-group">
          <label
            htmlFor="title"
            className="admin-lesson-detail__label"
          >
            Tiêu đề:
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="admin-lesson-detail__input"
            required
          />
        </div>

        <div className="admin-lesson-detail__form-group">
          <label
            htmlFor="content"
            className="admin-lesson-detail__label"
          >
            Nội dung:
          </label>
          <textarea
            id="content"
            name="content"
            value={formData.content}
            onChange={handleChange}
            className="admin-lesson-detail__textarea"
          ></textarea>
        </div>

        <div className="admin-lesson-detail__form-group">
          <label
            htmlFor="video_url"
            className="admin-lesson-detail__label"
          >
            Video URL:
          </label>
          <input
            type="url"
            id="video_url"
            name="video_url"
            value={formData.video_url}
            onChange={handleChange}
            className="admin-lesson-detail__input"
          />
        </div>

        <div className="admin-lesson-detail__form-group">
          <label
            htmlFor="order"
            className="admin-lesson-detail__label"
          >
            Thứ tự:
          </label>
          <input
            type="number"
            id="order"
            name="order"
            value={formData.order}
            onChange={handleChange}
            className="admin-lesson-detail__input"
            required
          />
        </div>

        <div className="admin-lesson-detail__form-actions">
          <button
            type="submit"
            className="admin-lesson-detail__btn admin-lesson-detail__btn--primary"
          >
            Cập nhật
          </button>
          <button
            type="button"
            onClick={handleDelete}
            className="admin-lesson-detail__btn admin-lesson-detail__btn--danger"
          >
            Xóa bài học
          </button>
        </div>
      </form>

      {/* Hộp thoại xác nhận */}
      <ConfirmDialog
        isOpen={isConfirmOpen}
        title="Xác nhận xóa"
        message="Bạn có chắc chắn muốn xóa bài học này?"
        onConfirm={confirmDelete}
        onCancel={() => setIsConfirmOpen(false)}
      />
    </div>
  );
};

export default AdminLessonDetail;
