import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminCourses from "../pages/admin/AdminCourses";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminLessons from "../pages/admin/AdminLessons";
import AdminProgress from "../pages/admin/AdminProgress";

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<AdminLayout />}
      >
        <Route
          path="courses"
          element={<AdminCourses />}
        />
        <Route
          path="users"
          element={<AdminUsers />}
        />
        <Route
          path="lessons"
          element={<AdminLessons />}
        />
        <Route
          path="progress"
          element={<AdminProgress />}
        />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
