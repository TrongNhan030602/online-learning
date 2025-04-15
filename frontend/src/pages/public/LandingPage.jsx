import { useNavigate } from "react-router-dom";
import "../../styles/Landing/landing-page.css";
import HeroSection from "../../components/Landing/HeroSection/HeroSection";
import ProgramTimeline from "../../components/Landing/ProgramTimeline";
import TrainingPrinciples from "../../components/Landing/TrainingPrinciples";
import FeaturesSection from "../../components/Landing/FeaturesSection";
import ProgramsShowcase from "../../components/Landing/ProgramsShowcase";
import Testimonials from "../../components/Landing/Testimonials";
import CallToAction from "../../components/Landing/CallToAction";

const LandingPage = () => {
  const navigate = useNavigate();

  const handleLoginClick = () => {
    navigate("/login");
  };

  return (
    <div className="landing">
      <HeroSection onLoginClick={handleLoginClick} />
      <FeaturesSection />
      <ProgramTimeline />
      <ProgramsShowcase />
      <TrainingPrinciples />
      <Testimonials />
      <CallToAction onLoginClick={handleLoginClick} />
    </div>
  );
};

export default LandingPage;
