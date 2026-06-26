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
import CodingStats from "@/components/CodingStats";
import ArxivReadingList from "@/components/ArxivReadingList";
import RecruiterMode from "@/components/RecruiterMode";
import LiveLLMDemo from "@/components/LiveLLMDemo";
import ContributionGlobe from "@/components/ContributionGlobe";
import QuantumPlayground from "@/components/QuantumPlayground";
import SchrodingerVisualizer from "@/components/features/SchrodingerVisualizer";
import LatticeBoltzmann from "@/components/features/LatticeBoltzmann";
import QuantumAlgorithmShowcase from "@/components/features/QuantumAlgorithmShowcase";
import BellInequality from "@/components/features/BellInequality";
import ArxivRecommender from "@/components/features/ArxivRecommender";
import SportsPredictors from "@/components/features/SportsPredictors";
import IISERSection from "@/components/features/IISERSection";
import PersonalKolkata from "@/components/features/PersonalKolkata";
import CodeforcesCard from "@/components/features/CodeforcesCard";
import BlochSphereExplorer from "@/components/features/BlochSphereExplorer";
import QuantumCircuitBuilder from "@/components/features/QuantumCircuitBuilder";
import IsingModel from "@/components/features/IsingModel";
import FourierExplorer from "@/components/features/FourierExplorer";
import DoubleSlit from "@/components/features/DoubleSlit";
import QuantumErrorCorrection from "@/components/features/QuantumErrorCorrection";
import ContestTracker from "@/components/features/ContestTracker";
import WeakTopicAnalyzer from "@/components/features/WeakTopicAnalyzer";
import RatingPredictor from "@/components/features/RatingPredictor";
import ProblemOfTheDay from "@/components/features/ProblemOfTheDay";

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
      <RecruiterMode />
      <Navbar />
      <HeroSection />
      <NowSection />
      <EducationSection />
      <SkillsSection />
      <ProjectsSection />
      <SportsPredictors />
      <GitHubFeed />
      <ContributionGlobe />
      <CodingStats />
      <CodeforcesCard />
      <ContestTracker />
      <ProblemOfTheDay />
      <WeakTopicAnalyzer />
      <RatingPredictor />
      <IISERSection />
      <ResearchSection />
      <ArxivReadingList />
      <ArxivRecommender />
      <QuantumPlayground />
      <BlochSphereExplorer />
      <QuantumCircuitBuilder />
      <QuantumAlgorithmShowcase />
      <QuantumErrorCorrection />
      <BellInequality />
      <DoubleSlit />
      <SchrodingerVisualizer />
      <LatticeBoltzmann />
      <IsingModel />
      <FourierExplorer />
      <BlogSection />
      <WorkshopsSection />
      <DoublePendulum />
      <PersonalKolkata />
      <ResumeSection />
      <LiveLLMDemo />
      <TerminalSection />
      <Guestbook />
      <ContactSection />
      <AskSankhadeep />
    </>
  );
};

export default Index;
