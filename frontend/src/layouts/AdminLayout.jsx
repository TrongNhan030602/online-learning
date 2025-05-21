import { Outlet, useLocation } from "react-router-dom";
import "@/styles/admin.css";
import AdminSidebar from "@/components/Admin/AdminSidebar";
import AdminHeader from "@/components/Admin/AdminHeader";

const AdminLayout = () => {
  const location = useLocation();

  // Định nghĩa tiêu đề cho các route
  const routeTitles = {
    "/admin": "Dashboard",
    "/admin/users": "Quản lý người dùng",
    "/admin/courses": "Quản lý môn học",
    "/admin/training-programs": "Quản lý CTĐT",
    "/admin/discipline-scores": "Quản lý ĐRL",
    "/admin/scores": "Quản lý Điểm học tập",
    "/admin/exam-schedules": "Quản lý lịch thi",
    "/admin/re-exam-registrations": "Duyệt thi lại",
    "/admin/faqs": "Quản lý FAQs",
    "/admin/blogs": "Quản lý blog",
    "/admin/progress": "Quản lý tiến độ",
  };

  // Lấy tiêu đề phù hợp với phần đầu của URL
  const getTitle = () => {
    const currentPath = location.pathname;
    const matchedKey = Object.keys(routeTitles)
      .sort((a, b) => b.length - a.length) // Ưu tiên match path dài hơn
      .find((key) => currentPath.startsWith(key));
    return routeTitles[matchedKey] || "Dashboard";
  };

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
