import { motion } from "framer-motion";
import { Calendar, BookOpen, Code2, Lightbulb, Music } from "lucide-react";

const items = [
  {
    icon: BookOpen,
    title: "Learning",
    text: "Quantum computing fundamentals via Qiskit + statistical mechanics for the upcoming semester.",
  },
  {
    icon: Code2,
    title: "Building",
    text: "Refining the F1 AI Race Predictor with new race-by-race tire-degradation features.",
  },
  {
    icon: Lightbulb,
    title: "Exploring",
    text: "The intersection of machine learning and dynamical systems — chaos, attractors, prediction limits.",
  },
  {
    icon: Music,
    title: "Off-screen",
    text: "Editing short docs in DaVinci Resolve, listening to too much lo-fi while debugging.",
  },
];

const NowSection = () => {
  const updated = new Date().toLocaleDateString("en-US", { month: "long", year: "numeric" });
  return (
    <section id="now" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-12"
        >
          <h2 className="text-3xl font-bold gradient-text mb-2">Now</h2>
          <p className="text-muted-foreground text-sm inline-flex items-center gap-2">
            <Calendar className="w-3.5 h-3.5" /> What I'm focused on · {updated}
          </p>
        </motion.div>

        <div className="grid sm:grid-cols-2 gap-4">
          {items.map((item, i) => {
            const Icon = item.icon;
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08 }}
                className="glass rounded-2xl p-5 hover:-translate-y-1 transition-transform"
              >
                <div className="flex items-center gap-3 mb-2">
                  <div className="w-9 h-9 rounded-lg gradient-bg flex items-center justify-center flex-shrink-0">
                    <Icon className="w-4 h-4 text-primary-foreground" />
                  </div>
                  <h3 className="font-semibold">{item.title}</h3>
                </div>
                <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
              </motion.div>
            );
          })}
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          Inspired by{" "}
          <a
            href="https://nownownow.com/about"
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            the /now movement
          </a>
          .
        </p>
      </div>
    </section>
  );
};

export default NowSection;