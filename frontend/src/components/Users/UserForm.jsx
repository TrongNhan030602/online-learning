import PropTypes from "prop-types";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import userApi from "@/api/userApi";
import "../../styles/user/user-form.css";

// Schema validation cho việc tạo mới người dùng
const createSchema = yup.object().shape({
  name: yup
    .string()
    .required("Họ và tên không được để trống")
    .min(3, "Họ và tên phải có ít nhất 3 ký tự"),

  email: yup
    .string()
    .required("Email không được để trống")
    .email("Email không hợp lệ"),

  password: yup
    .string()
    .required("Mật khẩu không được để trống")
    .min(6, "Mật khẩu phải có ít nhất 6 ký tự"),

  password_confirmation: yup
    .string()
    .oneOf([yup.ref("password"), null], "Mật khẩu xác nhận không khớp"),

  role: yup
    .string()
    .oneOf(["student", "admin", "advisor"], "Vai trò không hợp lệ")
    .required("Vai trò không được để trống"),

  first_name: yup.string().required("Tên riêng không được để trống"),
  last_name: yup.string().required("Họ không được để trống"),

  // Những trường không bắt buộc
  phone: yup.string().nullable(),
  address: yup.string().nullable(),
  gender: yup.string().nullable().oneOf(["male", "female", "other"]),
  position: yup.string().nullable(),
  info: yup.string().nullable(),
});

// Schema validation cho việc cập nhật người dùng
const updateSchema = yup.object().shape({
  name: yup
    .string()
    .required("Họ và tên không được để trống")
    .min(3, "Họ và tên phải có ít nhất 3 ký tự"),
  first_name: yup.string().required("Tên riêng không được để trống"),
  last_name: yup.string().required("Họ không được để trống"),
  phone: yup
    .string()
    .matches(/^\d{10,11}$/, "Số điện thoại không hợp lệ")
    .required("Số điện thoại không được để trống"),
  address: yup.string().required("Địa chỉ không được để trống"),
  gender: yup.string().required("Giới tính không được để trống"),
  position: yup.string().required("Vị trí không được để trống"),
  info: yup.string().required("Thông tin không được để trống"),
});

const UserForm = ({ initialData = null, onSuccess, onCancel }) => {
  // Chọn schema validation phù hợp khi tạo mới hoặc cập nhật

  const schema = initialData ? updateSchema : createSchema;

  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
    reset,
  } = useForm({
    resolver: yupResolver(schema),
    defaultValues: initialData
      ? {
          name: initialData.name || "",
          email: initialData.email || "",
          role: initialData.role || "student",
          first_name: initialData.profile?.first_name || "",
          last_name: initialData.profile?.last_name || "",
          phone: initialData.profile?.phone || "",
          address: initialData.profile?.address || "",
          gender: initialData?.profile?.gender ?? "other",

          position: initialData.profile?.position || "Học viên",
          info: initialData.profile?.info || "",
        }
      : {
          name: "",
          email: "",
          password: "",
          password_confirmation: "",
          role: "student",
          first_name: "",
          last_name: "",
          phone: "",
          address: "",
          gender: "other",
          position: "Học viên",
          info: "",
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
      if (err.response?.status === 422 && err.response.data?.errors) {
        const backendErrors = err.response.data.errors;
        Object.entries(backendErrors).forEach(([field, messages]) => {
          setError(field, {
            type: "server",
            message: messages[0], // lấy lỗi đầu tiên trong mảng
          });
        });
      } else {
        console.error("Lỗi không xác định:", err);
      }
    }
  };

  return (
    <form
      className="user-form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <div className="user-form__group">
        <label className="user-form__label">Tên hoặc MSSV:</label>
        <input
          type="text"
          {...register("name")}
          className={`user-form__input ${
            errors.name ? "user-form__input--error" : ""
          }`}
        />
        {errors.name && (
          <p className="user-form__error">{errors.name.message}</p>
        )}
      </div>

      {!initialData && ( // Chỉ hiển thị email và mật khẩu khi tạo mới
        <>
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
            <label className="user-form__label">Mật khẩu:</label>
            <input
              type="password"
              {...register("password")}
              className={`user-form__input ${
                errors.password ? "user-form__input--error" : ""
              }`}
            />
            {errors.password && (
              <p className="user-form__error">{errors.password.message}</p>
            )}
          </div>

          <div className="user-form__group">
            <label className="user-form__label">Xác nhận mật khẩu:</label>
            <input
              type="password"
              {...register("password_confirmation")}
              className={`user-form__input ${
                errors.password_confirmation ? "user-form__input--error" : ""
              }`}
            />
            {errors.password_confirmation && (
              <p className="user-form__error">
                {errors.password_confirmation.message}
              </p>
            )}
          </div>

          <div className="user-form__group">
            <label className="user-form__label">Vai trò:</label>
            <select
              {...register("role")}
              className="user-form__input"
            >
              <option value="">Chọn vai trò</option>
              <option value="student">Học viên</option>
              <option value="advisor">Cố vấn</option>
              <option value="admin">Admin</option>
            </select>
            {errors.role && (
              <p className="user-form__error">{errors.role.message}</p>
            )}
          </div>
        </>
      )}

      <div className="user-form__group">
        <label className="user-form__label">Họ:</label>
        <input
          type="text"
          {...register("last_name")}
          className={`user-form__input ${
            errors.last_name ? "user-form__input--error" : ""
          }`}
        />
        {errors.last_name && (
          <p className="user-form__error">{errors.last_name.message}</p>
        )}
      </div>
      <div className="user-form__group">
        <label className="user-form__label">Tên</label>
        <input
          type="text"
          {...register("first_name")}
          className={`user-form__input ${
            errors.first_name ? "user-form__input--error" : ""
          }`}
        />
        {errors.first_name && (
          <p className="user-form__error">{errors.first_name.message}</p>
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
        <label className="user-form__label">Địa chỉ:</label>
        <input
          type="text"
          {...register("address")}
          className={`user-form__input ${
            errors.address ? "user-form__input--error" : ""
          }`}
        />
        {errors.address && (
          <p className="user-form__error">{errors.address.message}</p>
        )}
      </div>

      <div className="user-form__group">
        <label className="user-form__label">Giới tính:</label>
        <select
          {...register("gender")}
          className="user-form__input"
        >
          <option value="male">Nam</option>
          <option value="female">Nữ</option>
          <option value="other">Khác</option>
        </select>
        {errors.gender && (
          <p className="user-form__error">{errors.gender.message}</p>
        )}
      </div>

      <div className="user-form__group">
        <label className="user-form__label">Vị trí (chức vụ):</label>
        <input
          type="text"
          {...register("position")}
          className={`user-form__input ${
            errors.position ? "user-form__input--error" : ""
          }`}
        />
        {errors.position && (
          <p className="user-form__error">{errors.position.message}</p>
        )}
      </div>

      <div className="user-form__group">
        <label className="user-form__label">Thông tin:</label>
        <textarea
          {...register("info")}
          className={`user-form__input ${
            errors.info ? "user-form__input--error" : ""
          }`}
        />
        {errors.info && (
          <p className="user-form__error">{errors.info.message}</p>
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
