import { useEffect, useState, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom"; // Thêm useLocation
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBars, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../../styles/landing/hero-section/landing-header.css";

const LandingHeader = () => {
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const menuToggleRef = useRef(null);
  const location = useLocation(); // Hook to get current location

  // Scroll to top when the location changes
  useEffect(() => {
    window.scrollTo(0, 0); // Scroll to the top of the page
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !menuToggleRef.current.contains(event.target)
      ) {
        setMenuOpen(false);
      }
    };
    document.addEventListener("click", handleClickOutside);

    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      setHidden(currentScrollY > lastScrollY && currentScrollY > 80);
      setScrolled(currentScrollY > 50);
      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`landing-header ${hidden ? "hide" : ""} ${
        scrolled ? "scrolled" : ""
      }`}
    >
      <div className="d-flex justify-content-between align-items-center">
        <div className="logo">
          <NavLink
            to="/"
            className="nav-link"
          >
            <img
              src="/logo.png"
              alt="Logo"
              height="40"
            />
            HỌC VIỆN DESIGN24
          </NavLink>
        </div>

        <div
          className="menu-toggle d-lg-none"
          onClick={() => setMenuOpen(!menuOpen)}
          ref={menuToggleRef}
        >
          <FontAwesomeIcon
            icon={menuOpen ? faTimes : faBars}
            size="lg"
            color="#fff"
          />
        </div>

        <nav
          ref={menuRef}
          className={`header-nav d-lg-flex gap-3 align-items-center ${
            menuOpen ? "open" : ""
          }`}
        >
          <NavLink
            to="/"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Trang chủ
          </NavLink>
          <NavLink
            to="/about"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Giới thiệu
          </NavLink>
          <div className="nav-item dropdown">
            <span className="nav-link dropdown-toggle">Đào tạo</span>
            <div className="dropdown-menu">
              <NavLink
                to="/training/college"
                className="dropdown-item"
              >
                Cao đẳng
              </NavLink>
              <NavLink
                to="/training/intermediate"
                className="dropdown-item"
              >
                Trung cấp
              </NavLink>
              <NavLink
                to="/training/certificate"
                className="dropdown-item"
              >
                Sơ cấp - Chứng chỉ
              </NavLink>
              <NavLink
                to="/training/software"
                className="dropdown-item"
              >
                Phần mềm
              </NavLink>
            </div>
          </div>

          <NavLink
            to="/consult"
            className={({ isActive }) => `nav-link ${isActive ? "active" : ""}`}
          >
            Tư vấn
          </NavLink>

          <NavLink
            to="/login"
            className="d-lg-inline-block"
          >
            <button className="btn-accent">Đăng nhập</button>
          </NavLink>
        </nav>
      </div>
    </header>
  );
};

export default LandingHeader;
