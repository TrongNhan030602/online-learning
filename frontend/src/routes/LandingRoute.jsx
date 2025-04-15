import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";
import LandingPage from "../pages/public/LandingPage";
import ProgramDetailPage from "../pages/public/ProgramDetailPage";

const LandingRoute = () => {
  const { isAuthenticated, user } = useAuth();

  if (isAuthenticated) {
    if (user?.role === "admin")
      return (
        <Navigate
          to="/admin"
          replace
        />
      );
    if (user?.role === "student")
      return (
        <Navigate
          to="/student"
          replace
        />
      );
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
      <Route
        index
        element={<LandingPage />}
      />
      <Route
        path="program/:id"
        element={<ProgramDetailPage />}
      />
    </Routes>
  );
};

export default LandingRoute;
