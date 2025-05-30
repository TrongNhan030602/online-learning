import { NavLink } from "react-router-dom";
import "../../styles/admin-sidebar.css";
import logo from "../../assets/img/logo.webp";
const AdminSidebar = () => {
  return (
    <aside className="admin__sidebar">
      <div className="admin__sidebar-top">
        <NavLink
          className="admin__logo"
          to="/admin/training-programs"
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
          {/* <li className="admin__nav-item">
            <NavLink
              className="admin__nav-link"
              to="/admin"
              end
            >
              Dashboard
            </NavLink>
          </li> */}
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
              to="/admin/training-programs"
            >
              Quản lý CTĐT
            </NavLink>
          </li>
          <li className="admin__nav-item">
            <NavLink
              className="admin__nav-link"
              to="/admin/courses"
            >
              Quản lý môn học
            </NavLink>
          </li>
          <li className="admin__nav-item">
            <NavLink
              className="admin__nav-link"
              to="/admin/discipline-scores"
            >
              Quản lý ĐRL
            </NavLink>
          </li>
          <li className="admin__nav-item">
            <NavLink
              className="admin__nav-link"
              to="/admin/scores"
            >
              Quản lý Điểm học tập
            </NavLink>
          </li>
          <li className="admin__nav-item">
            <NavLink
              className="admin__nav-link"
              to="/admin/exam-schedules"
            >
              Quản lý Lịch thi
            </NavLink>
          </li>
          <li className="admin__nav-item">
            <NavLink
              className="admin__nav-link"
              to="/admin/re-exam-registrations"
            >
              Duyệt thi lại
            </NavLink>
          </li>
          <li className="admin__nav-item">
            <NavLink
              className="admin__nav-link"
              to="/admin/notifications"
            >
              Quản lý thông báo
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

          {/* <li className="admin__nav-item">
            <NavLink
              className="admin__nav-link"
              to="/admin/progress"
            >
              Quản lý tiến độ
            </NavLink>
          </li> */}
        </ul>
      </nav>
    </aside>
  );
};

export default AdminSidebar;
