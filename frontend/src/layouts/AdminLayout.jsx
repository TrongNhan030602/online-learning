import { Outlet, useLocation } from "react-router-dom";
import "../styles/admin.css";
import AdminSidebar from "../components/Admin/AdminSidebar";
import AdminHeader from "../components/Admin/AdminHeader";

const AdminLayout = () => {
  const location = useLocation();

  // Định nghĩa tiêu đề cho các route
  const routeTitles = {
    "/admin/courses": "Quản lý khóa học",
    "/admin/faqs": "Quản lý FAQs",
    "/admin/users": "Quản lý người dùng",
    "/admin/lessons": "Quản lý bài học",
    "/admin/progress": "Quản lý tiến độ",
    "/admin/chats": "Quản lý tin nhắn",
    "/admin/blogs": "Quản lý blog",
    "/admin/coupons": "Quản lý mã giảm giá",
    "/admin": "Dashboard",
  };

  // Lấy tiêu đề theo URL hiện tại
  const getTitle = () => routeTitles[location.pathname] || "Dashboard";

  return (
    <div className="admin">
      <AdminSidebar />
      <div className="admin__content">
        <AdminHeader title={getTitle()} />
        <main className="admin__main">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
