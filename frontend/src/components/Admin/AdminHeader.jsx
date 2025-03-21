import { NavLink } from "react-router-dom";
import LogoutButton from "../Auth/LogoutButton";
import { useUser } from "../../hooks/useUser"; // ✅ Import useUser
import { getStorageUrl } from "../../utils/getStorageUrl"; // Import hàm xử lý URL
import "../../styles/admin-header.css";
import PropTypes from "prop-types";

const AdminHeader = ({ title }) => {
  const { user } = useUser(); // ✅ Lấy user từ Context

  // Tránh lỗi khi `user` chưa tải xong
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
          className="btn admin__user-btn dropdown-toggle"
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
            {`${user.first_name} ${user.last_name}`}
          </span>
        </button>
        <ul
          className="dropdown-menu dropdown-menu-end"
          aria-labelledby="adminUserMenu"
        >
          <li>
            <NavLink
              className="dropdown-item"
              to="/admin/profile"
            >
              Cập nhật thông tin
            </NavLink>
          </li>
          <li>
            <LogoutButton className="dropdown-item" />
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
