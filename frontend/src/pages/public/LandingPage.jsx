import { useEffect } from "react";
import { useLocation } from "react-router-dom";
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
  const location = useLocation();

  useEffect(() => {
    if (location.hash) {
      const id = location.hash.replace("#", "");
      const element = document.getElementById(id);
      if (element) {
        setTimeout(() => {
          element.scrollIntoView({ behavior: "smooth", block: "start" });
        }, 100); // delay để chắc chắn phần tử đã được render
      }
    }
  }, [location]);
  return (
    <div className="landing">
      <div id="hero">
        <HeroSection />
      </div>
      <div id="programs">
        <ProgramCardsSection />
      </div>
      <div id="success">
        <SuccessHighlightsSection />
      </div>
      <div id="projects">
        <StudentProjectsSection />
      </div>
      <div id="teachers">
        <TeachersSliderSection />
      </div>
      <div id="testimonials">
        <Testimonials />
      </div>
      <div id="news">
        <NewsSection />
      </div>
      <div id="partners">
        <PartnersSection />
      </div>
      <div id="experts">
        <ExpertsSaySection />
      </div>
      <div id="recruitment">
        <RecruitmentSection />
      </div>
      <StickyContactButtons />
    </div>
  );
};

export default LandingPage;
