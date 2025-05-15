import { useState, useCallback } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faStreetView,
  faEnvelope,
  faKey,
} from "@fortawesome/free-solid-svg-icons";
import { validateEmail, validatePassword } from "@/utils/auth-validate";
import { useAuth } from "@/hooks/useAuth";
import "../../styles/authForm.css";

const LoginForm = () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleBlur = useCallback((field, value) => {
    const errorMsg =
      field === "email" ? validateEmail(value) : validatePassword(value);
    setErrors((prev) => ({ ...prev, [field]: errorMsg }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (emailError || passwordError) {
      setErrors({ email: emailError, password: passwordError });
      return;
    }

    setLoading(true);
    try {
      const response = await login(email, password);
      navigate(response.data.role === "admin" ? "/admin" : "/student");
    } catch (err) {
      console.error("Login failed", err);
      setErrors((prev) => ({
        ...prev,
        form: "Email hoặc mật khẩu không đúng.",
      }));
    } finally {
      setLoading(false);
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
            {errors.email && (
              <div className="invalid-feedback d-block">{errors.email}</div>
            )}
          </div>

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
                autoComplete="current-password"
              />
              <span className="input-group-text">
                <FontAwesomeIcon
                  icon={faKey}
                  className="custom-text-gray"
                />
              </span>
            </div>
            {errors.password && (
              <div className="invalid-feedback d-block">{errors.password}</div>
            )}
          </div>

          <button
            type="submit"
            className="custom-btn-submit"
            disabled={loading}
          >
            {loading ? "Đang đăng nhập..." : "ĐĂNG NHẬP"}
          </button>

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
