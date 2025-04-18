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
const StudentProfile = lazy(() => import("../pages/students/StudentProfile"));
const StudentProgress = lazy(() => import("../pages/students/StudentProgress"));
const StudentDashboard = lazy(() =>
  import("../pages/students/StudentDashboard")
);
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
          element={<Navigate to="/student/dashboard" />}
        />

        <Route
          path="dashboard"
          element={
            <Suspense
              fallback={
                <Loading
                  text="Đang tải dữ liệu..."
                  size="lg"
                  variant="danger"
                  textVariant="danger"
                />
              }
            >
              <StudentDashboard />
            </Suspense>
          }
        />
        <Route
          path="courses"
          element={
            <Suspense
              fallback={
                <Loading
                  text="Đang tải dữ liệu..."
                  size="lg"
                  variant="danger"
                  textVariant="danger"
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
                  variant="danger"
                  textVariant="danger"
                />
              }
            >
              <CourseDetail />
            </Suspense>
          }
        />
        <Route
          path="my-classes"
          element={
            <Suspense
              fallback={
                <Loading
                  text="Đang tải dữ liệu..."
                  size="lg"
                  variant="danger"
                  textVariant="danger"
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
                  variant="danger"
                  textVariant="danger"
                />
              }
            >
              <ClassSessions />
            </Suspense>
          }
        />

        <Route
          path="profile"
          element={
            <Suspense
              fallback={
                <Loading
                  text="Đang tải dữ liệu..."
                  size="lg"
                  variant="danger"
                  textVariant="danger"
                />
              }
            >
              <StudentProfile />
            </Suspense>
          }
        />
        <Route
          path="progress"
          element={
            <Suspense
              fallback={
                <Loading
                  text="Đang tải dữ liệu..."
                  size="lg"
                  variant="danger"
                  textVariant="danger"
                />
              }
            >
              <StudentProgress />
            </Suspense>
          }
        />
        <Route
          path="notifications"
          element={
            <Suspense
              fallback={
                <Loading
                  text="Đang tải dữ liệu..."
                  size="lg"
                  variant="danger"
                  textVariant="danger"
                />
              }
            >
              <StudentNotifications />
            </Suspense>
          }
        />
        <Route
          path="chat"
          element={
            <Suspense
              fallback={
                <Loading
                  text="Đang tải dữ liệu..."
                  size="lg"
                  variant="danger"
                  textVariant="danger"
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
