import PropTypes from "prop-types";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import trainingProgramApi from "@/api/trainingProgramApi";
import { useToast } from "@/hooks/useToast";
import "../../styles/trainingPrograms/training-program-form.css";

// Schema validation với Yup
const schema = yup.object().shape({
  name: yup.string().required("Tên chương trình không được để trống"),
  code: yup.string().required("Mã chương trình không được để trống"),
  level: yup.string().required("Cấp độ không được để trống"),
  note: yup.string().required("Ghi chú không được để trống"),
  advisor_id: yup.string().required("Vui lòng chọn cố vấn"),
});

const TrainingProgramForm = ({
  initialData = null,
  onSuccess,
  onCancel,
  advisors,
}) => {
  const { addToast } = useToast();

  // Sử dụng useForm mà không cần courses
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: {
      name: "",
      level: "college", // Ví dụ, mặc định là college
      code: "",
      note: "",
      advisor_id: "",
    },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        ...initialData,
        advisor_id: initialData.advisor_id?.toString() || "", // Ép về string
      });
    } else {
      reset({
        name: "",
        level: "college",
        code: "",
        note: "",
        advisor_id: "",
      });
    }
  }, [initialData, reset]);

  const onSubmit = async (data) => {
    try {
      const preparedData = {
        ...data,
        advisor_id: parseInt(data.advisor_id), // Convert lại về số
      };

      if (initialData?.id) {
        // Cập nhật chương trình đào tạo
        const response = await trainingProgramApi.update(
          initialData.id,
          preparedData
        );
        console.log("Cập nhật thành công:", response.data);
      } else {
        // Tạo mới chương trình đào tạo
        const response = await trainingProgramApi.create(preparedData);
        console.log("Tạo mới thành công:", response.data);
      }

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
        <label className="training-program-form__label">Mã chương trình</label>
        <input
          type="text"
          {...register("code")}
          className={`training-program-form__input ${
            errors.code ? "training-program-form__input--error" : ""
          }`}
        />
        {errors.code && (
          <p className="training-program-form__error">{errors.code.message}</p>
        )}
      </div>

      <div className="training-program-form__group">
        <label className="training-program-form__label">Mức độ</label>
        <select
          {...register("level")}
          className="training-program-form__input"
        >
          <option value="college">Cao đẳng</option>
          <option value="intermediate">Trung cấp</option>
          <option value="certificate">Chứng chỉ</option>
          <option value="specialized">Chuyên ngành</option>
          <option value="software">Phần mềm</option>
        </select>
      </div>
      <div className="training-program-form__group">
        <label className="training-program-form__label">Cố vấn</label>
        <select
          {...register("advisor_id")}
          className={`training-program-form__input ${
            errors.advisor_id ? "training-program-form__input--error" : ""
          }`}
        >
          <option value="">-- Chọn cố vấn --</option>
          {advisors.map((advisor) => (
            <option
              key={advisor.id}
              value={advisor.id.toString()} // Bảo đảm là chuỗi
            >
              {advisor.name}
            </option>
          ))}
        </select>
        {errors.advisor_id && (
          <p className="training-program-form__error">
            {errors.advisor_id.message}
          </p>
        )}
      </div>

      <div className="training-program-form__group">
        <label className="training-program-form__label">Ghi chú</label>
        <textarea
          {...register("note")}
          className={`training-program-form__textarea ${
            errors.note ? "training-program-form__input--error" : ""
          }`}
        />
        {errors.note && (
          <p className="training-program-form__error">{errors.note.message}</p>
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
  advisors: PropTypes.array.isRequired,
};

export default TrainingProgramForm;
