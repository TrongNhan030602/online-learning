import PropTypes from "prop-types";
import { useForm, Controller } from "react-hook-form"; // Import Controller
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { useEffect, useMemo } from "react";
import { useToast } from "../../hooks/useToast";
import classApi from "../../api/classApi";
import ReactSelect from "react-select";
import "../../styles/classes/class-form.css";

// Schema validation với Yup
const schema = yup.object().shape({
  course_id: yup
    .mixed()
    .required("Khóa học không được để trống")
    .test("is-valid-course", "Khóa học không hợp lệ", (value) => {
      return typeof value === "number" || (value && value.value); // Kiểm tra nếu là đối tượng ReactSelect
    }),
  name: yup.string().required("Tên lớp học không được để trống"),
  start_date: yup
    .date()
    .typeError("Ngày bắt đầu không hợp lệ")
    .required("Ngày bắt đầu không được để trống"),
  end_date: yup
    .date()
    .typeError("Ngày kết thúc không hợp lệ")
    .required("Ngày kết thúc không được để trống"),
  status: yup
    .mixed()
    .test("is-valid-status", "Trạng thái không hợp lệ", (value) => {
      // Kiểm tra nếu là đối tượng ReactSelect
      if (typeof value === "string") {
        return ["open", "ongoing", "completed", "closed"].includes(value);
      }
      // Nếu là đối tượng ReactSelect, kiểm tra giá trị 'value'
      return (
        value &&
        value.value &&
        ["open", "ongoing", "completed", "closed"].includes(value.value)
      );
    }),
  max_students: yup
    .number()
    .typeError("Số lượng học viên tối đa không hợp lệ")
    .required("Số lượng học viên tối đa không được để trống")
    .min(1, "Số lượng học viên tối thiểu là 1"),
});

const ClassForm = ({ initialData = null, onSuccess, onCancel, courses }) => {
  const { addToast } = useToast();
  // Chuyển đổi khóa học thành cấu trúc phù hợp cho react-select
  const courseOptions = useMemo(() => {
    return courses.map((course) => ({
      value: course.id,
      label: course.title,
    }));
  }, [courses]);

  const statusOptions = useMemo(
    () => [
      { value: "open", label: "Mở" },
      { value: "ongoing", label: "Đang diễn ra" },
      { value: "completed", label: "Hoàn thành" },
      { value: "closed", label: "Đã đóng" },
    ],
    []
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
      start_date: "",
      end_date: "",
      status: statusOptions[0],
      max_students: 25,
    },
  });

  useEffect(() => {
    if (initialData) {
      const selectedCourse = courseOptions.find(
        (c) => c.value === initialData.course_id
      );
      const selectedStatus = statusOptions.find(
        (s) => s.value === initialData.status
      );

      reset({
        ...initialData,
        course_id: selectedCourse || "",
        status: selectedStatus || "",
        start_date: initialData.start_date?.slice(0, 10),
        end_date: initialData.end_date?.slice(0, 10),
      });
    } else {
      reset({
        course_id: "",
        name: "",
        start_date: "",
        end_date: "",
        status: statusOptions[0], // default "open"
        max_students: 25,
      });
    }
  }, [initialData, reset, courseOptions, statusOptions]);

  const onSubmit = async (data) => {
    try {
      // Fix: Ensure only the 'value' from status is passed as a string
      const preparedData = {
        ...data,
        course_id: data.course_id?.value || data.course_id, // Ensure correct course id (value from ReactSelect)
        status: data.status?.value || data.status, // Ensure status is a string value
        max_students: Number(data.max_students),
      };

      // Gửi dữ liệu lên backend
      if (initialData?.id) {
        await classApi.updateClass(initialData.id, preparedData);
      } else {
        await classApi.createClass(preparedData);
      }

      // Hiển thị thông báo thành công
      addToast({
        title: "Thành công!",
        message: initialData
          ? "Lớp học đã được cập nhật."
          : "Lớp học mới đã được thêm.",
        type: "success",
        duration: 3000,
      });

      // Reset form và gọi callback onSuccess
      onSuccess();
      reset();
    } catch (err) {
      console.error("Lỗi khi lưu lớp học:", err);
    }
  };

  return (
    <form
      className="class-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h3 className="class-form__title">
        {initialData ? "Cập nhật lớp học" : "Thêm lớp học mới"}
      </h3>

      <div className="class-form__group">
        <label className="class-form__label">Khóa học</label>
        <Controller
          name="course_id"
          control={control}
          render={({ field }) => (
            <ReactSelect
              {...field}
              options={courseOptions}
              isDisabled={!!initialData} // 🔒 Disable nếu đang update
              className={`react-select__control ${
                errors.course_id ? "class-form__input--error" : ""
              }`}
              placeholder="Chọn khóa học"
              onChange={(selectedOption) => {
                field.onChange(selectedOption ? selectedOption : "");
              }}
            />
          )}
        />
        {initialData && (
          <small className="class-form__hint">
            Khóa học đã được liên kết với lớp này và không thể thay đổi.
          </small>
        )}

        {errors.course_id && (
          <p className="class-form__error">{errors.course_id.message}</p>
        )}
      </div>

      <div className="class-form__group">
        <label className="class-form__label">Tên lớp học</label>
        <input
          type="text"
          {...register("name")}
          className={`class-form__input ${
            errors.name ? "class-form__input--error" : ""
          }`}
        />
        {errors.name && (
          <p className="class-form__error">{errors.name.message}</p>
        )}
      </div>

      <div className="class-form__group">
        <label className="class-form__label">Ngày bắt đầu</label>
        <input
          type="date"
          {...register("start_date")}
          className={`class-form__input ${
            errors.start_date ? "class-form__input--error" : ""
          }`}
        />
        {errors.start_date && (
          <p className="class-form__error">{errors.start_date.message}</p>
        )}
      </div>

      <div className="class-form__group">
        <label className="class-form__label">Ngày kết thúc</label>
        <input
          type="date"
          {...register("end_date")}
          className={`class-form__input ${
            errors.end_date ? "class-form__input--error" : ""
          }`}
        />
        {errors.end_date && (
          <p className="class-form__error">{errors.end_date.message}</p>
        )}
      </div>

      <div className="class-form__group">
        <label className="class-form__label">Trạng thái</label>
        <Controller
          name="status"
          control={control}
          render={({ field }) => (
            <ReactSelect
              {...field}
              options={statusOptions}
              className={`react-select__control ${
                errors.status ? "class-form__input--error" : ""
              }`}
              placeholder="Chọn trạng thái"
              onChange={(selectedOption) => {
                // Cập nhật giá trị của status khi lựa chọn thay đổi
                field.onChange(selectedOption ? selectedOption : ""); // Truyền đối tượng hoặc chuỗi rỗng
              }}
            />
          )}
        />

        {errors.status && (
          <p className="class-form__error">{errors.status.message}</p>
        )}
      </div>

      <div className="class-form__group">
        <label className="class-form__label">Số lượng học viên tối đa</label>
        <input
          type="number"
          {...register("max_students")}
          min={1}
          className={`class-form__input ${
            errors.max_students ? "class-form__input--error" : ""
          }`}
        />
        {errors.max_students && (
          <p className="class-form__error">{errors.max_students.message}</p>
        )}
      </div>

      <div className="class-form__actions">
        <button
          type="submit"
          className="class-form__button class-form__button--submit"
          disabled={isSubmitting}
        >
          {initialData ? "Cập nhật" : "Thêm mới"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="class-form__button class-form__button--cancel"
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

ClassForm.propTypes = {
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

export default ClassForm;
