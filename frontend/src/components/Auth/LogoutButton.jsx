import { useNavigate } from "react-router-dom";
import { useAuth } from "../../hooks/useAuth";

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      className="dropdown-item"
      onClick={handleLogout}
    >
      Đăng xuất
    </button>
  );
};

export default LogoutButton;
