import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import AdminLayout from "../layouts/AdminLayout";

// Lazy load các trang
const AdminCourses = lazy(() => import("../pages/admin/Courses/AdminCourses"));
const CourseDetail = lazy(() => import("../pages/admin/Courses/CourseDetail"));
const AdminUsers = lazy(() => import("../pages/admin/AdminUsers"));
const AdminProgress = lazy(() => import("../pages/admin/AdminProgress"));
const AdminLessonDetail = lazy(() =>
  import("../pages/admin/Lessons/AdminLessonDetail")
);
const AdminBlogs = lazy(() => import("../pages/admin/Blogs/AdminBlogs"));
const AdminFaqs = lazy(() => import("../pages/admin/Faqs/AdminFaqs"));
const FaqDetail = lazy(() => import("../pages/admin/Faqs/FaqDetail"));
const AdminCoupons = lazy(() => import("../pages/admin/CouPon/AdminCouPon"));
const AdminChat = lazy(() => import("../pages/admin/Chat/AdminChat"));
const AdminProfile = lazy(() => import("../pages/admin/AdminProfile"));

// Component hiển thị khi đang tải
const Loading = () => <div>Đang tải...</div>;

const AdminRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<AdminLayout />}
      >
        <Route
          path="courses"
          element={
            <Suspense fallback={<Loading />}>
              <AdminCourses />
            </Suspense>
          }
        />
        <Route
          path="users"
          element={
            <Suspense fallback={<Loading />}>
              <AdminUsers />
            </Suspense>
          }
        />
        <Route
          path="courses/:id"
          element={
            <Suspense fallback={<Loading />}>
              <CourseDetail />
            </Suspense>
          }
        />
        <Route
          path="courses/:courseId/lessons/:lessonId"
          element={
            <Suspense fallback={<Loading />}>
              <AdminLessonDetail />
            </Suspense>
          }
        />
        <Route
          path="progress"
          element={
            <Suspense fallback={<Loading />}>
              <AdminProgress />
            </Suspense>
          }
        />
        <Route
          path="blogs"
          element={
            <Suspense fallback={<Loading />}>
              <AdminBlogs />
            </Suspense>
          }
        />
        <Route
          path="faqs"
          element={
            <Suspense fallback={<Loading />}>
              <AdminFaqs />
            </Suspense>
          }
        />
        <Route
          path="faqs/:id"
          element={
            <Suspense fallback={<Loading />}>
              <FaqDetail />
            </Suspense>
          }
        />
        <Route
          path="coupons"
          element={
            <Suspense fallback={<Loading />}>
              <AdminCoupons />
            </Suspense>
          }
        />
        <Route
          path="chats"
          element={
            <Suspense fallback={<Loading />}>
              <AdminChat />
            </Suspense>
          }
        />
        <Route
          path="profile"
          element={
            <Suspense fallback={<Loading />}>
              <AdminProfile />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};

export default AdminRoutes;
