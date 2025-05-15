import AboutIntro from "@/components/Landing/About/AboutIntro";
import AboutUsWithImage from "@/components/Landing/About/AboutUsWithImage";
import "../../styles/landing/about/about-page.css";

const AboutPage = () => {
  return (
    <div className="about-page">
      <AboutIntro />
      <AboutUsWithImage />
    </div>
  );
};

export default AboutPage;
