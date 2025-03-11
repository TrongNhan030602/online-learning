// src/App.jsx
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext.jsx";
import { ToastProvider } from "./contexts/ToastContext.jsx";
import Login from "./pages/authPages/Login.jsx";
import Register from "./pages/authPages/Register.jsx";
import ForgotPassword from "./pages/authPages/ForgotPassword.jsx";
import ResetPassword from "./pages/authPages/ResetPassword.jsx";
import AdminRoutes from "./routes/AdminRoutes.jsx";
import StudentDashboard from "./pages/students/StudentDashboard.jsx";
import PrivateRoute from "./routes/PrivateRoute.jsx";

function App() {
  return (
    <AuthProvider>
      {/* Bọc ToastProvider để có thể gọi toast message từ bất cứ đâu */}
      <ToastProvider>
        <Router>
          <Routes>
            <Route
              path="/"
              element={
                <Navigate
                  to="/login"
                  replace
                />
              }
            />
            <Route
              path="/login"
              element={<Login />}
            />
            <Route
              path="/register"
              element={<Register />}
            />
            <Route
              path="/forgot-password"
              element={<ForgotPassword />}
            />
            <Route
              path="/reset-password"
              element={<ResetPassword />}
            />
            <Route
              path="/admin/*"
              element={
                <PrivateRoute requiredRole="admin">
                  <AdminRoutes />
                </PrivateRoute>
              }
            />
            <Route
              path="/student"
              element={
                <PrivateRoute requiredRole="student">
                  <StudentDashboard />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </ToastProvider>
    </AuthProvider>
  );
}

export default App;
