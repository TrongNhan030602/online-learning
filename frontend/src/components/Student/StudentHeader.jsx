import { useState, useEffect, useRef } from "react";
import authApi from "../../api/authApi"; // logout()
import { useNavigate, NavLink } from "react-router-dom";

import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUserCircle,
  faHome,
  faBook,
  faChartLine,
  faComments,
  faPeopleRoof,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/student/student-header.css";
import logo from "../../assets/img/bc-logo@2x.webp";

const StudentHeader = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null); // Thông tin người dùng
  const dropdownRef = useRef(null);
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      localStorage.removeItem("token");
      navigate("/login");
    } catch (error) {
      console.error("Đăng xuất thất bại:", error);
    }
  };

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);
  const closeDropdown = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setDropdownOpen(false);
    }
  };

  useEffect(() => {
    document.addEventListener("click", closeDropdown);
    return () => {
      document.removeEventListener("click", closeDropdown);
    };
  }, []);

  // Lấy user khi mount
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await authApi.getUser();
        setUser(response.data);
      } catch (error) {
        console.error("Lỗi khi lấy thông tin người dùng:", error);
      }
    };

    fetchUser();
  }, []);

  return (
    <header className="student-header">
      <div className="student-header__container">
        <div className="student-header__logo">
          <NavLink to="/student/dashboard">
            <img
              src={logo}
              alt="eLearning"
              className="student-header__logo-img"
            />
          </NavLink>
        </div>

        <nav className="student-header__nav">
          <ul className="student-header__nav-list">
            <li>
              <NavLink
                to="/student/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? "student-header__nav-link student-header__nav-link--active"
                    : "student-header__nav-link"
                }
              >
                <FontAwesomeIcon
                  icon={faHome}
                  className="student-header__icon"
                />
                Trang chính
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/student/courses"
                className={({ isActive }) =>
                  isActive
                    ? "student-header__nav-link student-header__nav-link--active"
                    : "student-header__nav-link"
                }
              >
                <FontAwesomeIcon
                  icon={faBook}
                  className="student-header__icon"
                />
                Khóa học
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/student/my-classes"
                className={({ isActive }) =>
                  isActive
                    ? "student-header__nav-link student-header__nav-link--active"
                    : "student-header__nav-link"
                }
              >
                <FontAwesomeIcon
                  icon={faPeopleRoof}
                  className="student-header__icon"
                />
                Lớp học của tôi
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/student/progress"
                className={({ isActive }) =>
                  isActive
                    ? "student-header__nav-link student-header__nav-link--active"
                    : "student-header__nav-link"
                }
              >
                <FontAwesomeIcon
                  icon={faChartLine}
                  className="student-header__icon"
                />
                Tiến độ
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/student/chat"
                className={({ isActive }) =>
                  isActive
                    ? "student-header__nav-link student-header__nav-link--active"
                    : "student-header__nav-link"
                }
              >
                <FontAwesomeIcon
                  icon={faComments}
                  className="student-header__icon"
                />
                Hỗ trợ
              </NavLink>
            </li>
          </ul>
        </nav>

        <div className="student-header__actions">
          <NavLink
            to="/student/notifications"
            className="student-header__icon-link"
          >
            <FontAwesomeIcon
              icon={faBell}
              className="student-header__icon"
            />
          </NavLink>

          <div
            className="student-header__dropdown"
            ref={dropdownRef}
          >
            <div
              className="student-header__user-info"
              onClick={toggleDropdown}
            >
              <FontAwesomeIcon
                icon={faUserCircle}
                className="student-header__icon"
              />
              <span className="student-header__username">
                {user?.name || "Người dùng"}
              </span>
            </div>

            <div
              className={`student-header__dropdown-content ${
                isDropdownOpen ? "show" : ""
              }`}
            >
              <NavLink
                to="/student/profile"
                className="student-header__dropdown-link"
              >
                Tài khoản
              </NavLink>
              <a
                href="#"
                className="student-header__dropdown-link"
                onClick={handleLogout}
              >
                Đăng xuất
              </a>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default StudentHeader;
