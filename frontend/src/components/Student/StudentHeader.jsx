/* eslint-disable react/prop-types */
import { useState, useEffect, useRef } from "react";
import authApi from "../../api/authApi"; // logout()
import studentTrainingApi from "../../api/studentTrainingApi";
import { useNavigate, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faBell,
  faUserCircle,
  // faMapSigns,
  // faTableCells,
  faGraduationCap,
  // faCircleQuestion,
  // faPeopleRoof,
  faSitemap,
  faAlignLeft as faBars,
  // faChevronDown,
} from "@fortawesome/free-solid-svg-icons";
import "../../styles/student/student-header.css";
import logo from "/logo.webp";

const NavLinkItem = ({ to, icon, label, onClick }) => (
  <li>
    <NavLink
      to={to}
      className={({ isActive }) =>
        isActive
          ? "student-header__nav-link student-header__nav-link--active"
          : "student-header__nav-link"
      }
      onClick={onClick} // Gọi onClick khi nhấn vào link
    >
      <FontAwesomeIcon
        icon={icon}
        className="student-header__icon"
      />
      {label}
    </NavLink>
  </li>
);

const DropdownMenu = ({ label, items }) => {
  return (
    <li className="student-header__nav-item dropdown">
      <div className="student-header__nav-link">
        <FontAwesomeIcon
          icon={faSitemap}
          className="student-header__icon-dropdown"
        />
        {label}
      </div>
      <ul className="student-header__dropdown-menu">
        {items.map((item, index) => (
          <li key={index}>
            <NavLink
              to={item.to}
              className="student-header__dropdown-link"
              onClick={item.onClick}
            >
              {item.label}
            </NavLink>
          </li>
        ))}
      </ul>
    </li>
  );
};
const StudentHeader = () => {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [user, setUser] = useState(null);
  const [programs, setPrograms] = useState([]);
  const [isMenuOpen, setMenuOpen] = useState(false); // State cho việc mở/đóng menu
  const dropdownRef = useRef(null);
  const menuRef = useRef(null); // Thêm ref cho menu slide-in
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await authApi.logout();
      localStorage.removeItem("token");
      navigate("/");
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

  // Hàm đóng menu nếu click ngoài menu slide-in
  const closeMenu = (event) => {
    if (menuRef.current && !menuRef.current.contains(event.target)) {
      setMenuOpen(false);
    }
  };

  // Mở menu
  const toggleMenu = (event) => {
    setMenuOpen(!isMenuOpen);
    event.stopPropagation(); // Ngừng sự kiện click ra ngoài để tránh đóng menu ngay lập tức
  };

  // Đóng menu khi chọn 1 mục
  const handleNavItemClick = () => {
    setMenuOpen(false); // Đóng menu khi chọn một item
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === "Escape") {
        setDropdownOpen(false);
      }
    };

    document.addEventListener("click", closeDropdown);
    document.addEventListener("click", closeMenu); // Lắng nghe sự kiện click để đóng menu
    document.addEventListener("keydown", handleKeyDown);

    return () => {
      document.removeEventListener("click", closeDropdown);
      document.removeEventListener("click", closeMenu); // Dọn dẹp sự kiện
      document.removeEventListener("keydown", handleKeyDown);
    };
  }, []);

  const fetchUser = async () => {
    try {
      const response = await authApi.getUser();
      setUser(response.data);
    } catch (error) {
      console.error("Lỗi khi lấy thông tin người dùng:", error);
    }
  };
  const fetchPrograms = async () => {
    try {
      const response = await studentTrainingApi.getStudentPrograms(); // Lấy danh sách chương trình đào tạo
      setPrograms(response.data.data);
    } catch (error) {
      console.error("Lỗi khi lấy chương trình đào tạo:", error);
    }
  };

  useEffect(() => {
    fetchUser();
    fetchPrograms();
  }, []);

  return (
    <header className="student-header">
      <div className="student-header__container">
        {/* Nút menu */}
        <div
          className="student-header__menu-btn"
          onClick={toggleMenu}
        >
          <FontAwesomeIcon icon={faBars} />
        </div>
        <div className="student-header__logo">
          <NavLink to="/student">
            <img
              src={logo}
              alt="eLearning"
              className="student-header__logo-img"
            />{" "}
            HỌC VIỆN DESIGN24
          </NavLink>
        </div>

        {/* Menu slide-in */}
        <div
          ref={menuRef} // Gắn ref vào menu
          className={`student-header__menu ${isMenuOpen ? "show" : ""}`}
        >
          <ul>
            <NavLinkItem
              to="/student/schedule"
              icon={faGraduationCap}
              label="Lịch thi"
              onClick={handleNavItemClick}
            />
            <NavLinkItem
              to="/student/routine"
              icon={faGraduationCap}
              label="KQ rèn luyện"
              onClick={handleNavItemClick}
            />
            <NavLinkItem
              to="/student/learning-result"
              icon={faGraduationCap}
              label="KQ học tập"
              onClick={handleNavItemClick}
            />
            <NavLinkItem
              to="/student/exam-registration"
              icon={faGraduationCap}
              label="ĐK thi lần 2"
              onClick={handleNavItemClick}
            />

            <DropdownMenu
              label="CTĐT"
              items={programs.map((program) => ({
                to: `/student/my-training-program/${program.id}`,
                label: program.name,
                onClick: handleNavItemClick,
              }))}
            />

            {/* <NavLinkItem
              to="/student/blogs"
              icon={faMapSigns}
              label="Blog"
              onClick={handleNavItemClick}
            /> */}
            {/* <NavLinkItem
              to="/student/chat"
              icon={faCircleQuestion}
              label="Trợ giúp"
              onClick={handleNavItemClick}
            /> */}
          </ul>
        </div>

        {/* Navbar gốc trên desktop */}
        <nav className="student-header__nav">
          <ul className="student-header__nav-list">
            <DropdownMenu
              label="CTĐT"
              items={programs.map((program) => ({
                to: `/student/my-training-program/${program.id}`,
                label: program.name,
                onClick: handleNavItemClick,
              }))}
            />

            <NavLinkItem
              to="/student/schedule"
              icon={faGraduationCap}
              label="Lịch thi"
              onClick={handleNavItemClick}
            />
            <NavLinkItem
              to="/student/routine"
              icon={faGraduationCap}
              label="KQ rèn luyện"
              onClick={handleNavItemClick}
            />
            <NavLinkItem
              to="/student/learning-result"
              icon={faGraduationCap}
              label="KQ học tập"
              onClick={handleNavItemClick}
            />
            <NavLinkItem
              to="/student/exam-registration"
              icon={faGraduationCap}
              label="ĐK thi lần 2"
              onClick={handleNavItemClick}
            />
            {/* Thêm dropdown cho "Chương trình đào tạo" trên desktop */}

            {/* <NavLinkItem
              to="/student/blogs"
              icon={faMapSigns}
              label="Blog"
              onClick={handleNavItemClick}
            /> */}
            {/* <NavLinkItem
              to="/student/chat"
              icon={faCircleQuestion}
              label="Trợ giúp"
              onClick={handleNavItemClick}
            /> */}
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
              aria-expanded={isDropdownOpen}
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
