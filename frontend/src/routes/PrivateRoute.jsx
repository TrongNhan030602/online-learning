import { Navigate } from "react-router-dom";
import PropTypes from "prop-types";
import { useAuth } from "../hooks/useAuth";

const PrivateRoute = ({ children, requiredRole }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user)
    return (
      <Navigate
        to="/login"
        replace
      />
    );

  // Kiểm tra role nếu requiredRole được chỉ định
  if (requiredRole && user.role !== requiredRole) {
    return requiredRole === "admin" ? (
      <Navigate
        to="/student"
        replace
      />
    ) : (
      <Navigate
        to="/admin"
        replace
      />
    );
  }

  return children;
};

PrivateRoute.propTypes = {
  children: PropTypes.node.isRequired,
  requiredRole: PropTypes.string,
};

export default PrivateRoute;
