import { useEffect } from "react";
import { NavLink } from "react-router-dom";
import PropTypes from "prop-types";
import LogoutButton from "../Auth/LogoutButton";
import { useUser } from "../../hooks/useUser"; // ✅ Import useUser
import { getStorageUrl } from "../../utils/getStorageUrl"; // Import hàm xử lý URL
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser, faCaretDown } from "@fortawesome/free-solid-svg-icons"; // Import icon đúng

import "../../styles/admin-header.css";

const AdminHeader = ({ title }) => {
  const { user, loading, updateUser } = useUser();

  useEffect(() => {
    if (!user && !loading) {
      updateUser(); // Gọi lại hàm updateUser khi user chưa có hoặc đã tải xong
    }
  }, [user, loading, updateUser]);

  // Tránh lỗi khi không có user
  if (!user) {
    return (
      <header className="admin__header">
        <div className="admin__header-left">
          <span className="admin__header-title">{title}</span>
        </div>
        <div className="admin__header-center">
          <input
            type="text"
            className="form-control admin__search-input"
            placeholder="Tìm kiếm..."
          />
        </div>
        <div className="admin__header-right">
          <span className="admin__user-loading">Đang tải...</span>
        </div>
      </header>
    );
  }

  // Lấy URL avatar
  const avatarUrl = user.avatar
    ? getStorageUrl(user.avatar) // Sử dụng hàm getStorageUrl()
    : "/assets/img/default-avatar.jpg"; // Ảnh mặc định

  return (
    <header className="admin__header">
      <div className="admin__header-left">
        <span className="admin__header-title">{title}</span>
      </div>
      <div className="admin__header-center">
        <input
          type="text"
          className="form-control admin__search-input"
          placeholder="Tìm kiếm..."
        />
      </div>
      <div className="admin__header-right dropdown">
        <button
          className="btn admin__user-btn "
          type="button"
          id="adminUserMenu"
          data-bs-toggle="dropdown"
          aria-expanded="false"
        >
          <img
            src={avatarUrl}
            alt="Avatar"
            className="admin__user-avatar"
          />
          <span className="admin__user-name">
            {user.first_name && user.last_name
              ? `${user.first_name} ${user.last_name}`
              : user.username}
          </span>
          <FontAwesomeIcon
            icon={faCaretDown}
            className="admin__user-dropdown-icon"
          />
        </button>

        <ul
          className="dropdown-menu dropdown-menu-end"
          aria-labelledby="adminUserMenu"
        >
          <li>
            <NavLink
              className={({ isActive }) =>
                isActive ? "dropdown-item active" : "dropdown-item"
              }
              to="/admin/profile"
            >
              <FontAwesomeIcon
                icon={faUser}
                className="dropdown-item-icon"
              />
              Cập nhật thông tin
            </NavLink>
          </li>
          <li>
            <div className="dropdown-divider"></div>
          </li>
          <li>
            <LogoutButton className="dropdown-item">Đăng xuất</LogoutButton>
          </li>
        </ul>
      </div>
    </header>
  );
};

AdminHeader.propTypes = {
  title: PropTypes.string.isRequired,
};

export default AdminHeader;
