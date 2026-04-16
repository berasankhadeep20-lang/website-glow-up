import { motion } from "framer-motion";

const stats = [
  { value: "94.89%", label: "JEE Main 2025" },
  { value: "1596", label: "WBJEE 2025 Rank" },
  { value: "3065", label: "IAT Rank" },
];

const HeroSection = () => (
  <section className="min-h-screen flex items-center justify-center px-6 pt-20">
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
      </motion.div>

      <motion.h1
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className="text-4xl md:text-5xl font-bold mb-4"
      >
        Hello, I'm <span className="gradient-text">Sankhadeep Bera</span>
      </motion.h1>

      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-muted-foreground text-lg mb-2"
      >
        BS-MS Student | Programmer | Editor
      </motion.p>

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
        <a href="#education" className="gradient-bg text-primary-foreground px-6 py-2.5 rounded-full font-semibold hover:scale-105 transition-transform">
          View Journey
        </a>
        <a href="mailto:berasankhadeep20@gmail.com" className="border-2 border-primary text-primary px-6 py-2.5 rounded-full font-semibold hover:bg-primary hover:text-primary-foreground transition-all">
          Contact
        </a>
      </motion.div>

      <div className="flex justify-center gap-8 md:gap-16 flex-wrap">
        {stats.map((s, i) => (
          <motion.div
            key={s.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.8 + i * 0.1 }}
            className="glass rounded-2xl px-6 py-4 hover:-translate-y-1 transition-transform"
          >
            <div className="text-2xl font-bold text-primary">{s.value}</div>
            <div className="text-xs text-muted-foreground">{s.label}</div>
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default HeroSection;
