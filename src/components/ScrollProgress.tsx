import { motion, useScroll, useSpring } from "framer-motion";

const ScrollProgress = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 120, damping: 20, mass: 0.3 });
  return (
    <motion.div
      className="fixed top-0 left-0 right-0 h-[3px] gradient-bg origin-left z-[60]"
      style={{ scaleX }}
    />
  );
};

export default ScrollProgress;