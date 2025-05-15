import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPowerOff } from "@fortawesome/free-solid-svg-icons";
import { useAuth } from "@/hooks/useAuth";

const LogoutButton = () => {
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <button
      className="dropdown-item"
      onClick={handleLogout}
    >
      <FontAwesomeIcon
        icon={faPowerOff}
        className="logout-icon me-1"
      />
      Đăng xuất
    </button>
  );
};

export default LogoutButton;
