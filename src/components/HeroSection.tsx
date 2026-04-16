import { motion, useMotionValue, useSpring } from "framer-motion";
import { useState, useEffect, useRef } from "react";

const roles = ["Programmer", "ML Enthusiast", "Quantum Computing Explorer", "Video Editor", "BS-MS Student"];

const stats = [
  { value: 94.89, label: "JEE Main 2025", suffix: "%" },
  { value: 1596, label: "WBJEE 2025 Rank", suffix: "" },
  { value: 3065, label: "IAT Rank", suffix: "" },
];

function useTypewriter(words: string[], speed = 80, pause = 2000) {
  const [text, setText] = useState("");
  const [wordIdx, setWordIdx] = useState(0);
  const [charIdx, setCharIdx] = useState(0);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const word = words[wordIdx];
    const timeout = deleting ? speed / 2 : speed;

    if (!deleting && charIdx === word.length) {
      setTimeout(() => setDeleting(true), pause);
      return;
    }
    if (deleting && charIdx === 0) {
      setDeleting(false);
      setWordIdx((prev) => (prev + 1) % words.length);
      return;
    }

    const timer = setTimeout(() => {
      setText(word.substring(0, deleting ? charIdx - 1 : charIdx + 1));
      setCharIdx((prev) => prev + (deleting ? -1 : 1));
    }, timeout);

    return () => clearTimeout(timer);
  }, [charIdx, deleting, wordIdx, words, speed, pause]);

  return text;
}

function CountUp({ target, suffix, duration = 2 }: { target: number; suffix: string; duration?: number }) {
  const [count, setCount] = useState(0);
  const ref = useRef<HTMLDivElement>(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          const steps = 60;
          const increment = target / steps;
          let current = 0;
          const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
              setCount(target);
              clearInterval(timer);
            } else {
              setCount(current);
            }
          }, (duration * 1000) / steps);
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [target, duration]);

  const display = suffix === "%" ? count.toFixed(2) : Math.round(count).toString();

  return (
    <div ref={ref} className="text-2xl font-bold text-primary">
      {display}{suffix}
    </div>
  );
}

const HeroSection = () => {
  const typedRole = useTypewriter(roles, 80, 1800);

  return (
    <section className="min-h-screen flex items-center justify-center px-6 pt-20 relative">
      <div className="max-w-6xl mx-auto text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", duration: 0.8 }}
          className="relative w-48 h-48 mx-auto mb-8"
        >
          <img
            src="https://avatars.githubusercontent.com/u/berasankhadeep20-lang"
            alt="Sankhadeep Bera"
            className="w-48 h-48 rounded-full border-2 border-primary glow-primary object-cover relative z-10"
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
          <div className="absolute inset-[-12px] rounded-full border-2 border-dashed border-accent animate-spin" style={{ animationDuration: "8s" }} />
          {/* Pulsing ring */}
          <div className="absolute inset-[-24px] rounded-full border border-primary/20 animate-ping" style={{ animationDuration: "3s" }} />
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="text-4xl md:text-6xl font-bold mb-4"
        >
          Hello, I'm <span className="gradient-text">Sankhadeep Bera</span>
        </motion.h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="text-lg md:text-xl mb-2 h-8 text-muted-foreground"
        >
          <span>{typedRole}</span>
          <span className="animate-pulse text-primary">|</span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="text-sm text-muted-foreground mb-8"
        >
          BS-MS Student at IISER Kolkata · JEE Mains 94.89 Percentile · WBJEE Rank 1596 · IAT Rank 3065
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.7 }}
          className="flex gap-4 justify-center mb-12"
        >
          <a href="#education" className="gradient-bg text-primary-foreground px-6 py-2.5 rounded-full font-semibold hover:scale-110 transition-transform shadow-lg shadow-primary/25">
            View Journey
          </a>
          <a href="mailto:berasankhadeep20@gmail.com" className="border-2 border-primary text-primary px-6 py-2.5 rounded-full font-semibold hover:bg-primary hover:text-primary-foreground transition-all">
            Contact
          </a>
          <a href="#terminal" className="border-2 border-accent text-accent px-6 py-2.5 rounded-full font-semibold hover:bg-accent hover:text-accent-foreground transition-all">
            Try Terminal
          </a>
        </motion.div>

        <div className="flex justify-center gap-8 md:gap-16 flex-wrap">
          {stats.map((s, i) => (
            <motion.div
              key={s.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 + i * 0.1 }}
              className="glass rounded-2xl px-6 py-4 hover:-translate-y-2 hover:glow-primary transition-all cursor-default"
            >
              <CountUp target={s.value} suffix={s.suffix} />
              <div className="text-xs text-muted-foreground">{s.label}</div>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Scroll indicator */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1, y: [0, 10, 0] }}
        transition={{ delay: 1.5, y: { repeat: Infinity, duration: 1.5 } }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2"
      >
        <a href="#education" className="text-muted-foreground hover:text-primary transition-colors">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="7 13 12 18 17 13" />
            <polyline points="7 6 12 11 17 6" />
          </svg>
        </a>
      </motion.div>
    </section>
  );
};

export default HeroSection;
