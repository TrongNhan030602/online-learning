import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import AdminLayout from "../layouts/AdminLayout";

// Lazy load các trang
const AdminCourses = lazy(() => import("@/pages/admin/Courses/AdminCourses"));
const CourseDetail = lazy(() => import("@/pages/admin/Courses/CourseDetail"));
const AdminProgress = lazy(() => import("@/pages/admin/AdminProgress"));

const AdminUsers = lazy(() => import("@/pages/admin/Users/AdminUsers"));
const UserDetail = lazy(() => import("@/pages/admin/Users/UserDetail"));

const AdminBlogs = lazy(() => import("@/pages/admin/Blogs/AdminBlogs"));
const BlogDetailPage = lazy(() => import("@/pages/admin/Blogs/BlogDetailPage"));
const AdminFaqs = lazy(() => import("@/pages/admin/Faqs/AdminFaqs"));
const FaqDetail = lazy(() => import("@/pages/admin/Faqs/FaqDetail"));
const AdminProfile = lazy(() => import("@/pages/admin/AdminProfile"));
const AdminNotifications = lazy(() =>
  import("@/pages/admin/Notifications/AdminNotifications")
);

const AdminDisciplineScores = lazy(() =>
  import("@/pages/admin/DisciplineScores/AdminDisciplineScores")
);
const AdminEnterDisciplineScores = lazy(() =>
  import("@/pages/admin/DisciplineScores/AdminEnterDisciplineScores")
);

const AdminTrainingPrograms = lazy(() =>
  import("@/pages/admin/TrainingPrograms/AdminTrainingPrograms")
);
const TrainingProgramDetail = lazy(() =>
  import("@/pages/admin/TrainingPrograms/TrainingProgramDetail")
);
const ProgramStudentsPage = lazy(() =>
  import("@/pages/admin/TrainingPrograms/ProgramStudentsPage")
);

const SemesterDetail = lazy(() =>
  import("@/pages/admin/Semesters/SemesterDetail")
);
const AdminExamSchedules = lazy(() =>
  import("@/pages/admin/ExamSchedules/AdminExamSchedules")
);
const ExamScheduleDetail = lazy(() =>
  import("@/pages/admin/ExamSchedules/ExamScheduleDetail")
);
const AdminReExamRegistrations = lazy(() =>
  import("@/pages/admin/ReExamRegistrations/AdminReExamRegistrations")
);
const ReExamRegistrationDetail = lazy(() =>
  import("@/pages/admin/ReExamRegistrations/ReExamRegistrationDetail")
);

import AdminScores from "@/pages/admin/Scores/AdminScores";

// Component hiển thị khi đang tải
const Loading = () => <div className="text-center">Đang tải...</div>;

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
          path="training-programs"
          element={
            <Suspense fallback={<Loading />}>
              <AdminTrainingPrograms />
            </Suspense>
          }
        />
        <Route
          path="training-programs/:id"
          element={
            <Suspense fallback={<Loading />}>
              <TrainingProgramDetail />
            </Suspense>
          }
        />
        {/* Quản lý Nhập điểm rèn luyện (chỉ nhập) */}
        <Route
          path="training-programs/:programId/discipline-scores"
          element={
            <Suspense fallback={<Loading />}>
              <AdminEnterDisciplineScores />
            </Suspense>
          }
        />

        {/* Quản lý học viện của chương trình */}
        <Route
          path="training-programs/:programId/students"
          element={
            <Suspense fallback={<Loading />}>
              <ProgramStudentsPage />
            </Suspense>
          }
        />

        <Route
          path="semester-detail/:id"
          element={
            <Suspense fallback={<Loading />}>
              <SemesterDetail />
            </Suspense>
          }
        />

        <Route
          path="discipline-scores"
          element={
            <Suspense fallback={<Loading />}>
              <AdminDisciplineScores />
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
          path="users/:id"
          element={
            <Suspense fallback={<Loading />}>
              <UserDetail />
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

        {/* Quản lý lịch thi */}
        <Route
          path="exam-schedules"
          element={
            <Suspense fallback={<Loading />}>
              <AdminExamSchedules />
            </Suspense>
          }
        />

        {/* Chi tiết lịch thi */}
        <Route
          path="exam-schedules/:id"
          element={
            <Suspense fallback={<Loading />}>
              <ExamScheduleDetail />
            </Suspense>
          }
        />
        {/* Duyệt lịch thi lại */}
        <Route
          path="re-exam-registrations"
          element={
            <Suspense fallback={<Loading />}>
              <AdminReExamRegistrations />
            </Suspense>
          }
        />
        <Route
          path="re-exam-registrations/:id"
          element={
            <Suspense fallback={<Loading />}>
              <ReExamRegistrationDetail />
            </Suspense>
          }
        />

        {/* Điểm học tập */}
        <Route
          path="scores"
          element={
            <Suspense fallback={<Loading />}>
              <AdminScores />
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
          path="notifications"
          element={
            <Suspense fallback={<Loading />}>
              <AdminNotifications />
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
          path="blogs/:id"
          element={
            <Suspense fallback={<Loading />}>
              <BlogDetailPage />
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
