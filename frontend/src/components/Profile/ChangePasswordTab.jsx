import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faKey, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "@/hooks/useToast";
import userProfileApi from "@/api/userProfileApi";
import "../../styles/profile/change-password.css";

const ChangePasswordTab = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { addToast } = useToast();
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const { oldPassword, newPassword, confirmPassword } = formData;

    // Kiểm tra mật khẩu cũ
    if (!oldPassword) {
      addToast({
        title: "Lỗi",
        message: "Vui lòng nhập mật khẩu cũ.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    // Kiểm tra độ dài mật khẩu mới
    if (newPassword.length < 8) {
      addToast({
        title: "Lỗi",
        message: "Mật khẩu mới phải có ít nhất 8 ký tự.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    // Kiểm tra mật khẩu mới có chữ hoa, chữ thường, số và ký tự đặc biệt
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(newPassword)) {
      addToast({
        title: "Lỗi",
        message:
          "Mật khẩu mới phải chứa ít nhất một chữ hoa, một chữ thường, một số và một ký tự đặc biệt.",
        type: "error",
        duration: 4000,
      });
      return;
    }

    // Kiểm tra xác nhận mật khẩu
    if (newPassword !== confirmPassword) {
      addToast({
        title: "Lỗi",
        message: "Mật khẩu xác nhận không khớp.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    try {
      await userProfileApi.changePassword({
        current_password: oldPassword,
        new_password: newPassword,
        new_password_confirmation: confirmPassword,
      });

      addToast({
        title: "Thành công",
        message: "Đổi mật khẩu thành công! Bạn sẽ được đăng xuất.",
        type: "success",
        duration: 3000,
      });

      localStorage.removeItem("auth_token");
      navigate("/login");

      setFormData({ oldPassword: "", newPassword: "", confirmPassword: "" });
    } catch (error) {
      console.error("Đổi mật khẩu thất bại:", error);
      addToast({
        title: "Lỗi",
        message: "Đã có lỗi xảy ra khi đổi mật khẩu.",
        type: "error",
        duration: 3000,
      });
    }
  };

  return (
    <div className="change-password">
      <h3 className="change-password__title">Đổi Mật Khẩu</h3>
      <form
        onSubmit={handleSubmit}
        className="change-password__form"
      >
        <div className="change-password__input-group">
          <FontAwesomeIcon
            icon={faLock}
            className="change-password__icon"
          />
          <input
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            placeholder="Mật khẩu cũ"
            required
            className="change-password__input"
          />
        </div>

        <div className="change-password__input-group">
          <FontAwesomeIcon
            icon={faKey}
            className="change-password__icon"
          />
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Mật khẩu mới"
            required
            className="change-password__input"
          />
        </div>

        <div className="change-password__input-group">
          <FontAwesomeIcon
            icon={faCheck}
            className="change-password__icon"
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Xác nhận mật khẩu mới"
            required
            className="change-password__input"
          />
        </div>

        <button
          type="submit"
          className="change-password__btn-submit"
        >
          Đổi mật khẩu
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordTab;
