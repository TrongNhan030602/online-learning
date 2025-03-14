import { Outlet, Link, useLocation, matchPath } from "react-router-dom";
import "../styles/admin.css";
import LogoutButton from "../components/Auth/LogoutButton";
const AdminLayout = () => {
  const location = useLocation();

  // Định nghĩa các route và tiêu đề tương ứng
  const routeTitles = {
    "/admin/courses": "Quản lý khóa học",
    "/admin/faqs": "Quản lý faqs",
    "/admin/users": "Quản lý người dùng",
    "/admin/lessons": "Quản lý bài học",
    "/admin/progress": "Quản lý tiến độ",
    "/admin/blogs": "Quản lý blog",
    "/admin": "Dashboard",
  };

  // Hàm trả về tiêu đề dựa trên URL hiện tại (matchPath để match các route con)
  const getTitle = () => {
    const { pathname } = location;
    for (const [path, title] of Object.entries(routeTitles)) {
      if (matchPath({ path, end: false }, pathname)) {
        return title;
      }
    }
    return "Dashboard";
  };

  return (
    <div className="admin">
      {/* Sidebar */}
      <aside className="admin__sidebar">
        <div className="admin__sidebar-top">
          <Link
            className="admin__logo"
            to="/admin"
          >
            <img
              src="https://www.brandcamp.asia/build/img/bc-logo@2x.png"
              alt="Logo"
              className="admin__logo-img"
            />
          </Link>
        </div>
        <nav className="admin__nav">
          <ul className="admin__nav-list">
            <li className="admin__nav-item">
              <Link
                className="admin__nav-link"
                to="/admin"
              >
                Dashboard
              </Link>
            </li>
            <li className="admin__nav-item">
              <Link
                className="admin__nav-link"
                to="/admin/courses"
              >
                Quản lý khóa học
              </Link>
            </li>
            <li className="admin__nav-item">
              <Link
                className="admin__nav-link"
                to="/admin/users"
              >
                Quản lý người dùng
              </Link>
            </li>
            <li className="admin__nav-item">
              <Link
                className="admin__nav-link"
                to="/admin/progress"
              >
                Quản lý tiến độ
              </Link>
            </li>
            <li className="admin__nav-item">
              <Link
                className="admin__nav-link"
                to="/admin/blogs"
              >
                Quản lý blog
              </Link>
            </li>
            <li className="admin__nav-item">
              <Link
                className="admin__nav-link"
                to="/admin/faqs"
              >
                Quản lý Faqs
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {/* Main content area */}
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
                <Link
                  className="dropdown-item"
                  to="/admin/profile"
                >
                  Cập nhật thông tin
                </Link>
              </li>
              <li>
                <LogoutButton lassName="dropdown-item" />
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
