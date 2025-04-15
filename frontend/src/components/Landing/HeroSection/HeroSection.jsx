// src/components/Landing/HeroSection/HeroSection.jsx
import LandingHeader from "./LandingHeader";
import HeroSlider from "./HeroSlider";
import "../../../styles/landing/hero-section/hero-section.css";

const HeroSection = () => {
  return (
    <section className="hero-section position-relative">
      <LandingHeader />
      <HeroSlider />
    </section>
  );
};

export default HeroSection;
