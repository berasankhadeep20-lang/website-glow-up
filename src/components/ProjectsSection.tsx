import { motion } from "framer-motion";

const projects = [
  {
    title: "F1 AI Race Predictor",
    desc: "Machine learning system to predict Formula 1 race outcomes using historical race data, driver statistics, and race analytics.",
    url: "https://github.com/berasankhadeep20-lang/F1-AI-Predictor",
  },
  {
    title: "LLM for Stock Market Analysis",
    desc: "A Large Language Model project to analyze stock market data, generate insights, and assist in financial decision making.",
    url: "https://github.com/berasankhadeep20-lang/LLM-For-stock-market",
  },
  {
    title: "AI Football Match Outcome Predictor",
    desc: "ML model that predicts football match outcomes using historical match statistics and team performance metrics.",
    url: "https://github.com/berasankhadeep20-lang/AI-Football-Match-Outcome-Predictor",
  },
];

const ProjectsSection = () => (
  <section id="projects" className="py-24 px-6">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold gradient-text mb-12 text-center">Projects</h2>
      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((p, i) => (
          <motion.a
            key={p.title}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.1 }}
            className="glass rounded-2xl p-6 hover:-translate-y-2 hover:glow-primary transition-all group block"
          >
            <h3 className="text-primary font-semibold mb-3 group-hover:text-accent transition-colors">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed">{p.desc}</p>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

export default ProjectsSection;
