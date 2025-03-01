import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../contexts/useAuth";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStreetView,
  faEnvelope,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/authForm.css";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({ email: "", password: "", form: "" });

  const validateEmail = (value) => {
    if (!value) return "Email không được để trống.";
    if (typeof value !== "string") return "Email phải là một chuỗi.";
    if (value.length > 255) return "Email không được vượt quá 255 ký tự.";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) return "Email không hợp lệ.";
    return "";
  };

  const validatePassword = (value) => {
    if (!value) return "Mật khẩu không được để trống.";
    if (typeof value !== "string") return "Mật khẩu phải là một chuỗi.";
    if (value.length < 8) return "Mật khẩu phải có ít nhất 8 ký tự.";
    if (value.length > 32) return "Mật khẩu không được vượt quá 32 ký tự.";
    return "";
  };

  const handleBlur = (field, value) => {
    let errorMsg = "";
    if (field === "email") errorMsg = validateEmail(value);
    if (field === "password") errorMsg = validatePassword(value);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);
    const newErrors = { email: emailError, password: passwordError, form: "" };
    setErrors(newErrors);

    if (emailError || passwordError) return;

    try {
      await login(email, password);
      navigate("/profile");
    } catch (err) {
      console.error("Login failed", err);
      setErrors((prevErrors) => ({
        ...prevErrors,
        form: "Email hoặc mật khẩu không đúng.",
      }));
    }
  };

  return (
    <div
      className="p-4"
      style={{ maxWidth: "400px", border: "none" }}
    >
      <div className="card-body">
        <h2 className="custom-form-heading">
          ĐĂNG NHẬP
          <FontAwesomeIcon
            icon={faStreetView}
            className="small custom-text-primary ms-2"
          />
        </h2>
        <p className="custom-subtitle">Chào mừng bạn quay lại.</p>

        {errors.form && <div className="alert alert-danger">{errors.form}</div>}

        <form onSubmit={handleSubmit}>
          {/* Email */}
          <div className="mb-3">
            <label
              htmlFor="loginEmail"
              className="form-label"
            >
              Email <span className="text-danger bold">*</span>
            </label>
            <div className="input-group">
              <input
                type="email"
                id="loginEmail"
                className={`form-control ${errors.email ? "is-invalid" : ""}`}
                placeholder="Nhập email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                onBlur={() => handleBlur("email", email)}
                required
              />
              <span className="input-group-text">
                <FontAwesomeIcon
                  icon={faEnvelope}
                  className="custom-text-gray"
                />
              </span>
            </div>
            {/* Đưa invalid-feedback ra ngoài input-group */}
            {errors.email && (
              <div className="invalid-feedback d-block">{errors.email}</div>
            )}
          </div>

          {/* Mật khẩu */}
          <div className="mb-3">
            <label
              htmlFor="loginPassword"
              className="form-label"
            >
              Mật khẩu <span className="text-danger bold">*</span>
            </label>
            <div className="input-group">
              <input
                type="password"
                id="loginPassword"
                className={`form-control ${
                  errors.password ? "is-invalid" : ""
                }`}
                placeholder="Nhập mật khẩu"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                onBlur={() => handleBlur("password", password)}
                required
              />
              <span className="input-group-text">
                <FontAwesomeIcon
                  icon={faKey}
                  className="custom-text-gray"
                />
              </span>
            </div>
            {/* Đưa invalid-feedback ra ngoài input-group */}
            {errors.password && (
              <div className="invalid-feedback d-block">{errors.password}</div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="custom-btn-submit"
          >
            ĐĂNG NHẬP
          </button>

          {/* Quên mật khẩu */}
          <div className="text-center mt-3">
            <span className="me-1 text-muted">Quên mật khẩu?</span>
            <Link
              to="/forgot-password"
              className="text-decoration-none custom-link"
            >
              Khôi phục
            </Link>
            <span> ngay.</span>
          </div>

          {/* Đăng ký */}
          <div className="text-center mt-2">
            <span className="text-muted">Chưa có tài khoản? </span>
            <Link
              to="/register"
              className="text-decoration-none custom-link"
            >
              Đăng ký
            </Link>
            <span> mới.</span>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LoginForm;
