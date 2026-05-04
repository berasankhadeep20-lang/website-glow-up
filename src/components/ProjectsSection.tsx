import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Github, Star, GitFork, ExternalLink, X } from "lucide-react";
import { useTilt } from "@/hooks/useTilt";
import { useSound } from "@/contexts/SoundContext";
import TechBadge from "@/components/TechBadge";

interface Project {
  title: string;
  desc: string;
  longDesc: string;
  url: string;
  repo: string; // owner/name
  tags: string[];
  emoji: string;
  highlights: string[];
  demoUrl?: string;
}

const projects: Project[] = [
  {
    title: "F1 AI Race Predictor",
    desc: "ML system predicting Formula 1 race outcomes using historical data, driver stats, and analytics.",
    longDesc:
      "A gradient-boosted ML pipeline that ingests historical race telemetry, qualifying times, weather and driver form to forecast podium positions for upcoming Grand Prix events. Engineered with feature pipelines for circuit-specific bias and tyre strategy.",
    url: "https://github.com/berasankhadeep20-lang/F1-AI-Predictor",
    repo: "berasankhadeep20-lang/F1-AI-Predictor",
    tags: ["Python", "scikit-learn", "Pandas", "ML"],
    emoji: "🏎️",
    highlights: [
      "End-to-end data pipeline from raw race CSVs to predictions",
      "Per-circuit feature engineering (street vs permanent track)",
      "Backtested across multiple recent F1 seasons",
    ],
  },
  {
    title: "LLM for Stock Market",
    desc: "LLM-based project analyzing stock market data and generating financial insights.",
    longDesc:
      "Combines structured market data with LLM-powered narrative generation to surface insights, summarise earnings sentiment and produce explainable forecasts for retail investors.",
    url: "https://github.com/berasankhadeep20-lang/LLM-For-stock-market",
    repo: "berasankhadeep20-lang/LLM-For-stock-market",
    tags: ["LLM", "Finance", "NLP", "Python"],
    emoji: "📈",
    highlights: [
      "Prompt-tuned analysis of price + fundamentals",
      "Sentiment scoring on news and earnings reports",
      "Generates plain-English daily briefs",
    ],
  },
  {
    title: "AI Football Predictor",
    desc: "ML model predicting football match outcomes using team stats and historical metrics.",
    longDesc:
      "A classification model that predicts win/draw/loss using team strength ratings, recent form, head-to-head history, and home/away effects. Includes calibration so probabilities are usable for betting analytics or fan dashboards.",
    url: "https://github.com/berasankhadeep20-lang/AI-Football-Match-Outcome-Predictor",
    repo: "berasankhadeep20-lang/AI-Football-Match-Outcome-Predictor",
    tags: ["Python", "ML", "Sports Analytics"],
    emoji: "⚽",
    highlights: [
      "Feature set spanning ELO ratings + recent form",
      "Probability calibration via isotonic regression",
      "Multi-league training data",
    ],
  },
  {
    title: "Freight Rate Intelligence",
    desc: "Zero-cost freight market dashboard built on public equity proxies and Fed data — auto-updated every 6 hours.",
    longDesc:
      "Most logistics intelligence (Freightos, DAT, Baltic Exchange) is locked behind expensive APIs. Instead, this pipeline tracks publicly traded freight movers — BDRY (Baltic Dry), ZIM (container spot), XPO (LTL trucking) — as real-time proxies for the underlying rate environment. Combined with FRED macro series, it surfaces week-over-week shifts, anomaly z-scores, and cross-modal contagion via a Pearson correlation matrix. Total infra cost: $0.",
    url: "https://github.com/berasankhadeep20-lang",
    repo: "berasankhadeep20-lang/freight-rate-intelligence",
    tags: ["Python", "yfinance", "FRED", "SQLite", "GitHub Actions"],
    emoji: "🚢",
    highlights: [
      "6 market proxies via yfinance + 2 FRED macro series — no paid keys",
      "SQLite store with dedup so re-runs never corrupt history",
      "WoW % change + rolling Z-score anomaly alerts",
      "Pearson correlation matrix for cross-modal contagion signals",
      "GitHub Actions cron every 6h, auto-deploy to GitHub Pages",
    ],
    demoUrl: "https://lnkd.in/gPsc-xW4",
  },
];

const TiltCard = ({ p, onClick, i }: { p: Project; onClick: () => void; i: number }) => {
  const tilt = useTilt(8);
  const { play } = useSound();
  return (
    <motion.div
      initial={{ opacity: 0, y: 40 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: i * 0.1, type: "spring" }}
      ref={tilt.ref}
      onMouseMove={tilt.onMouseMove}
      onMouseLeave={tilt.onMouseLeave}
      style={tilt.style}
      onClick={() => {
        play("open");
        onClick();
      }}
      className="glass rounded-2xl p-6 group block relative overflow-hidden cursor-pointer"
    >
      <div
        className="absolute inset-0 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none"
        style={{
          background:
            "linear-gradient(135deg, hsl(var(--primary) / 0.15), hsl(var(--secondary) / 0.15))",
        }}
      />
      <div className="text-3xl mb-3">{p.emoji}</div>
      <h3 className="text-primary font-semibold mb-2 group-hover:gradient-text transition-colors">
        {p.title}
      </h3>
      <p className="text-sm text-muted-foreground leading-relaxed mb-4">{p.desc}</p>
      <div className="flex flex-wrap gap-2">
        {p.tags.map((tag) => (
          <TechBadge key={tag} tag={tag} />
        ))}
      </div>
      <div className="absolute top-5 right-5 text-muted-foreground group-hover:text-primary transition-colors text-sm">
        ↗
      </div>
    </motion.div>
  );
};

const ProjectModal = ({ p, onClose }: { p: Project; onClose: () => void }) => {
  const [stats, setStats] = useState<{ stars: number; forks: number; updated?: string } | null>(null);
  useEffect(() => {
    fetch(`https://api.github.com/repos/${p.repo}`)
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (d)
          setStats({
            stars: d.stargazers_count || 0,
            forks: d.forks_count || 0,
            updated: d.pushed_at,
          });
      })
      .catch(() => {});
  }, [p.repo]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={onClose}
      className="fixed inset-0 z-[55] bg-background/80 backdrop-blur-sm flex items-start justify-center p-4 overflow-y-auto"
    >
      <motion.div
        initial={{ scale: 0.95, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.95, y: 20 }}
        onClick={(e) => e.stopPropagation()}
        className="glass rounded-2xl max-w-2xl w-full my-8 overflow-hidden"
      >
        <div className="p-6 sm:p-8">
          <button
            onClick={onClose}
            className="float-right text-muted-foreground hover:text-primary"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
          <div className="text-4xl mb-3">{p.emoji}</div>
          <h3 className="text-2xl font-bold gradient-text mb-2">{p.title}</h3>
          <p className="text-sm text-muted-foreground mb-5">{p.longDesc}</p>

          <div className="flex flex-wrap gap-3 mb-6 text-xs">
            <a
              href={p.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-full gradient-bg text-primary-foreground"
            >
              <Github className="w-3.5 h-3.5" /> View on GitHub
            </a>
            {p.demoUrl && (
              <a
                href={p.demoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-primary text-primary"
              >
                <ExternalLink className="w-3.5 h-3.5" /> Live Demo
              </a>
            )}
            {stats && (
              <>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass">
                  <Star className="w-3.5 h-3.5" /> {stats.stars}
                </span>
                <span className="flex items-center gap-1.5 px-3 py-1.5 rounded-full glass">
                  <GitFork className="w-3.5 h-3.5" /> {stats.forks}
                </span>
              </>
            )}
          </div>

          <div>
            <h4 className="text-xs font-semibold uppercase tracking-wider text-primary mb-2">
              Highlights
            </h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              {p.highlights.map((h) => (
                <li key={h} className="flex gap-2">
                  <span className="text-primary">›</span>
                  <span>{h}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-wrap gap-2 mt-6">
            {p.tags.map((t) => (
              <TechBadge key={t} tag={t} size="md" />
            ))}
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
};

const ProjectsSection = () => {
  const [open, setOpen] = useState<Project | null>(null);
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: "Sankhadeep Bera — Projects",
    itemListElement: projects.map((p, i) => ({
      "@type": "ListItem",
      position: i + 1,
      item: {
        "@type": "SoftwareSourceCode",
        name: p.title,
        description: p.longDesc,
        codeRepository: p.url,
        programmingLanguage: p.tags.filter((t) =>
          ["Python", "Java", "TypeScript", "JavaScript"].includes(t)
        ),
        keywords: p.tags.join(", "),
        author: { "@type": "Person", name: "Sankhadeep Bera" },
        ...(p.demoUrl ? { url: p.demoUrl } : {}),
      },
    })),
  };
  return (
    <section id="projects" className="py-24 px-6">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-4 text-center">Projects</h2>
        <p className="text-center text-muted-foreground text-sm mb-12">
          Click any card to see details, highlights, and live GitHub stats
        </p>
        <div className="grid md:grid-cols-3 gap-6">
          {projects.map((p, i) => (
            <TiltCard key={p.title} p={p} i={i} onClick={() => setOpen(p)} />
          ))}
        </div>
      </div>
      <AnimatePresence>{open && <ProjectModal p={open} onClose={() => setOpen(null)} />}</AnimatePresence>
    </section>
  );
};

export default ProjectsSection;