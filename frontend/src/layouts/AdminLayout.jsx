import { Outlet, NavLink, useLocation } from "react-router-dom";
import "../styles/admin.css";
import LogoutButton from "../components/Auth/LogoutButton";

const AdminLayout = () => {
  const location = useLocation();

  // Định nghĩa tiêu đề cho các route
  const routeTitles = {
    "/admin/courses": "Quản lý khóa học",
    "/admin/faqs": "Quản lý FAQs",
    "/admin/users": "Quản lý người dùng",
    "/admin/lessons": "Quản lý bài học",
    "/admin/progress": "Quản lý tiến độ",
    "/admin/blogs": "Quản lý blog",
    "/admin/coupons": "Quản lý mã giảm giá",
    "/admin": "Dashboard",
  };

  // Lấy tiêu đề theo URL hiện tại
  const getTitle = () => {
    const { pathname } = location;
    return routeTitles[pathname] || "Dashboard";
  };

  return (
    <div className="admin">
      {/* Sidebar */}
      <aside className="admin__sidebar">
        <div className="admin__sidebar-top">
          <NavLink
            className="admin__logo"
            to="/admin"
          >
            <img
              src="https://www.brandcamp.asia/build/img/bc-logo@2x.png"
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
                to="/admin/courses"
              >
                Quản lý khóa học
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
                to="/admin/users"
              >
                Quản lý người dùng
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
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <div className="admin__content">
        {/* Header */}
        <header className="admin__header">
          <div className="admin__header-left">
            <span className="admin__header-title">{getTitle()}</span>
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
                src="https://demos.creative-tim.com/argon-dashboard-react/static/media/team-4-800x800.99c612eb.jpg"
                alt="Avatar"
                className="admin__user-avatar"
              />
              <span className="admin__user-name">Jessica Jones</span>
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

        {/* Nội dung chính */}
        <main className="admin__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
