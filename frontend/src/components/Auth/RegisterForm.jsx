import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUserPlus } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/hooks/useAuth";
import { useToast } from "@/hooks/useToast";
import {
  validateName,
  validateEmail,
  validatePassword,
} from "@/utils/auth-validate";
import "../../styles/authForm.css";

const RegisterForm = () => {
  const { addToast } = useToast();
  const { register } = useAuth();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleBlur = (field, value) => {
    let errorMsg = "";
    if (field === "name") errorMsg = validateName(value);
    if (field === "email") errorMsg = validateEmail(value);
    if (field === "password") errorMsg = validatePassword(value);
    setErrors((prevErrors) => ({ ...prevErrors, [field]: errorMsg }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const nameError = validateName(name);
    const emailError = validateEmail(email);
    const passwordError = validatePassword(password);

    if (nameError || emailError || passwordError) {
      setErrors({
        name: nameError,
        email: emailError,
        password: passwordError,
      });
      return;
    }

    try {
      await register(name, email, password);
      addToast({
        title: "Thành công",
        message: "Bạn đã đăng ký thành công!. Hãy tiến hành đăng nhập!!",
        type: "success",
        duration: 3000,
      });
      setTimeout(() => {
        navigate("/login");
      }, 1000);
    } catch (err) {
      console.error("Registration failed", err);
      const serverMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        "Đăng ký thất bại. Vui lòng thử lại.";
      setErrors((prevErrors) => ({ ...prevErrors, form: serverMessage }));
    }
  };

  return (
    <div
      className="p-4"
      style={{ maxWidth: "400px", border: "none" }}
    >
      <div className="card-body">
        <h2 className="custom-form-heading">
          THAM GIA
          <FontAwesomeIcon
            icon={faUserPlus}
            className="small custom-text-primary ms-2"
          />
        </h2>
        <p className="custom-subtitle">Một tài khoản mở ra tất cả tính năng.</p>

        {errors.form && <div className="alert alert-danger">{errors.form}</div>}

        <form onSubmit={handleSubmit}>
          {/* Tên */}
          <div className="mb-3">
            <label
              htmlFor="registerName"
              className="form-label"
            >
              Tên <span className="text-danger bold">*</span>
            </label>
            <input
              type="text"
              id="registerName"
              className={`form-control ${errors.name ? "is-invalid" : ""}`}
              placeholder="Nhập tên"
              value={name}
              onChange={(e) => setName(e.target.value)}
              onBlur={() => handleBlur("name", name)}
              required
            />
            {errors.name && (
              <div className="invalid-feedback">{errors.name}</div>
            )}
          </div>

          {/* Email */}
          <div className="mb-3">
            <label
              htmlFor="registerEmail"
              className="form-label"
            >
              Email <span className="text-danger bold">*</span>
            </label>
            <input
              type="email"
              id="registerEmail"
              className={`form-control ${errors.email ? "is-invalid" : ""}`}
              placeholder="Nhập email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              onBlur={() => handleBlur("email", email)}
              required
            />
            {errors.email && (
              <div className="invalid-feedback">{errors.email}</div>
            )}
          </div>

          {/* Mật khẩu */}
          <div className="mb-3">
            <label
              htmlFor="registerPassword"
              className="form-label"
            >
              Mật khẩu <span className="text-danger bold">*</span>
            </label>
            <input
              type="password"
              id="registerPassword"
              className={`form-control ${errors.password ? "is-invalid" : ""}`}
              placeholder="Nhập mật khẩu"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onBlur={() => handleBlur("password", password)}
              required
            />
            {errors.password && (
              <div className="invalid-feedback">{errors.password}</div>
            )}
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="custom-btn-submit"
          >
            TẠO TÀI KHOẢN
          </button>

          {/* Đăng nhập */}
          <div className="text-center mt-3">
            <span>Đã có tài khoản rồi? </span>
            <Link
              to="/login"
              className="text-decoration-none custom-link"
            >
              Đăng nhập
            </Link>
          </div>
        </form>
      </div>
    </div>
  );
};

export default RegisterForm;
