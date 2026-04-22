import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, X } from "lucide-react";

const KONAMI = [
  "ArrowUp",
  "ArrowUp",
  "ArrowDown",
  "ArrowDown",
  "ArrowLeft",
  "ArrowRight",
  "ArrowLeft",
  "ArrowRight",
  "b",
  "a",
];

const FUN_FACTS = [
  "I edit videos in DaVinci Resolve for fun — colour grading is meditation.",
  "First language I fell for: Python. First language I respected: C.",
  "Favorite physicist: Feynman. Favorite quote: 'I learned very early the difference between knowing the name of something and knowing something.'",
  "I once debugged a Qiskit circuit at 3 AM and called it a personality trait.",
  "Currently obsessed with the intersection of ML and dynamical systems.",
  "I scored 94.89 percentile in JEE Mains 2025 — but the Kolkata street food got me first.",
  "Type 'help' in the terminal section. There's more there than you'd expect.",
  "If I weren't doing physics, I'd probably be a Formula 1 strategist.",
];

const KonamiEasterEgg = () => {
  const [open, setOpen] = useState(false);
  const [buffer, setBuffer] = useState<string[]>([]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      // Skip while typing
      const tag = (e.target as HTMLElement)?.tagName?.toLowerCase();
      if (tag === "input" || tag === "textarea") return;

      const next = [...buffer, e.key].slice(-KONAMI.length);
      setBuffer(next);
      const matches = KONAMI.every((k, i) => k.toLowerCase() === (next[i] || "").toLowerCase());
      if (matches) {
        setOpen(true);
        setBuffer([]);
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [buffer]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[80] bg-background/80 backdrop-blur-md flex items-center justify-center px-4"
        >
          <motion.div
            initial={{ scale: 0.8, y: 30 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.8, y: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="glass rounded-3xl p-8 max-w-lg w-full relative"
          >
            <button
              onClick={() => setOpen(false)}
              className="absolute top-4 right-4 text-muted-foreground hover:text-primary"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full gradient-bg flex items-center justify-center">
                <Sparkles className="w-6 h-6 text-primary-foreground" />
              </div>
              <div>
                <h3 className="text-xl font-bold gradient-text">You found the secret!</h3>
                <p className="text-xs text-muted-foreground">↑↑↓↓←→←→BA — classic.</p>
              </div>
            </div>
            <div className="space-y-3 max-h-80 overflow-y-auto scrollbar-thin pr-2">
              {FUN_FACTS.map((fact, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.05 }}
                  className="flex gap-3 text-sm"
                >
                  <span className="text-primary font-mono">{(i + 1).toString().padStart(2, "0")}</span>
                  <span className="text-muted-foreground">{fact}</span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default KonamiEasterEgg;