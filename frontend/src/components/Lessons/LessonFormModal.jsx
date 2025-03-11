import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import lessonApi from "../../api/lessonApi";
import "../../styles/course/lesson-form-modal.css";

const LessonFormModal = ({
  show,
  courseId,
  initialData = null,
  handleClose,
  onSuccess,
}) => {
  const [formData, setFormData] = useState({
    course_id: courseId,
    title: "",
    content: "",
    video_url: "",
    order: "",
    document: null,
  });
  const [error, setError] = useState("");

  // Nếu có dữ liệu ban đầu (update) thì set lại formData
  useEffect(() => {
    if (initialData) {
      setFormData({
        course_id: courseId,
        title: initialData.title || "",
        content: initialData.content || "",
        video_url: initialData.video_url || "",
        order: initialData.order || "",
        document: null, // không tự động hiển thị file cũ, chỉ cập nhật khi upload file mới
      });
    } else {
      // Nếu tạo mới thì reset form
      setFormData({
        course_id: courseId,
        title: "",
        content: "",
        video_url: "",
        order: "",
        document: null,
      });
    }
  }, [initialData, courseId]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setFormData((prev) => ({ ...prev, document: e.target.files[0] }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    // Tạo đối tượng FormData để gửi dữ liệu kiểu multipart/form-data
    const data = new FormData();
    data.append("course_id", formData.course_id);
    data.append("title", formData.title);
    data.append("content", formData.content);
    data.append("video_url", formData.video_url);
    data.append("order", formData.order);
    if (formData.document) {
      data.append("document", formData.document);
    }

    // Nếu có initialData (update) thì gọi API update, ngược lại tạo mới
    if (initialData && initialData.id) {
      lessonApi
        .updateLesson(initialData.id, data)
        .then((res) => {
          onSuccess(res.data);
          handleClose();
        })
        .catch((err) => {
          setError(err.response?.data?.message || "Cập nhật bài học thất bại.");
        });
    } else {
      lessonApi
        .createLesson(data)
        .then((res) => {
          onSuccess(res.data);
          handleClose();
        })
        .catch((err) => {
          setError(err.response?.data?.message || "Tạo bài học thất bại.");
        });
    }
  };

  if (!show) return null;

  return (
    <div className="lesson-form-modal__overlay">
      <div className="lesson-form-modal">
        <div className="lesson-form-modal__header">
          <h3 className="lesson-form-modal__title">
            {initialData ? "Cập nhật bài học" : "Thêm bài học mới"}
          </h3>
          <button
            className="lesson-form-modal__close-btn"
            onClick={handleClose}
          >
            &times;
          </button>
        </div>
        <form
          onSubmit={handleSubmit}
          className="lesson-form-modal__form"
        >
          {error && <p className="lesson-form-modal__error">{error}</p>}
          <input
            type="hidden"
            name="course_id"
            value={courseId}
          />
          <div className="lesson-form-modal__form-group">
            <label
              htmlFor="title"
              className="lesson-form-modal__label"
            >
              Tiêu đề:
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleChange}
              className="lesson-form-modal__input"
              required
            />
          </div>
          <div className="lesson-form-modal__form-group">
            <label
              htmlFor="content"
              className="lesson-form-modal__label"
            >
              Nội dung:
            </label>
            <textarea
              id="content"
              name="content"
              value={formData.content}
              onChange={handleChange}
              className="lesson-form-modal__textarea"
            ></textarea>
          </div>
          <div className="lesson-form-modal__form-group">
            <label
              htmlFor="video_url"
              className="lesson-form-modal__label"
            >
              Video URL:
            </label>
            <input
              type="url"
              id="video_url"
              name="video_url"
              value={formData.video_url}
              onChange={handleChange}
              className="lesson-form-modal__input"
            />
          </div>
          <div className="lesson-form-modal__form-group">
            <label
              htmlFor="order"
              className="lesson-form-modal__label"
            >
              Thứ tự:
            </label>
            <input
              type="number"
              id="order"
              name="order"
              min={1}
              value={formData.order}
              onChange={handleChange}
              className="lesson-form-modal__input"
              required
            />
          </div>
          <div className="lesson-form-modal__form-group">
            <label
              htmlFor="document"
              className="lesson-form-modal__label"
            >
              Tài liệu (nếu có):
            </label>
            <input
              type="file"
              id="document"
              name="document"
              onChange={handleFileChange}
              className="lesson-form-modal__input-file"
              accept=".pdf,.mp4,.avi,.mov"
            />
          </div>
          <div className="lesson-form-modal__actions">
            <button
              type="submit"
              className="lesson-form-modal__btn lesson-form-modal__btn--primary"
            >
              {initialData ? "Cập nhật" : "Thêm"}
            </button>
            <button
              type="button"
              onClick={handleClose}
              className="lesson-form-modal__btn lesson-form-modal__btn--secondary"
            >
              Hủy
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

LessonFormModal.propTypes = {
  show: PropTypes.bool.isRequired,
  courseId: PropTypes.number.isRequired,
  initialData: PropTypes.object,
  handleClose: PropTypes.func.isRequired,
  onSuccess: PropTypes.func.isRequired,
};

export default LessonFormModal;
