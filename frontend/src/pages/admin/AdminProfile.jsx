/* eslint-disable react/prop-types */
import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faImage,
  faEdit,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../hooks/useUser";
import userApi from "../../api/userApi";
import { useToast } from "../../hooks/useToast";
import { getStorageUrl } from "../../utils/getStorageUrl";
import "../../styles/admin-profile.css";

const AdminProfile = () => {
  const { user, updateUser } = useUser();
  const [activeTab, setActiveTab] = useState("profile");
  const { addToast } = useToast();

  const handleUpdateProfile = async (formData) => {
    try {
      await userApi.updateProfile(formData);
      addToast({
        title: "Thành công",
        message: "Cập nhật hồ sơ thành công!",
        type: "success",
        duration: 3000,
      });
      updateUser();
    } catch (error) {
      console.error("Error updating profile:", error);
      addToast({
        title: "Lỗi",
        message: "Đã có lỗi xảy ra khi cập nhật hồ sơ.",
        type: "error",
        duration: 3000,
      });
    }
  };

  const handleAvatarChange = async (event) => {
    const formData = new FormData();
    formData.append("avatar", event.target.files[0]);

    try {
      await userApi.updateAvatar(formData);
      addToast({
        title: "Thành công",
        message: "Cập nhật avatar thành công!",
        type: "success",
        duration: 3000,
      });
      updateUser();
    } catch (error) {
      console.error("Error updating avatar:", error);
      addToast({
        title: "Lỗi",
        message: "Đã có lỗi xảy ra khi cập nhật avatar.",
        type: "error",
        duration: 3000,
      });
    }
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab profile={user} />;
      case "edit":
        return (
          <EditProfileTab
            profile={user}
            onSubmit={handleUpdateProfile}
          />
        );
      case "change-avatar":
        return <ChangeAvatarTab onChange={handleAvatarChange} />;
      case "change-password":
        return <ChangePasswordTab />;
      default:
        return <ProfileTab profile={user} />;
    }
  };

  return (
    <div className="admin-profile-container">
      <div className="admin-profile-sidebar">
        <div className="avatar-container">
          <img
            src={getStorageUrl(user?.avatar)}
            alt="Avatar"
            className="avatar-sidebar"
          />
        </div>
        <ul>
          <li onClick={() => setActiveTab("profile")}>
            <FontAwesomeIcon icon={faUser} /> Quản lý Tài khoản
          </li>
          <li onClick={() => setActiveTab("edit")}>
            <FontAwesomeIcon icon={faEdit} /> Sửa hồ sơ
          </li>
          <li onClick={() => setActiveTab("change-avatar")}>
            <FontAwesomeIcon icon={faImage} /> Đổi hình đại diện
          </li>
          <li onClick={() => setActiveTab("change-password")}>
            <FontAwesomeIcon icon={faLock} /> Đổi mật khẩu
          </li>
        </ul>
      </div>

      <div className="admin-profile-content">{renderTabContent()}</div>
    </div>
  );
};

const ProfileTab = ({ profile }) => {
  if (!profile) return <p>Đang tải hồ sơ...</p>;

  return (
    <div>
      <h3>Hồ sơ</h3>
      <div className="profile-info">
        <p>
          Họ và tên: {profile?.first_name} {profile?.last_name}
        </p>
        <p>Tên đăng nhập: {profile?.username}</p>
        <p>Email: {profile?.email}</p>
        <p>Số điện thoại: {profile?.phone}</p>
        <p>Địa chỉ: {profile?.address}</p>
        <p>Giới tính: {profile?.gender}</p>
        <p>Chức vụ: {profile?.position}</p>
        <p>Giới thiệu bản thân: {profile?.info}</p>
      </div>
    </div>
  );
};

const EditProfileTab = ({ profile, onSubmit }) => {
  const [formData, setFormData] = useState({
    first_name: profile?.first_name || "",
    last_name: profile?.last_name || "",
    phone: profile?.phone || "",
    address: profile?.address || "",
    gender: profile?.gender || "",
    position: profile?.position || "",
    info: profile?.info || "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <div>
      <h3>Sửa Hồ Sơ</h3>
      <form
        onSubmit={handleSubmit}
        className="form-horizontal"
      >
        <div className="form-group">
          <label>Họ:</label>
          <input
            type="text"
            name="first_name"
            value={formData.first_name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Tên:</label>
          <input
            type="text"
            name="last_name"
            value={formData.last_name}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Số điện thoại:</label>
          <input
            type="text"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Địa chỉ:</label>
          <input
            type="text"
            name="address"
            value={formData.address}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Giới tính:</label>
          <select
            name="gender"
            value={formData.gender}
            onChange={handleChange}
          >
            <option value="male">Nam</option>
            <option value="female">Nữ</option>
            <option value="other">Khác</option>
          </select>
        </div>
        <div className="form-group">
          <label>Chức vụ:</label>
          <input
            type="text"
            name="position"
            value={formData.position}
            onChange={handleChange}
          />
        </div>
        <div className="form-group">
          <label>Giới thiệu bản thân:</label>
          <textarea
            name="info"
            value={formData.info}
            onChange={handleChange}
          />
        </div>
        <button type="submit">Lưu thay đổi</button>
      </form>
    </div>
  );
};

const ChangeAvatarTab = () => {
  const { updateUser } = useUser();
  const { addToast } = useToast();

  const handleAvatarChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("avatar", file);

    try {
      await userApi.updateAvatar(formData);
      addToast({
        title: "Thành công",
        message: "Cập nhật avatar thành công!",
        type: "success",
        duration: 3000,
      });
      updateUser();
    } catch (error) {
      console.error("❌ Error updating avatar:", error);
      addToast({
        title: "Lỗi",
        message: "Không thể cập nhật avatar!",
        type: "error",
        duration: 3000,
      });
    }
  };

  return (
    <div>
      <h3>Đổi Hình Đại Diện</h3>
      <input
        type="file"
        accept="image/*"
        onChange={handleAvatarChange}
        className="avatar-upload-input"
      />
    </div>
  );
};

const ChangePasswordTab = () => (
  <div>
    <h3>Đổi Mật Khẩu</h3>
    <form>
      <input
        type="password"
        placeholder="Mật khẩu cũ"
      />
      <input
        type="password"
        placeholder="Mật khẩu mới"
      />
      <input
        type="password"
        placeholder="Xác nhận mật khẩu mới"
      />
      <button type="submit">Đổi mật khẩu</button>
    </form>
  </div>
);

export default AdminProfile;
