import { motion } from "framer-motion";

const skills = ["Python", "Java", "Quantum Computing (Qiskit)", "DaVinci Resolve Editing"];

const SkillsSection = () => (
  <section id="skills" className="py-24 px-6">
    <div className="max-w-4xl mx-auto text-center">
      <h2 className="text-3xl font-bold gradient-text mb-10">Skills</h2>
      <div className="flex flex-wrap gap-4 justify-center">
        {skills.map((s, i) => (
          <motion.span
            key={s}
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass px-5 py-2.5 rounded-full text-sm font-medium text-primary hover:glow-primary transition-shadow"
          >
            {s}
          </motion.span>
        ))}
      </div>
    </div>
  </section>
);

export default SkillsSection;
