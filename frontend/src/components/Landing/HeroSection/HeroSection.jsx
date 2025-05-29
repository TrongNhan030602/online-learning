import HeroSlider from "./HeroSlider";
import Stats from "./Stats";
import "../../../styles/landing/hero-section/hero-section.css";

const HeroSection = () => {
  return (
    <section className="hero-section ">
      <HeroSlider />
      <Stats />
    </section>
  );
};

export default HeroSection;
