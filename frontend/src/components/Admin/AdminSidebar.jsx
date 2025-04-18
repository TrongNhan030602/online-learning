import { NavLink } from "react-router-dom";
import "../../styles/admin-sidebar.css";
import logo from "../../assets/img/bc-logo@2x.webp";
const AdminSidebar = () => {
  return (
    <aside className="admin__sidebar">
      <div className="admin__sidebar-top">
        <NavLink
          className="admin__logo"
          to="/admin"
        >
          <img
            src={logo}
            alt="Logo"
            className="admin__logo-img"
          />
        </NavLink>
      </div>
      <nav className="admin__nav">
        <ul className="admin__nav-list">
          <li className="admin__nav-item">
            <NavLink
              className="admin__nav-link"
              to="/admin"
              end
            >
              Dashboard
            </NavLink>
          </li>
          <li className="admin__nav-item">
            <NavLink
              className="admin__nav-link"
              to="/admin/users"
            >
              Quản lý người dùng
            </NavLink>
          </li>
          <li className="admin__nav-item">
            <NavLink
              className="admin__nav-link"
              to="/admin/courses"
            >
              Quản lý khóa học
            </NavLink>
          </li>
          <li className="admin__nav-item">
            <NavLink
              className="admin__nav-link"
              to="/admin/training-programs"
            >
              Quản lý CTĐT
            </NavLink>
          </li>
          <li className="admin__nav-item">
            <NavLink
              className="admin__nav-link"
              to="/admin/classes"
            >
              Quản lý lớp học
            </NavLink>
          </li>
          <li className="admin__nav-item">
            <NavLink
              className="admin__nav-link"
              to="/admin/blogs"
            >
              Quản lý blog
            </NavLink>
          </li>
          <li className="admin__nav-item">
            <NavLink
              className="admin__nav-link"
              to="/admin/faqs"
            >
              Quản lý FAQs
            </NavLink>
          </li>
          <li className="admin__nav-item">
            <NavLink
              className="admin__nav-link"
              to="/admin/coupons"
            >
              Quản lý mã giảm giá
            </NavLink>
          </li>

          <li className="admin__nav-item">
            <NavLink
              className="admin__nav-link"
              to="/admin/progress"
            >
              Quản lý tiến độ
            </NavLink>
          </li>
          <li className="admin__nav-item">
            <NavLink
              className="admin__nav-link"
              to="/admin/chats"
            >
              Quản lý tin nhắn
            </NavLink>
          </li>
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
