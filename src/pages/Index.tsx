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
import GitHubFeed from "@/components/GitHubFeed";
import CommandPalette from "@/components/CommandPalette";
import AskSankhadeep from "@/components/AskSankhadeep";
import ScrollProgress from "@/components/ScrollProgress";
import NowSection from "@/components/NowSection";
import DoublePendulum from "@/components/DoublePendulum";
import Guestbook from "@/components/Guestbook";
import FeedbackBox from "@/components/FeedbackBox";
import KonamiEasterEgg from "@/components/KonamiEasterEgg";

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
      <ScrollProgress />
      <InteractiveEffects />
      <CommandPalette />
      <KonamiEasterEgg />
      <FeedbackBox />
      <Navbar />
      <HeroSection />
      <NowSection />
      <EducationSection />
      <SkillsSection />
      <ProjectsSection />
      <GitHubFeed />
      <ResearchSection />
      <BlogSection />
      <WorkshopsSection />
      <DoublePendulum />
      <ResumeSection />
      <TerminalSection />
      <Guestbook />
      <ContactSection />
      <AskSankhadeep />
    </>
  );
};

export default Index;
