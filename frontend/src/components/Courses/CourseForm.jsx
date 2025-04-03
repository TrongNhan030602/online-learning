import PropTypes from "prop-types";
import { useEffect, useState } from "react";
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
  image_url: yup.mixed().test("required", "Ảnh là bắt buộc", function (value) {
    const { parent } = this;
    // Chỉ kiểm tra trường ảnh nếu không có dữ liệu ban đầu
    if (!parent.id && !value) {
      return this.createError({ message: "Ảnh là bắt buộc" });
    }
    return true;
  }),
});

const CourseForm = ({ initialData = null, onSuccess, onCancel }) => {
  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm({
    resolver: yupResolver(courseSchema),
    defaultValues: initialData || {
      title: "",
      description: "",
      price: "",
      image_url: "",
    },
  });

  const [imagePreview, setImagePreview] = useState(null);

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
        // Cập nhật khóa học
        const updateData = {
          title: data.title,
          description: data.description,
          price: data.price,
        };

        const res = await courseApi.updateCourse(initialData.id, updateData);
        onSuccess(res.data);
      } else {
        // Tạo mới khóa học
        const formData = new FormData();
        formData.append("title", data.title);
        formData.append("description", data.description);
        formData.append("price", data.price);
        if (data.image_url) {
          formData.append("image_url", data.image_url[0]);
        }

        const res = await courseApi.createCourse(formData);
        onSuccess(res.data);
      }
    } catch (error) {
      console.error("Lỗi khi gửi form:", error);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
      setValue("image_url", e.target.files); // Đảm bảo bạn đã set giá trị đúng
    }
  };

  return (
    <form
      className="course-form"
      onSubmit={(e) => {
        handleSubmit(onSubmit)(e);
      }}
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

      {/* Ảnh */}
      {!initialData && (
        <div className="course-form__group course-form__group--image">
          <label className="course-form__image-label">Hình ảnh:</label>
          <label className="course-form__image-upload-btn">
            Chọn ảnh
            <input
              type="file"
              accept="image/*"
              className="course-form__image-input"
              onChange={handleImageChange}
            />
          </label>

          {imagePreview && (
            <div className="course-form__preview">
              <img
                src={imagePreview}
                alt="Xem trước"
              />
            </div>
          )}
          {errors.image_url && (
            <p className="course-form__error">{errors.image_url.message}</p>
          )}
        </div>
      )}

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
