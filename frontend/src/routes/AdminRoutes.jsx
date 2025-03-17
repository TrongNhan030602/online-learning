import { Routes, Route } from "react-router-dom";
import AdminLayout from "../layouts/AdminLayout";
import AdminCourses from "../pages/admin/Courses/AdminCourses";
import CourseDetail from "../pages/admin/Courses/CourseDetail";
import AdminUsers from "../pages/admin/AdminUsers";
import AdminProgress from "../pages/admin/AdminProgress";
import AdminLessonDetail from "../pages/admin/Lessons/AdminLessonDetail";
import AdminBlogs from "../pages/admin/Blogs/AdminBlogs";
// import AdminBlogDetail from "../pages/admin/Blogs/AdminBlogDetail";
import AdminFaqs from "../pages/admin/Faqs/AdminFaqs";
import FaqDetail from "../pages/admin/Faqs/FaqDetail";
import AdminCoupons from "../pages/admin/CouPon/AdminCouPon";
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
        <Route
          path="blogs"
          element={<AdminBlogs />}
        />
        {/* <Route
          path="blogs/:id"
          element={<AdminBlogDetail />}
        /> */}

        <Route
          path="/faqs"
          element={<AdminFaqs />}
        />
        <Route
          path="faqs/:id"
          element={<FaqDetail />}
        />

        {/* Route cho CouPon */}
        <Route
          path="coupons"
          element={<AdminCoupons />}
        />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
