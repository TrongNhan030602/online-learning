import { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faImage,
  faEdit,
  faLock,
} from "@fortawesome/free-solid-svg-icons";
import { useUser } from "../../hooks/useUser";
import { useToast } from "../../hooks/useToast";
import { getStorageUrl } from "../../utils/getStorageUrl";
import "../../styles/profile/admin-profile.css";
import ProfileTab from "../../components/Profile/ProfileTab";
import EditProfileTab from "../../components/Profile/EditProfileTab";
import ChangeAvatarTab from "../../components/Profile/ChangeAvatarTab";
import ChangePasswordTab from "../../components/Profile/ChangePasswordTab";
import userApi from "../../api/userApi";

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
          <li
            onClick={() => setActiveTab("profile")}
            className={activeTab === "profile" ? "active" : ""}
          >
            <FontAwesomeIcon icon={faUser} /> Quản lý Tài khoản
          </li>
          <li
            onClick={() => setActiveTab("edit")}
            className={activeTab === "edit" ? "active" : ""}
          >
            <FontAwesomeIcon icon={faEdit} /> Sửa hồ sơ
          </li>
          <li
            onClick={() => setActiveTab("change-avatar")}
            className={activeTab === "change-avatar" ? "active" : ""}
          >
            <FontAwesomeIcon icon={faImage} /> Đổi hình đại diện
          </li>
          <li
            onClick={() => setActiveTab("change-password")}
            className={activeTab === "change-password" ? "active" : ""}
          >
            <FontAwesomeIcon icon={faLock} /> Đổi mật khẩu
          </li>
        </ul>
      </div>
      <div className="admin-profile-content">{renderTabContent()}</div>
    </div>
  );
};

export default AdminProfile;
