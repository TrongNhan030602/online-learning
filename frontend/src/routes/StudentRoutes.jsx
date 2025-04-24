import { Routes, Route, Navigate } from "react-router-dom"; // Import Navigate
import { lazy, Suspense } from "react";
import StudentLayout from "../layouts/StudentLayout";
import Loading from "../components/Common/Loading";

// Lazy load các trang
const StudentCourses = lazy(() =>
  import("../pages/students/Courses/StudentCourses")
);
const CourseDetail = lazy(() =>
  import("../pages/students/Courses/CourseDetail")
);
const Blogs = lazy(() => import("../pages/students/Blogs/Blogs"));
const BlogDetail = lazy(() => import("../pages/students/Blogs/BlogDetail"));
const StudentProfile = lazy(() => import("../pages/students/StudentProfile"));
const TrainingProgram = lazy(() => import("../pages/students/TrainingProgram"));
// const StudentDashboard = lazy(() =>
//   import("../pages/students/StudentDashboard/StudentDashboard")
// );
const StudentNotifications = lazy(() =>
  import("../pages/students/StudentNotifications")
);
const StudentChat = lazy(() => import("../pages/students/StudentChat"));
const StudentMyClasses = lazy(() =>
  import("../pages/students/MyClasses/StudentMyClasses")
);
const ClassSessions = lazy(() =>
  import("../pages/students/MyClasses/ClassSessions")
);
// Học vụ
const ExamSchedule = lazy(() =>
  import("../pages/students/Academic/ExamSchedule")
);
const RoutineResult = lazy(() =>
  import("../pages/students/Academic/RoutineResult")
);
const LearningResult = lazy(() =>
  import("../pages/students/Academic/LearningResult")
);
const ExamRegistration = lazy(() =>
  import("../pages/students/Academic/ExamRegistration")
);

const StudentRoutes = () => {
  return (
    <Routes>
      <Route
        path="/"
        element={<StudentLayout />}
      >
        {/* Redirect mặc định khi truy cập vào /student */}
        <Route
          index
          // element={<Navigate to="/student/dashboard" />}
          element={<Navigate to="/student/training-program" />}
        />

        {/* <Route
          path="dashboard"
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
              <StudentDashboard />
            </Suspense>
          }
        /> */}
        {/* Khóa */}
        <Route
          path="courses"
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
              <StudentCourses />
            </Suspense>
          }
        />
        <Route
          path="courses/:id"
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
              <CourseDetail />
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
        {/* Lớp  */}
        <Route
          path="my-classes"
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
              <StudentMyClasses />
            </Suspense>
          }
        />
        <Route
          path="my-classes/:classroomId"
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
              <ClassSessions />
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
