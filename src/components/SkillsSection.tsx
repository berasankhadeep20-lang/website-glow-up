import { motion } from "framer-motion";
import { useState } from "react";
import SkillsConstellation from "./SkillsConstellation";

const skills = [
  { name: "Python", level: 85, icon: "🐍" },
  { name: "Java", level: 70, icon: "☕" },
  { name: "Quantum Computing (Qiskit)", level: 60, icon: "⚛️" },
  { name: "Machine Learning", level: 75, icon: "🤖" },
  { name: "DaVinci Resolve", level: 80, icon: "🎬" },
  { name: "Data Analysis", level: 65, icon: "📊" },
];

const SkillsSection = () => {
  const [view, setView] = useState<"bars" | "graph">("graph");
  return (
    <section id="skills" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center">Skills</h2>
        <p className="text-center text-muted-foreground text-sm mb-6">
          Drag the constellation, or switch to a classic view
        </p>
        <div className="flex justify-center gap-2 mb-8">
          <button
            onClick={() => setView("graph")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              view === "graph"
                ? "bg-primary text-primary-foreground glow-primary"
                : "glass text-muted-foreground hover:text-primary"
            }`}
          >
            ✦ Constellation
          </button>
          <button
            onClick={() => setView("bars")}
            className={`px-4 py-1.5 rounded-full text-xs font-medium transition-all ${
              view === "bars"
                ? "bg-primary text-primary-foreground glow-primary"
                : "glass text-muted-foreground hover:text-primary"
            }`}
          >
            ▤ Bars
          </button>
        </div>

        {view === "graph" ? (
          <SkillsConstellation />
        ) : (
          <div className="grid gap-5 max-w-2xl mx-auto">
            {skills.map((s, i) => (
              <motion.div
                key={s.name}
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-xl p-4 group hover:glow-primary transition-all"
              >
                <div className="flex justify-between items-center mb-2">
                  <span className="text-sm font-medium text-foreground">
                    <span className="mr-2">{s.icon}</span>
                    {s.name}
                  </span>
                  <span className="text-xs text-primary font-mono">{s.level}%</span>
                </div>
                <div className="h-2 rounded-full bg-muted overflow-hidden">
                  <motion.div
                    className="h-full rounded-full gradient-bg"
                    initial={{ width: 0 }}
                    whileInView={{ width: `${s.level}%` }}
                    viewport={{ once: true }}
                    transition={{ duration: 1.2, delay: i * 0.08, ease: "easeOut" }}
                  />
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

export default SkillsSection;
