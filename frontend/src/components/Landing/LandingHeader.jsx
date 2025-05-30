import { useEffect, useState, useRef } from "react";
import { NavLink, useLocation } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faBarsStaggered, faTimes } from "@fortawesome/free-solid-svg-icons";
import "../../styles/landing/hero-section/landing-header.css";

const LandingHeader = () => {
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const menuRef = useRef(null);
  const toggleRef = useRef(null);
  const location = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
    setMenuOpen(false);
  }, [location]);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        !toggleRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
        // setDropdownVisible(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      const currentY = window.scrollY;
      setHidden(currentY > lastScrollY && currentY > 80);
      setScrolled(currentY > 50);
      setLastScrollY(currentY);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <>
      <header
        className={`landing-header ${hidden ? "landing-header--hide" : ""} ${
          scrolled ? "landing-header--scrolled" : ""
        }`}
      >
        <div className="landing-header__container">
          {/* Logo */}
          <div className="landing-header__left">
            <NavLink
              to="/"
              className="landing-header__logo-link"
            >
              <img
                src="/logo.png"
                alt="Logo"
                className="landing-header__logo-img"
              />
              HỌC VIỆN DESIGN24
            </NavLink>
          </div>

          {/* Navigation */}
          <div className="landing-header__right">
            <nav className="landing-header__nav">
              <NavLink
                to="/consult"
                className="landing-header__link landing-header__link--outline"
              >
                Tư vấn khóa học
              </NavLink>
              <NavLink
                to="/"
                className="landing-header__link landing-header__link--outline"
              >
                Blog
              </NavLink>

              <button
                className="landing-header__toggle"
                onClick={() => setMenuOpen(!menuOpen)}
                ref={toggleRef}
              >
                <FontAwesomeIcon
                  icon={menuOpen ? faTimes : faBarsStaggered}
                  size="lg"
                  color="#d4af37"
                />
              </button>
            </nav>
          </div>
        </div>

        {/* Sidebar + Overlay */}
        {menuOpen && (
          <>
            <div
              className="landing-header__sidebar landing-header__sidebar--open"
              ref={menuRef}
              role="navigation"
              aria-label="Sidebar Menu"
            >
              <NavLink
                to="/about"
                className="landing-header__sidebar-link mt-5"
              >
                Về Học Viện Design24
              </NavLink>
              <button
                className="landing-header__sidebar-close"
                onClick={() => setMenuOpen(false)}
                aria-label="Đóng menu"
              >
                <FontAwesomeIcon
                  icon={faTimes}
                  size="2x"
                />
              </button>

              <section className="landing-header__sidebar-section">
                <h3 className="landing-header__sidebar-title">
                  Chương trình đào tạo
                </h3>
                <ul className="landing-header__sidebar-list">
                  <li>
                    <NavLink
                      to="/training/university"
                      className="landing-header__sidebar-link"
                    >
                      Đại học
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/training/college"
                      className="landing-header__sidebar-link"
                    >
                      Cao đẳng
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/training/intermediate"
                      className="landing-header__sidebar-link"
                    >
                      Trung Cấp
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/training/certificate"
                      className="landing-header__sidebar-link"
                    >
                      Sơ cấp
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/training/short-term"
                      className="landing-header__sidebar-link"
                    >
                      Chứng chỉ - Ngắn hạn
                    </NavLink>
                  </li>
                  <li>
                    <NavLink
                      to="/training/software"
                      className="landing-header__sidebar-link"
                    >
                      Phần mềm
                    </NavLink>
                  </li>
                </ul>
              </section>

              <section className="landing-header__sidebar-section landing-header__sidebar-section--last">
                <NavLink
                  to="/#programs"
                  className="landing-header__sidebar-link"
                >
                  Chương trình
                </NavLink>
                <NavLink
                  to="/#success"
                  className="landing-header__sidebar-link"
                >
                  Dấu ấn thành công
                </NavLink>
                <NavLink
                  to="/#projects"
                  className="landing-header__sidebar-link"
                >
                  Dự án học viên
                </NavLink>
                <NavLink
                  to="/#teachers"
                  className="landing-header__sidebar-link"
                >
                  Giảng viên Design24
                </NavLink>
                <NavLink
                  to="/#testimonials"
                  className="landing-header__sidebar-link"
                >
                  Cảm nhận học viên
                </NavLink>
                <NavLink
                  to="/#news"
                  className="landing-header__sidebar-link"
                >
                  Tin tức - Sự kiện
                </NavLink>
                <NavLink
                  to="/"
                  className="landing-header__sidebar-link"
                >
                  Blog
                </NavLink>
                <NavLink
                  to="/#partners"
                  className="landing-header__sidebar-link"
                >
                  Đối tác hợp tác
                </NavLink>{" "}
                <NavLink
                  to="/#recruitment"
                  className="landing-header__sidebar-link"
                >
                  Tin tuyển dụng
                </NavLink>
                <NavLink
                  to="/#experts"
                  className="landing-header__sidebar-link"
                >
                  Các chuyên gia nói gì về Design24
                </NavLink>
              </section>
            </div>

            <div
              className="landing-header__overlay landing-header__overlay--visible"
              onClick={() => setMenuOpen(false)}
            />
          </>
        )}
      </header>
    </>
  );
};

export default LandingHeader;
