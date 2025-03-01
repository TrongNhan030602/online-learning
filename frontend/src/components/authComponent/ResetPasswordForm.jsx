import { useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock } from "@fortawesome/free-solid-svg-icons";
import authApi from "../../api/authApi";

const ResetPasswordForm = () => {
  const [searchParams] = useSearchParams();
  const token = searchParams.get("token");

  const navigate = useNavigate();
  const [password, setPassword] = useState("");
  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // State chứa lỗi validation
  const [passwordError, setPasswordError] = useState("");
  const [confirmPasswordError, setConfirmPasswordError] = useState("");

  // Hàm validate mật khẩu
  const validatePassword = (value) => {
    if (!value) return "Mật khẩu không được để trống.";
    if (value.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự.";
    if (value.length > 32) return "Mật khẩu không được vượt quá 32 ký tự.";
    if (!/[A-Z]/.test(value))
      return "Mật khẩu phải chứa ít nhất một chữ cái viết hoa.";
    if (!/\d/.test(value)) return "Mật khẩu phải chứa ít nhất một chữ số.";
    if (!/[@$!%*?&]/.test(value))
      return "Mật khẩu phải chứa ít nhất một ký tự đặc biệt (@$!%*?&).";
    return "";
  };

  // Hàm validate xác nhận mật khẩu
  const validateConfirmPassword = (value) => {
    if (!value) return "Vui lòng nhập lại mật khẩu.";
    if (value !== password) return "Mật khẩu xác nhận không khớp.";
    return "";
  };

  // Xử lý khi blur input
  const handleBlurPassword = () => setPasswordError(validatePassword(password));
  const handleBlurConfirmPassword = () =>
    setConfirmPasswordError(validateConfirmPassword(passwordConfirmation));

  // Xử lý submit form
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    // Kiểm tra lỗi trước khi gửi request
    const passwordValidation = validatePassword(password);
    const confirmPasswordValidation =
      validateConfirmPassword(passwordConfirmation);

    setPasswordError(passwordValidation);
    setConfirmPasswordError(confirmPasswordValidation);

    if (passwordValidation || confirmPasswordValidation) return;

    try {
      const response = await authApi.resetPassword(
        token,
        password,
        passwordConfirmation
      );
      setSuccess(
        response.data.message || "Mật khẩu đã được cập nhật thành công."
      );
      setTimeout(() => {
        navigate("/login");
      }, 2000);
    } catch (err) {
      console.error("Reset password failed", err);
      setError(err.response?.data?.message || "Có lỗi xảy ra.");
    }
  };

  return (
    <div
      className="p-4"
      style={{ maxWidth: "400px", border: "none" }}
    >
      <div className="card-body">
        <h2 className="custom-form-heading">
          Đặt lại mật khẩu{" "}
          <FontAwesomeIcon
            icon={faLock}
            className="me-2 small custom-text-primary"
          />
        </h2>
        <p className="custom-subtitle">Nhập mật khẩu mới của bạn.</p>

        {error && <div className="alert alert-danger">{error}</div>}
        {success && <div className="alert alert-success">{success}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label
              htmlFor="newPassword"
              className="form-label"
            >
              Mật khẩu mới <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <input
                type="password"
                id="newPassword"
                className={`form-control ${passwordError ? "is-invalid" : ""}`}
                placeholder="Nhập mật khẩu mới"
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  setPasswordError("");
                }}
                onBlur={handleBlurPassword}
                required
              />
              <span className="input-group-text">
                <FontAwesomeIcon
                  icon={faLock}
                  className="custom-text-gray"
                />
              </span>
            </div>
            {passwordError && (
              <div className="invalid-feedback d-block">{passwordError}</div>
            )}
          </div>

          <div className="mb-3">
            <label
              htmlFor="confirmPassword"
              className="form-label"
            >
              Xác nhận mật khẩu <span className="text-danger">*</span>
            </label>
            <div className="input-group">
              <input
                type="password"
                id="confirmPassword"
                className={`form-control ${
                  confirmPasswordError ? "is-invalid" : ""
                }`}
                placeholder="Nhập lại mật khẩu mới"
                value={passwordConfirmation}
                onChange={(e) => {
                  setPasswordConfirmation(e.target.value);
                  setConfirmPasswordError("");
                }}
                onBlur={handleBlurConfirmPassword}
                required
              />
              <span className="input-group-text">
                <FontAwesomeIcon
                  icon={faLock}
                  className="custom-text-gray"
                />
              </span>
            </div>
            {confirmPasswordError && (
              <div className="invalid-feedback d-block">
                {confirmPasswordError}
              </div>
            )}
          </div>

          <button
            type="submit"
            className="custom-btn-submit"
          >
            Đổi mật khẩu
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordForm;
