import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { AuthProvider } from "./providers/AuthProvider.jsx";
import { ToastProvider } from "./providers/ToastProvider.jsx";
import { UserProvider } from "./providers/UserProvider.jsx";
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
      <UserProvider>
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
      </UserProvider>
    </AuthProvider>
  );
}

export default App;
