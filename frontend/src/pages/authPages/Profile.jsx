import { useNavigate } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faUser,
  faAddressCard,
  faGraduationCap,
  faFileAlt,
  faUsers,
  faShoppingCart,
  faCertificate,
  faEdit,
} from "@fortawesome/free-solid-svg-icons";
import avatarPlaceholder from "@/assets/img/default-avatar.jpg";
import { useAuth } from "@/hooks/useAuth";

const Profile = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (error) {
      console.error("Logout failed", error);
    }
  };

  // Dữ liệu mẫu nếu user chưa có
  const displayName = user?.name || "Nguyễn Trọng Nhân";
  const joinDate = user?.createdAt || "2025-02-27";
  const bio = user?.bio || "Thành viên này chưa có giới thiệu về mình.";
  const avatar = user?.avatar || avatarPlaceholder;

  return (
    <div className="container mt-4">
      <div className="row">
        {/* Left Column: Navigation Menu */}
        <div className="col-md-3">
          <div className="card mb-4 border-0">
            <div className="card-body text-center">
              {/* Avatar */}
              <img
                src={avatar}
                alt="Avatar"
                className="rounded-circle mb-3"
                style={{
                  width: "100px",
                  height: "100px",
                  objectFit: "cover",
                  cursor: "pointer",
                }}
                onClick={() => {
                  // Logic cập nhật avatar (ví dụ: mở modal)
                  console.log("Update avatar clicked");
                }}
              />
              <h5 className="card-title">{displayName}</h5>
              <ul className="list-group list-group-flush mt-3 text-start">
                <li className="list-group-item hover-item">
                  <FontAwesomeIcon
                    icon={faUser}
                    className="me-2"
                  />
                  PROFILE
                </li>
                <li className="list-group-item hover-item">
                  <FontAwesomeIcon
                    icon={faAddressCard}
                    className="me-2"
                  />
                  Hồ sơ
                </li>
                <li className="list-group-item hover-item">
                  <FontAwesomeIcon
                    icon={faGraduationCap}
                    className="me-2"
                  />
                  Khoá học
                </li>
                <li className="list-group-item hover-item">
                  <FontAwesomeIcon
                    icon={faFileAlt}
                    className="me-2"
                  />
                  Tài liệu
                </li>
                <li className="list-group-item hover-item">
                  <FontAwesomeIcon
                    icon={faUsers}
                    className="me-2"
                  />
                  Học Team
                </li>
                <li className="list-group-item hover-item">
                  <FontAwesomeIcon
                    icon={faShoppingCart}
                    className="me-2"
                  />
                  Đơn hàng
                </li>
                <li className="list-group-item hover-item">
                  <FontAwesomeIcon
                    icon={faCertificate}
                    className="me-2"
                  />
                  Chứng nhận
                </li>
                <li className="list-group-item hover-item">
                  <FontAwesomeIcon
                    icon={faEdit}
                    className="me-2"
                  />
                  Cập nhật
                </li>
              </ul>
              <button
                className="btn btn-secondary mt-3 w-100"
                onClick={handleLogout}
              >
                Logout
              </button>
            </div>
          </div>
        </div>

        {/* Right Column: Profile Content */}
        <div className="col-md-9">
          <div className="card">
            <div className="card-body">
              {/* Tiêu đề của Profile */}
              <h2 className="mb-3">Profile</h2>
              {/* Phần nội dung với đường phân cách */}
              <div
                className="pt-3"
                style={{ borderTop: "1px solid #dee2e6" }}
              >
                <h4 className="mb-3">Giới thiệu</h4>
                <p className="text-muted">{bio}</p>
                <hr />
                <h4 className="mb-3">Thông tin</h4>
                <p>
                  <strong>Thành viên từ:</strong> {joinDate} (Mới đăng ký)
                </p>
                {/* Thêm thông tin khác nếu cần */}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
