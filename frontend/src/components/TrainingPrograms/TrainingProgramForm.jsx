import PropTypes from "prop-types";
import { useEffect, useMemo } from "react";
import { useForm, Controller } from "react-hook-form"; // Import Controller
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import ReactSelect from "react-select";
import "../../styles/trainingPrograms/training-program-form.css";
import trainingProgramApi from "../../api/trainingProgramApi";
import { useToast } from "../../hooks/useToast";

// Schema validation với Yup
const schema = yup.object().shape({
  course_id: yup
    .mixed()
    .required("Khóa học không được để trống")
    .test("is-valid-course", "Khóa học không hợp lệ", (value) => {
      return typeof value === "number" || (value && value.value);
    }),
  name: yup.string().required("Tên chương trình không được để trống"),
  duration: yup
    .number()
    .typeError("Thời gian phải là một số")
    .positive("Thời gian phải là số dương")
    .integer("Thời gian phải là số nguyên")
    .required("Thời gian không được để trống"),
  requirements: yup.string().required("Yêu cầu không được để trống"),
  objectives: yup.string().required("Mục tiêu không được để trống"),
  description: yup.string().required("Mô tả không được để trống"),
});

const TrainingProgramForm = ({
  initialData = null,
  onSuccess,
  onCancel,
  courses,
}) => {
  const { addToast } = useToast();

  const courseOptions = useMemo(
    () =>
      courses.map((course) => ({
        value: course.id,
        label: course.title,
      })),
    [courses]
  );

  const {
    control, // Dùng control để kết nối với Controller
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      course_id: "",
      name: "",
      duration: "",
      requirements: "",
      objectives: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      const selectedCourse = courseOptions.find(
        (c) => c.value === initialData.course_id
      );

      reset({
        ...initialData,
        course_id: selectedCourse || "",
      });
    } else {
      reset({
        course_id: "",
        name: "",
        duration: "",
        requirements: "",
        objectives: "",
      });
    }
  }, [initialData, reset, courseOptions]);

  const onSubmit = async (data) => {
    try {
      // Chuẩn bị dữ liệu trước khi gửi đi
      const preparedData = {
        ...data,
        course_id: data.course_id?.value || data.course_id, // Đảm bảo đúng kiểu ID khóa học (value từ ReactSelect)
      };

      if (initialData?.id) {
        // Nếu có initialData thì gọi API cập nhật
        const response = await trainingProgramApi.update(
          initialData.id,
          preparedData
        );
        console.log("Cập nhật thành công:", response.data);
      } else {
        // Nếu không có initialData thì gọi API tạo mới
        const response = await trainingProgramApi.create(preparedData);
        console.log("Tạo mới thành công:", response.data);
      }

      // Hiển thị thông báo thành công
      addToast({
        title: "Thành công!",
        message: initialData
          ? "Chương trình đã được cập nhật."
          : "Chương trình mới đã được thêm.",
        type: "success",
        duration: 3000,
      });
      onSuccess();
      reset();
    } catch (err) {
      console.error("Lỗi khi lưu chương trình đào tạo:", err);
    }
  };

  return (
    <form
      className="training-program-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h3 className="training-program-form__title">
        {initialData
          ? "Cập nhật chương trình đào tạo"
          : "Thêm chương trình đào tạo mới"}
      </h3>

      <div className="training-program-form__group">
        <label className="training-program-form__label">Khóa học</label>
        <Controller
          name="course_id"
          control={control}
          render={({ field }) => (
            <ReactSelect
              {...field}
              options={courseOptions}
              isDisabled={!!initialData} // 🔒 Disable nếu đang update
              className={`react-select__control ${
                errors.course_id ? "training-program-form__input--error" : ""
              }`}
              placeholder="Chọn khóa học"
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption : "");
              }}
            />
          )}
        />
        {errors.course_id && (
          <p className="training-program-form__error">
            {errors.course_id.message}
          </p>
        )}
      </div>

      <div className="training-program-form__group">
        <label className="training-program-form__label">Tên chương trình</label>
        <input
          type="text"
          {...register("name")}
          className={`training-program-form__input ${
            errors.name ? "training-program-form__input--error" : ""
          }`}
        />
        {errors.name && (
          <p className="training-program-form__error">{errors.name.message}</p>
        )}
      </div>

      <div className="training-program-form__group">
        <label className="training-program-form__label">
          Thời gian (theo tháng)
        </label>
        <input
          type="number"
          {...register("duration")}
          className={`training-program-form__input ${
            errors.duration ? "training-program-form__input--error" : ""
          }`}
          min="1"
          step="1"
        />
        {errors.duration && (
          <p className="training-program-form__error">
            {errors.duration.message}
          </p>
        )}
      </div>

      <div className="training-program-form__group">
        <label className="training-program-form__label">Yêu cầu</label>
        <textarea
          {...register("requirements")}
          className={`training-program-form__textarea ${
            errors.requirements ? "training-program-form__input--error" : ""
          }`}
        />
        {errors.requirements && (
          <p className="training-program-form__error">
            {errors.requirements.message}
          </p>
        )}
      </div>

      <div className="training-program-form__group">
        <label className="training-program-form__label">Mục tiêu</label>
        <textarea
          {...register("objectives")}
          className={`training-program-form__textarea ${
            errors.objectives ? "training-program-form__input--error" : ""
          }`}
        />
        {errors.objectives && (
          <p className="training-program-form__error">
            {errors.objectives.message}
          </p>
        )}
      </div>
      <div className="training-program-form__group">
        <label className="training-program-form__label">Mô tả</label>
        <textarea
          {...register("description")}
          className={`training-program-form__textarea ${
            errors.description ? "training-program-form__input--error" : ""
          }`}
        />
        {errors.description && (
          <p className="training-program-form__error">
            {errors.description.message}
          </p>
        )}
      </div>

      <div className="training-program-form__actions">
        <button
          type="submit"
          className="training-program-form__button training-program-form__button--submit"
          disabled={isSubmitting}
        >
          {initialData ? "Cập nhật" : "Thêm mới"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="training-program-form__button training-program-form__button--cancel"
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

TrainingProgramForm.propTypes = {
  initialData: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
  courses: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      title: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default TrainingProgramForm;
