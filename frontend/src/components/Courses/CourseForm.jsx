import PropTypes from "prop-types";
import { useState, useEffect } from "react";
import courseApi from "../../api/courseApi";
import "../../styles/course/course-form.css";

const CourseForm = ({ initialData = null, onSuccess, onCancel }) => {
  const [course, setCourse] = useState({
    title: "",
    description: "",
    price: "",
  });
  const [error, setError] = useState("");

  useEffect(() => {
    if (initialData) {
      setCourse(initialData);
    }
  }, [initialData]);

  const handleChange = (e) => {
    setCourse({ ...course, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    if (initialData && initialData.id) {
      courseApi
        .updateCourse(initialData.id, course)
        .then((res) => onSuccess(res.data))
        .catch((err) => {
          setError(
            err.response?.data?.message || "Cập nhật khóa học thất bại."
          );
        });
    } else {
      const formData = new FormData();
      formData.append("title", course.title);
      formData.append("description", course.description);
      formData.append("price", course.price);
      courseApi
        .createCourse(formData)
        .then((res) => onSuccess(res.data))
        .catch((err) => {
          setError(err.response?.data?.message || "Tạo khóa học thất bại.");
        });
    }
  };

  return (
    <form
      className="course-form"
      onSubmit={handleSubmit}
    >
      <h3 className="course-form__title">
        {initialData ? "Cập nhật khóa học" : "Thêm khóa học mới"}
      </h3>
      {error && <p className="course-form__error">{error}</p>}

      <div className="course-form__group">
        <label className="course-form__label">Tiêu đề:</label>
        <input
          type="text"
          name="title"
          className="course-form__input"
          value={course.title}
          onChange={handleChange}
          required
        />
      </div>

      <div className="course-form__group">
        <label className="course-form__label">Mô tả:</label>
        <textarea
          name="description"
          className="course-form__textarea"
          value={course.description}
          onChange={handleChange}
        ></textarea>
      </div>

      <div className="course-form__group">
        <label className="course-form__label">Giá:</label>
        <input
          type="number"
          name="price"
          className="course-form__input"
          value={course.price}
          onChange={handleChange}
          required
        />
      </div>

      <div className="course-form__actions">
        <button
          type="submit"
          className="course-form__button course-form__button--submit"
        >
          {initialData ? "Cập nhật" : "Thêm"}
        </button>
        <button
          type="button"
          className="course-form__button course-form__button--cancel"
          onClick={onCancel}
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

CourseForm.propTypes = {
  initialData: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default CourseForm;
