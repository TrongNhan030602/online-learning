import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../hooks/useAuth";

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  // Nếu vẫn đang tải dữ liệu về user, hiển thị loading
  if (loading) return <div>Loading...</div>;

  // Nếu người dùng chưa đăng nhập, chuyển hướng đến trang login
  if (!user) {
    return (
      <Navigate
        to="/login"
        replace
      />
    );
  }

  // Kiểm tra quyền truy cập theo role
  if (requiredRole && user.role !== requiredRole) {
    // Chuyển hướng đến trang sai quyền khi người dùng không có quyền truy cập
    const redirectPath = user.role === "admin" ? "/admin" : "/student";
    return (
      <Navigate
        to={redirectPath}
        replace
      />
    );
  }

  // Nếu mọi điều kiện đều hợp lệ, render children
  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string, // Kiểu role như "admin", "student", v.v...
};

export default PrivateRoute;
