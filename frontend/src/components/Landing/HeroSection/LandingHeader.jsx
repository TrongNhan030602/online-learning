import { useEffect, useState } from "react";
import "../../../styles/landing/hero-section/landing-header.css";

const LandingHeader = () => {
  const [hidden, setHidden] = useState(false);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY > lastScrollY && currentScrollY > 80) {
        setHidden(true); // scroll xuống
      } else {
        setHidden(false); // scroll lên
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [lastScrollY]);

  return (
    <header
      className={`landing-header d-flex justify-content-between align-items-center px-4 py-3 ${
        hidden ? "hide" : ""
      }`}
    >
      <div className="logo">
        <img
          src="/logo.png"
          alt="Logo"
        />
      </div>
      <nav className="header-nav d-flex gap-3 align-items-center">
        <a
          href="#blog"
          className="nav-link"
        >
          Blog
        </a>
        <a
          href="#contact"
          className="btn btn-primary"
        >
          Tư vấn khóa học
        </a>
      </nav>
    </header>
  );
};

export default LandingHeader;
