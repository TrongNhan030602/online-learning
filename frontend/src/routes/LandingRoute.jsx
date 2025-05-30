import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "@/hooks/useAuth";
import LandingLayout from "@/layouts/LandingLayout";
import LandingPage from "@/pages/public/LandingPage";
import ProgramDetailPage from "@/pages/public/ProgramDetailPage";
import AboutPage from "@/pages/public/AboutPage";
import ConsultPage from "@/pages/public/ConsultPage";
import TrainingCollegePage from "@/pages/public/TrainingCollegePage";
import TrainingIntermediatePage from "@/pages/public/TrainingIntermediatePage";
import TrainingCertificatePage from "@/pages/public/TrainingCertificatePage";
import TrainingSoftwarePage from "@/pages/public/TrainingSoftwarePage";
import TrainingUniversityPage from "@/pages/public/TrainingUniversityPage";
import TrainingShortTermPage from "@/pages/public/TrainingShortTermPage";

const LandingRoute = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    if (user?.role === "admin") {
      return (
        <Navigate
          to="/admin"
          replace
        />
      );
    }
    if (user?.role === "student") {
      return (
        <Navigate
          to="/student"
          replace
        />
      );
    }
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Với người chưa login → cho truy cập các route public
  return (
    <Routes>
      <Route element={<LandingLayout />}>
        <Route
          index
          element={<LandingPage />}
        />
        <Route
          path="about"
          element={<AboutPage />}
        />
        <Route
          path="consult"
          element={<ConsultPage />}
        />
        {/* Thêm các routes cho Đào tạo */}
        <Route
          path="training/university"
          element={<TrainingUniversityPage />}
        />
        <Route
          path="training/software"
          element={<TrainingSoftwarePage />}
        />
        <Route
          path="training/college"
          element={<TrainingCollegePage />}
        />{" "}
        <Route
          path="training/short-term"
          element={<TrainingShortTermPage />}
        />
        <Route
          path="training/intermediate"
          element={<TrainingIntermediatePage />}
        />
        <Route
          path="training/certificate"
          element={<TrainingCertificatePage />}
        />
        {/* Thêm các routes cho các trang khác */}
        <Route
          path="program/:id"
          element={<ProgramDetailPage />}
        />
      </Route>
    </Routes>
  );
};

export default LandingRoute;
