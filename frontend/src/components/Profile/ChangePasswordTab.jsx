import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faLock, faKey, faCheck } from "@fortawesome/free-solid-svg-icons";
import { useToast } from "../../hooks/useToast"; // Đảm bảo bạn có Toast hook để thông báo
import userApi from "../../api/userApi"; // Đảm bảo API đổi mật khẩu được import đúng
import { useNavigate } from "react-router-dom"; // Dùng để điều hướng về trang đăng nhập
import "../../styles/profile/change-password.css";

const ChangePasswordTab = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });
  const { addToast } = useToast(); // Sử dụng hook thông báo
  const navigate = useNavigate(); // Dùng để điều hướng trang

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Kiểm tra xác nhận mật khẩu
    if (formData.newPassword !== formData.confirmPassword) {
      addToast({
        title: "Lỗi",
        message: "Mật khẩu xác nhận không khớp.",
        type: "error",
        duration: 3000,
      });
      return;
    }

    try {
      await userApi.changePassword({
        current_password: formData.oldPassword,
        new_password: formData.newPassword,
        new_password_confirmation: formData.confirmPassword,
      });

      // Thông báo thành công
      addToast({
        title: "Thành công",
        message: "Đổi mật khẩu thành công! Bạn sẽ được đăng xuất.",
        type: "success",
        duration: 3000,
      });

      // Đăng xuất
      localStorage.removeItem("auth_token"); // Xóa token (hoặc xóa thông tin đăng nhập từ nơi bạn lưu trữ token)
      navigate("/login"); // Điều hướng người dùng về trang đăng nhập

      // Reset form
      setFormData({
        oldPassword: "",
        newPassword: "",
        confirmPassword: "",
      });
    } catch (error) {
      // Xử lý lỗi
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
      <h3>Đổi Mật Khẩu</h3>
      <form
        onSubmit={handleSubmit}
        className="password-form"
      >
        <div className="input-group">
          <FontAwesomeIcon
            icon={faLock}
            className="icon"
          />
          <input
            type="password"
            name="oldPassword"
            value={formData.oldPassword}
            onChange={handleChange}
            placeholder="Mật khẩu cũ"
            required
          />
        </div>

        <div className="input-group">
          <FontAwesomeIcon
            icon={faKey}
            className="icon"
          />
          <input
            type="password"
            name="newPassword"
            value={formData.newPassword}
            onChange={handleChange}
            placeholder="Mật khẩu mới"
            required
          />
        </div>

        <div className="input-group">
          <FontAwesomeIcon
            icon={faCheck}
            className="icon"
          />
          <input
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
            placeholder="Xác nhận mật khẩu mới"
            required
          />
        </div>

        <button
          type="submit"
          className="btn-submit"
        >
          Đổi mật khẩu
        </button>
      </form>
    </div>
  );
};

export default ChangePasswordTab;
