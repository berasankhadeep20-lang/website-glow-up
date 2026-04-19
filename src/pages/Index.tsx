import { useEffect } from "react";
import ParticleCanvas from "@/components/ParticleCanvas";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EducationSection from "@/components/EducationSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import WorkshopsSection from "@/components/WorkshopsSection";
import TerminalSection from "@/components/TerminalSection";
import ResumeSection from "@/components/ResumeSection";
import ContactSection from "@/components/ContactSection";
import InteractiveEffects from "@/components/InteractiveEffects";
import BlogSection from "@/components/BlogSection";
import ResearchSection from "@/components/ResearchSection";

const Index = () => {
  useEffect(() => {
    if ("scrollRestoration" in window.history) {
      window.history.scrollRestoration = "manual";
    }
    if (window.location.hash) {
      window.history.replaceState(null, "", window.location.pathname + window.location.search);
    }
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <ParticleCanvas />
      <InteractiveEffects />
      <Navbar />
      <HeroSection />
      <EducationSection />
      <SkillsSection />
      <ProjectsSection />
      <ResearchSection />
      <BlogSection />
      <WorkshopsSection />
      <ResumeSection />
      <TerminalSection />
      <ContactSection />
    </>
  );
};

export default Index;
