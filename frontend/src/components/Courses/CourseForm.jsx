import PropTypes from "prop-types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import courseApi from "../../api/courseApi";
import "../../styles/course/course-form.css";

// ✅ Define validation schema với Yup
const courseSchema = yup.object().shape({
  title: yup.string().trim().required("Tiêu đề không được để trống"),
  description: yup.string().trim().optional(),
  price: yup
    .number()
    .typeError("Giá phải là một số")
    .min(0, "Giá không thể nhỏ hơn 0")
    .required("Giá không được để trống"),
});

const CourseForm = ({ initialData = null, onSuccess, onCancel }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(courseSchema),
    defaultValues: {
      title: "",
      description: "",
      price: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      setValue("title", initialData.title);
      setValue("description", initialData.description);
      setValue("price", initialData.price);
    }
  }, [initialData, setValue]);

  const onSubmit = async (data) => {
    try {
      if (initialData && initialData.id) {
        const res = await courseApi.updateCourse(initialData.id, data);
        onSuccess(res.data);
      } else {
        const res = await courseApi.createCourse(data);
        onSuccess(res.data);
      }
    } catch (error) {
      console.error("Lỗi khi gửi form:", error);
    }
  };

  return (
    <form
      className="course-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h3 className="course-form__title">
        {initialData ? "Cập nhật khóa học" : "Thêm khóa học mới"}
      </h3>

      {/* Tiêu đề */}
      <div className="course-form__group">
        <label className="course-form__label">Tiêu đề:</label>
        <input
          type="text"
          className={`course-form__input ${errors.title ? "is-invalid" : ""}`}
          {...register("title")}
        />
        {errors.title && (
          <p className="course-form__error">{errors.title.message}</p>
        )}
      </div>

      {/* Mô tả */}
      <div className="course-form__group">
        <label className="course-form__label">Mô tả:</label>
        <textarea
          className={`course-form__textarea ${
            errors.description ? "is-invalid" : ""
          }`}
          {...register("description")}
        ></textarea>
        {errors.description && (
          <p className="course-form__error">{errors.description.message}</p>
        )}
      </div>

      {/* Giá */}
      <div className="course-form__group">
        <label className="course-form__label">Giá:</label>
        <input
          type="number"
          className={`course-form__input ${errors.price ? "is-invalid" : ""}`}
          {...register("price")}
        />
        {errors.price && (
          <p className="course-form__error">{errors.price.message}</p>
        )}
      </div>

      {/* Nút hành động */}
      <div className="course-form__actions">
        <button
          type="submit"
          className="course-form__button course-form__button--submit"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Đang xử lý..." : initialData ? "Cập nhật" : "Thêm"}
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
