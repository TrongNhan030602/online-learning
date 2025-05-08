import PropTypes from "prop-types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import courseApi from "../../api/courseApi";
import "../../styles/course/course-form.css";

// ✅ Define validation schema với Yup
const courseSchema = yup.object().shape({
  code: yup.string().trim().required("Mã môn học không được để trống"),
  title: yup.string().trim().required("Tiêu đề không được để trống"),
  description: yup.string().trim().optional(),
  credits: yup
    .number()
    .typeError("Số tín chỉ phải là một số")
    .min(1, "Số tín chỉ không thể nhỏ hơn 1")
    .required("Số tín chỉ không được để trống"),
  total_hours: yup
    .number()
    .typeError("Tổng số giờ học phải là một số")
    .min(1, "Tổng số giờ học không thể nhỏ hơn 1")
    .required("Tổng số giờ học không được để trống"),
  theory_hours: yup
    .number()
    .typeError("Số giờ lý thuyết phải là một số")
    .min(0, "Số giờ lý thuyết không thể nhỏ hơn 0")
    .required("Số giờ lý thuyết không được để trống"),
  practice_hours: yup
    .number()
    .typeError("Số giờ thực hành phải là một số")
    .min(0, "Số giờ thực hành không thể nhỏ hơn 0")
    .required("Số giờ thực hành không được để trống"),
  exam_hours: yup
    .number()
    .typeError("Số giờ thi phải là một số")
    .min(0, "Số giờ thi không thể nhỏ hơn 0")
    .required("Số giờ thi không được để trống"),
  is_active: yup.boolean(),
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
      code: "",
      title: "",
      description: "",
      credits: "",
      total_hours: "",
      theory_hours: "",
      practice_hours: "",
      exam_hours: "",
      is_active: true,
    },
  });

  useEffect(() => {
    if (initialData) {
      setValue("code", initialData.code);
      setValue("title", initialData.title);
      setValue("description", initialData.description);
      setValue("credits", initialData.credits);
      setValue("total_hours", initialData.total_hours);
      setValue("theory_hours", initialData.theory_hours);
      setValue("practice_hours", initialData.practice_hours);
      setValue("exam_hours", initialData.exam_hours);
      // Chuyển đổi is_active từ 1/0 sang true/false
      setValue("is_active", initialData.is_active === 1);
    }
  }, [initialData, setValue]);

  const onSubmit = async (data) => {
    try {
      const courseData = {
        code: data.code,
        title: data.title,
        description: data.description,
        credits: data.credits,
        total_hours: data.theory_hours + data.practice_hours + data.exam_hours, // Tính toán tổng số giờ học
        theory_hours: data.theory_hours,
        practice_hours: data.practice_hours,
        exam_hours: data.exam_hours,
        is_active: data.is_active,
      };

      console.log("Dữ liệu gửi lên: ", courseData); // Log dữ liệu để kiểm tra

      let res;
      if (initialData && initialData.id) {
        // Cập nhật môn học
        res = await courseApi.updateCourse(initialData.id, courseData);
      } else {
        // Tạo mới môn học
        res = await courseApi.createCourse(courseData);
      }

      onSuccess(res.data);
    } catch (error) {
      console.error("Lỗi khi gửi form:", error);
      if (error.response) {
        console.error("Chi tiết lỗi từ server:", error.response.data);
      }
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
        {initialData ? "Cập nhật môn học" : "Thêm môn học mới"}
      </h3>

      {/* Mã môn học */}
      <div className="course-form__group">
        <label className="course-form__label">Mã môn học:</label>
        <input
          type="text"
          className={`course-form__input ${errors.code ? "is-invalid" : ""}`}
          {...register("code")}
        />
        {errors.code && (
          <p className="course-form__error">{errors.code.message}</p>
        )}
      </div>

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

      {/* Số tín chỉ */}
      <div className="course-form__group">
        <label className="course-form__label">Số tín chỉ:</label>
        <input
          type="number"
          className={`course-form__input ${errors.credits ? "is-invalid" : ""}`}
          {...register("credits")}
        />
        {errors.credits && (
          <p className="course-form__error">{errors.credits.message}</p>
        )}
      </div>

      {/* Tổng số giờ học */}
      <div className="course-form__group">
        <label className="course-form__label">Tổng số giờ học:</label>
        <input
          type="number"
          className={`course-form__input ${
            errors.total_hours ? "is-invalid" : ""
          }`}
          {...register("total_hours")}
        />
        {errors.total_hours && (
          <p className="course-form__error">{errors.total_hours.message}</p>
        )}
      </div>

      {/* Số giờ lý thuyết */}
      <div className="course-form__group">
        <label className="course-form__label">Số giờ lý thuyết:</label>
        <input
          type="number"
          className={`course-form__input ${
            errors.theory_hours ? "is-invalid" : ""
          }`}
          {...register("theory_hours")}
        />
        {errors.theory_hours && (
          <p className="course-form__error">{errors.theory_hours.message}</p>
        )}
      </div>

      {/* Số giờ thực hành */}
      <div className="course-form__group">
        <label className="course-form__label">Số giờ thực hành:</label>
        <input
          type="number"
          className={`course-form__input ${
            errors.practice_hours ? "is-invalid" : ""
          }`}
          {...register("practice_hours")}
        />
        {errors.practice_hours && (
          <p className="course-form__error">{errors.practice_hours.message}</p>
        )}
      </div>

      {/* Số giờ thi */}
      <div className="course-form__group">
        <label className="course-form__label">Số giờ thi:</label>
        <input
          type="number"
          className={`course-form__input ${
            errors.exam_hours ? "is-invalid" : ""
          }`}
          {...register("exam_hours")}
        />
        {errors.exam_hours && (
          <p className="course-form__error">{errors.exam_hours.message}</p>
        )}
      </div>

      {/* Trạng thái */}
      <div className="course-form__group">
        <label className="course-form__label">Trạng thái:</label>
        <select
          className={`course-form__input ${
            errors.is_active ? "is-invalid" : ""
          }`}
          {...register("is_active")}
        >
          <option value={true}>Hoạt động</option>
          <option value={false}>Tạm ngừng</option>
        </select>
        {errors.is_active && (
          <p className="course-form__error">{errors.is_active.message}</p>
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
