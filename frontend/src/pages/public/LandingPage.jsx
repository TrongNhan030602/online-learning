import HeroSection from "@/components/Landing/HeroSection/HeroSection";
import ProgramCardsSection from "@/components/Landing/ProgramCardsSection";
import SuccessHighlightsSection from "@/components/Landing/SuccessHighlightsSection";
import StudentProjectsSection from "@/components/Landing/StudentProjectsSection";
import TeachersSliderSection from "@/components/Landing/TeachersSliderSection";
import Testimonials from "@/components/Landing/Testimonials";
import NewsSection from "@/components/Landing/NewsSection";
import PartnersSection from "@/components/Landing/PartnersSection";
import ExpertsSaySection from "@/components/Landing/ExpertsSaySection";
import StickyContactButtons from "@/components/Landing/StickyContactButtons";
import RecruitmentSection from "@/components/Landing/RecruitmentSection";
import "../../styles/Landing/landing-page.css";

const LandingPage = () => {
  return (
    <div className="landing">
      <HeroSection />
      <ProgramCardsSection />
      <SuccessHighlightsSection />
      <StudentProjectsSection />
      <TeachersSliderSection />
      <Testimonials />
      <NewsSection />
      <PartnersSection />
      <ExpertsSaySection />
      <RecruitmentSection />
      <StickyContactButtons />
    </div>
  );
};

export default LandingPage;
