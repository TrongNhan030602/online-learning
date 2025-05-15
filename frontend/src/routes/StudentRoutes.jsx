import { Routes, Route } from "react-router-dom";
import { lazy, Suspense } from "react";
import StudentLayout from "@/layouts/StudentLayout";
import Loading from "@/components/common/Loading";

// Lazy load các trang

const Blogs = lazy(() => import("@/pages/students/Blogs/Blogs"));
const BlogDetail = lazy(() => import("@/pages/students/Blogs/BlogDetail"));
const StudentProfile = lazy(() => import("@/pages/students/StudentProfile"));
const TrainingProgram = lazy(() => import("@/pages/students/TrainingProgram"));
const StudentDashboard = lazy(() =>
  import("@/pages/students/StudentDashboard/StudentDashboard")
);
const StudentNotifications = lazy(() =>
  import("@/pages/students/StudentNotifications")
);
const StudentChat = lazy(() => import("@/pages/students/StudentChat"));
const CourseLearningPage = lazy(() =>
  import("@/pages/students/MyCourse/CourseLearningPage")
);

// Học vụ
const ExamSchedule = lazy(() =>
  import("@/pages/students/Academic/ExamSchedule")
);
const RoutineResult = lazy(() =>
  import("@/pages/students/Academic/RoutineResult")
);
const LearningResult = lazy(() =>
  import("@/pages/students/Academic/LearningResult")
);
const ExamRegistration = lazy(() =>
  import("@/pages/students/Academic/ExamRegistration")
);

const StudentRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<StudentLayout />}
      >
        {/* Redirect mặc định khi truy cập vào trang chủ */}
        <Route
          index
          element={
            <Suspense
              fallback={
                <Loading
                  text="Đang tải dữ liệu..."
                  size="lg"
                  variant="primary"
                  textVariant="primary"
                />
              }
            >
              <StudentDashboard /> {/* Trang chủ */}
            </Suspense>
          }
        />
        <Route
          path="my-training-program/:id"
          element={
            <Suspense
              fallback={
                <Loading
                  text="Đang tải dữ liệu..."
                  size="lg"
                  variant="primary"
                  textVariant="primary"
                />
              }
            >
              <TrainingProgram />
            </Suspense>
          }
        />

        {/* Blog */}
        <Route
          path="blogs"
          element={
            <Suspense
              fallback={
                <Loading
                  text="Đang tải dữ liệu..."
                  size="lg"
                  variant="primary"
                  textVariant="primary"
                />
              }
            >
              <Blogs />
            </Suspense>
          }
        />
        <Route
          path="blogs/:id"
          element={
            <Suspense
              fallback={
                <Loading
                  text="Đang tải dữ liệu..."
                  size="lg"
                  variant="primary"
                  textVariant="primary"
                />
              }
            >
              <BlogDetail />
            </Suspense>
          }
        />
        {/* Môn  */}
        <Route
          path="my-course/:courseId"
          element={
            <Suspense
              fallback={
                <Loading
                  text="Đang tải trang học..."
                  size="lg"
                  variant="primary"
                  textVariant="primary"
                />
              }
            >
              <CourseLearningPage />
            </Suspense>
          }
        />

        {/* Thông tin cá nhân */}
        <Route
          path="profile"
          element={
            <Suspense
              fallback={
                <Loading
                  text="Đang tải dữ liệu..."
                  size="lg"
                  variant="primary"
                  textVariant="primary"
                />
              }
            >
              <StudentProfile />
            </Suspense>
          }
        />
        {/* Đào tạo */}
        <Route
          path="training-program"
          element={
            <Suspense
              fallback={
                <Loading
                  text="Đang tải dữ liệu..."
                  size="lg"
                  variant="primary"
                  textVariant="primary"
                />
              }
            >
              <TrainingProgram />
            </Suspense>
          }
        />
        {/* Học vụ */}
        <Route
          path="schedule"
          element={
            <Suspense fallback={<Loading text="Đang tải Lịch thi..." />}>
              <ExamSchedule />
            </Suspense>
          }
        />
        <Route
          path="routine"
          element={
            <Suspense
              fallback={<Loading text="Đang tải kết quả rèn luyện..." />}
            >
              <RoutineResult />
            </Suspense>
          }
        />
        <Route
          path="learning-result"
          element={
            <Suspense fallback={<Loading text="Đang tải kết quả học tập..." />}>
              <LearningResult />
            </Suspense>
          }
        />
        <Route
          path="exam-registration"
          element={
            <Suspense fallback={<Loading text="Đang tải đăng ký thi..." />}>
              <ExamRegistration />
            </Suspense>
          }
        />

        {/* Thông báo */}
        <Route
          path="notifications"
          element={
            <Suspense
              fallback={
                <Loading
                  text="Đang tải dữ liệu..."
                  size="lg"
                  variant="primary"
                  textVariant="primary"
                />
              }
            >
              <StudentNotifications />
            </Suspense>
          }
        />
        {/* Trợ giúp */}
        <Route
          path="chat"
          element={
            <Suspense
              fallback={
                <Loading
                  text="Đang tải dữ liệu..."
                  size="lg"
                  variant="primary"
                  textVariant="primary"
                />
              }
            >
              <StudentChat />
            </Suspense>
          }
        />
      </Route>
    </Routes>
  );
};

export default StudentRoutes;
