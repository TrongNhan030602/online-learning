import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import userApi from "../../api/userApi";
import "../../styles/user/user-form.css";

// Schema validation bằng Yup
const schema = yup.object().shape({
  fullName: yup
    .string()
    .required("Họ và tên không được để trống")
    .min(3, "Họ và tên phải có ít nhất 3 ký tự"),
  email: yup
    .string()
    .required("Email không được để trống")
    .email("Email không hợp lệ"),
  phone: yup.string().matches(/^\d{10,11}$/, "Số điện thoại không hợp lệ"),
  role: yup.string().required("Vai trò không được để trống"),
});

const UserForm = ({ initialData = null, onSuccess, onCancel }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData || {
      fullName: "",
      email: "",
      phone: "",
      role: "",
    },
  });

  // Xử lý gửi form
  const onSubmit = async (data) => {
    try {
      if (initialData) {
        await userApi.updateUser(initialData.id, data);
      } else {
        await userApi.createUser(data);
      }
      onSuccess(data);
      reset();
    } catch (err) {
      console.error("Lỗi khi lưu người dùng:", err);
    }
  };

  return (
    <form
      className="user-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="user-form__group">
        <label className="user-form__label">Họ và tên:</label>
        <input
          type="text"
          {...register("fullName")}
          className={`user-form__input ${
            errors.fullName ? "user-form__input--error" : ""
          }`}
        />
        {errors.fullName && (
          <p className="user-form__error">{errors.fullName.message}</p>
        )}
      </div>

      <div className="user-form__group">
        <label className="user-form__label">Email:</label>
        <input
          type="email"
          {...register("email")}
          className={`user-form__input ${
            errors.email ? "user-form__input--error" : ""
          }`}
        />
        {errors.email && (
          <p className="user-form__error">{errors.email.message}</p>
        )}
      </div>

      <div className="user-form__group">
        <label className="user-form__label">Số điện thoại:</label>
        <input
          type="text"
          {...register("phone")}
          className={`user-form__input ${
            errors.phone ? "user-form__input--error" : ""
          }`}
        />
        {errors.phone && (
          <p className="user-form__error">{errors.phone.message}</p>
        )}
      </div>

      <div className="user-form__group">
        <label className="user-form__label">Vai trò:</label>
        <select
          {...register("role")}
          className="user-form__input"
        >
          <option value="">Chọn vai trò</option>
          <option value="admin">Admin</option>
          <option value="user">User</option>
        </select>
        {errors.role && (
          <p className="user-form__error">{errors.role.message}</p>
        )}
      </div>

      <div className="user-form__actions">
        <button
          type="submit"
          className="user-form__button user-form__button--submit"
          disabled={isSubmitting}
        >
          {initialData ? "Cập nhật" : "Thêm"}
        </button>
        <button
          type="button"
          className="user-form__button user-form__button--cancel"
          onClick={onCancel}
        >
          Hủy
        </button>
      </div>
    </form>
  );
};

UserForm.propTypes = {
  initialData: PropTypes.object,
  onSuccess: PropTypes.func.isRequired,
  onCancel: PropTypes.func.isRequired,
};

export default UserForm;
