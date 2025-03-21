import { useState } from "react";

const EditProfileTab = () => {
  const [profile, setProfile] = useState({
    fullName: "Admin Name",
    email: "admin@example.com",
    phone: "0123456789",
    position: "Administrator",
  });

  const handleChange = (e) => {
    setProfile({ ...profile, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Cập nhật hồ sơ:", profile);
  };

  return (
    <div className="profile-tab">
      <h3>Chỉnh sửa hồ sơ</h3>
      <form
        onSubmit={handleSubmit}
        className="form-horizontal"
      >
        <div className="form-group">
          <label>Họ và tên</label>
          <input
            type="text"
            name="fullName"
            value={profile.fullName}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Email</label>
          <input
            type="email"
            name="email"
            value={profile.email}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Số điện thoại</label>
          <input
            type="text"
            name="phone"
            value={profile.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Chức vụ</label>
          <input
            type="text"
            name="position"
            value={profile.position}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Lưu thay đổi</button>
      </form>
    </div>
  );
};

export default EditProfileTab;
