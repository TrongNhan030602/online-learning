import { useState } from "react";
import { Link } from "react-router-dom";
import authApi from "../../api/authApi";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUnlock, faEnvelope } from "@fortawesome/free-solid-svg-icons";

const ForgotPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const [emailError, setEmailError] = useState("");

  // Hàm validate email
  const validateEmail = (value) => {
    if (!value.trim()) return "Email không được để trống.";
    if (value.length > 255) return "Email không được vượt quá 255 ký tự.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Email không hợp lệ.";
    return "";
  };

  // Xử lý khi blur input
  const handleBlur = () => {
    setEmailError(validateEmail(email));
  };

  // Xử lý submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    // Kiểm tra email trước khi gửi request
    const emailValidation = validateEmail(email);
    if (emailValidation) {
      setEmailError(emailValidation);
      return;
    }

    try {
      const response = await authApi.sendResetPasswordEmail(email);
      setMessage(
        response.data.message ||
          "Email hướng dẫn khôi phục mật khẩu đã được gửi. Vui lòng kiểm tra email của bạn."
      );
      setEmail("");
      setEmailError(""); // Xóa lỗi khi thành công
    } catch (err) {
      console.error("Forgot password failed", err);
      setError(
        err.response?.data?.message ||
          "Gửi email khôi phục mật khẩu thất bại, vui lòng thử lại."
      );
    }
  };

  return (
    <div
      className="p-4"
      style={{ maxWidth: "400px", border: "none" }}
    >
      <div className="card-body">
        <h2 className="custom-form-heading">
          Quên mật khẩu{" "}
          <FontAwesomeIcon
            icon={faUnlock}
            className="small custom-text-primary"
          />
        </h2>
        <p className="custom-subtitle">Tạo mật khẩu mới.</p>

        <div className="alert alert-info">
          <p>Bình tĩnh...</p>
          <p>
            Chúng tôi sẽ giúp bạn tạo lại mật khẩu mới trong vòng 1 nốt nhạc,
            miễn bạn còn nhớ email mình dùng để đăng ký.
          </p>
          <p>Quên luôn địa chỉ email mới là bi kịch :(</p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}
        {message && <div className="alert alert-success">{message}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label
              htmlFor="forgotEmail"
              className="form-label"
            >
              Email <span className="text-danger bold">*</span>
            </label>
            <div className="input-group">
              <input
                type="email"
                id="forgotEmail"
                className={`form-control ${emailError ? "is-invalid" : ""}`}
                placeholder="Nhập email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  setEmailError(""); // Xóa lỗi khi nhập lại
                }}
                onBlur={handleBlur}
                required
              />
              <span className="input-group-text">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="custom-text-gray"
                />
              </span>
            </div>
            {emailError && (
              <div className="invalid-feedback d-block">{emailError}</div>
            )}
          </div>

          <button
            type="submit"
            className="custom-btn-submit"
          >
            GỬI TÔI HƯỚNG DẪN KHÔI PHỤC
          </button>

          <div className="text-center mt-2">
            <span>Quay lại </span>
            <Link
              to="/login"
              className="text-decoration-none custom-link"
            >
              đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ForgotPasswordForm;
