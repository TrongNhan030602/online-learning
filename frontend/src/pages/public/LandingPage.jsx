import HeroSection from "@/components/Landing/HeroSection/HeroSection";
import ProgramTimeline from "@/components/Landing/ProgramTimeline";
import TrainingPrinciples from "@/components/Landing/TrainingPrinciples";
import FeaturesSection from "@/components/Landing/FeaturesSection";
import ProgramsShowcase from "@/components/Landing/ProgramsShowcase";
import Testimonials from "@/components/Landing/Testimonials";
import "../../styles/Landing/landing-page.css";

const LandingPage = () => {
  return (
    <div className="landing">
      <HeroSection />
      <FeaturesSection />
      <ProgramTimeline />
      <ProgramsShowcase />
      <TrainingPrinciples />
      <Testimonials />
    </div>
  );
};

export default LandingPage;
