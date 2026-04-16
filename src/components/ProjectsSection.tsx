import { motion } from "framer-motion";

const projects = [
  {
    title: "F1 AI Race Predictor",
    desc: "ML system predicting Formula 1 race outcomes using historical data, driver stats, and analytics.",
    url: "https://github.com/berasankhadeep20-lang/F1-AI-Predictor",
    tags: ["Python", "ML", "Data Science"],
    emoji: "🏎️",
  },
  {
    title: "LLM for Stock Market",
    desc: "LLM-based project analyzing stock market data and generating financial insights.",
    url: "https://github.com/berasankhadeep20-lang/LLM-For-stock-market",
    tags: ["LLM", "Finance", "NLP"],
    emoji: "📈",
  },
  {
    title: "AI Football Predictor",
    desc: "ML model predicting football match outcomes using team stats and historical metrics.",
    url: "https://github.com/berasankhadeep20-lang/AI-Football-Match-Outcome-Predictor",
    tags: ["Python", "ML", "Sports"],
    emoji: "⚽",
  },
];

const ProjectsSection = () => (
  <section id="projects" className="py-24 px-6">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold gradient-text mb-4 text-center">Projects</h2>
      <p className="text-center text-muted-foreground text-sm mb-12">Click any card to view the repository</p>
      <div className="grid md:grid-cols-3 gap-6">
        {projects.map((p, i) => (
          <motion.a
            key={p.title}
            href={p.url}
            target="_blank"
            rel="noopener noreferrer"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.12, type: "spring" }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="glass rounded-2xl p-6 group block relative overflow-hidden"
          >
            {/* Gradient border on hover */}
            <div className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none" style={{ background: "linear-gradient(135deg, hsl(183 100% 50% / 0.15), hsl(295 100% 48% / 0.15))" }} />
            
            <div className="text-3xl mb-3">{p.emoji}</div>
            <h3 className="text-primary font-semibold mb-2 group-hover:gradient-text transition-colors">{p.title}</h3>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.desc}</p>
            <div className="flex flex-wrap gap-2">
              {p.tags.map((tag) => (
                <span key={tag} className="text-xs px-2.5 py-1 rounded-full bg-muted text-muted-foreground">
                  {tag}
                </span>
              ))}
            </div>
            {/* Arrow indicator */}
            <div className="absolute top-5 right-5 text-muted-foreground group-hover:text-primary transition-colors text-sm">
              ↗
            </div>
          </motion.a>
        ))}
      </div>
    </div>
  </section>
);

export default ProjectsSection;
