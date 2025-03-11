import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminCourses from "../pages/admin/AdminCourses";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminProgress from "../pages/admin/AdminProgress";
import CourseDetail from "../pages/admin/CourseDetail";
import AdminLessonDetail from "../pages/admin/AdminLessonDetail";

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
          path="courses/:id"
          element={<CourseDetail />}
        />
        <Route
          path="courses/:courseId/lessons/:lessonId"
          element={<AdminLessonDetail />}
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
