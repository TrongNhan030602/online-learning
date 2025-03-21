import { useState } from "react";

const ChangePasswordTab = () => {
  const [passwords, setPasswords] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setPasswords({ ...passwords, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (passwords.newPassword !== passwords.confirmPassword) {
      alert("Mật khẩu mới không khớp!");
      return;
    }
    console.log("Đổi mật khẩu thành công:", passwords);
  };

  return (
    <div className="profile-tab">
      <h3>Đổi mật khẩu</h3>
      <form
        onSubmit={handleSubmit}
        className="form-horizontal"
      >
        <div className="form-group">
          <label>Mật khẩu hiện tại</label>
          <input
            type="password"
            name="currentPassword"
            value={passwords.currentPassword}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Mật khẩu mới</label>
          <input
            type="password"
            name="newPassword"
            value={passwords.newPassword}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Xác nhận mật khẩu</label>
          <input
            type="password"
            name="confirmPassword"
            value={passwords.confirmPassword}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Cập nhật mật khẩu</button>
      </form>
    </div>
  );
};

export default ChangePasswordTab;
