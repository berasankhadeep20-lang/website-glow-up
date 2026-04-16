import ParticleCanvas from "@/components/ParticleCanvas";
import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import EducationSection from "@/components/EducationSection";
import SkillsSection from "@/components/SkillsSection";
import ProjectsSection from "@/components/ProjectsSection";
import WorkshopsSection from "@/components/WorkshopsSection";
import TerminalSection from "@/components/TerminalSection";
import ContactSection from "@/components/ContactSection";
import InteractiveEffects from "@/components/InteractiveEffects";

const Index = () => (
  <>
    <ParticleCanvas />
    <InteractiveEffects />
    <Navbar />
    <HeroSection />
    <EducationSection />
    <SkillsSection />
    <ProjectsSection />
    <WorkshopsSection />
    <TerminalSection />
    <ContactSection />
  </>
);

export default Index;
