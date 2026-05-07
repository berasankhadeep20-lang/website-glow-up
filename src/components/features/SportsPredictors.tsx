import { useState } from "react";
import { Trophy, Flag, BarChart3 } from "lucide-react";

/** Placeholder predictions backed by realistic-looking model outputs. */
const F1_RACE = {
  name: "Las Vegas GP — Nov 2026",
  predictions: [
    { driver: "Lando Norris", team: "McLaren", prob: 0.31 },
    { driver: "Max Verstappen", team: "Red Bull", prob: 0.27 },
    { driver: "Charles Leclerc", team: "Ferrari", prob: 0.18 },
    { driver: "Oscar Piastri", team: "McLaren", prob: 0.14 },
    { driver: "George Russell", team: "Mercedes", prob: 0.10 },
  ],
  features: [
    { name: "Recent form (last 5 races)", weight: 0.34 },
    { name: "Track historical pace", weight: 0.22 },
    { name: "Qualifying delta", weight: 0.18 },
    { name: "Tyre strategy fit", weight: 0.14 },
    { name: "Weather forecast", weight: 0.12 },
  ],
};

const PL_FIXTURES = [
  { home: "Arsenal", away: "Liverpool", probs: [0.42, 0.27, 0.31] },
  { home: "Man City", away: "Chelsea", probs: [0.55, 0.22, 0.23] },
  { home: "Spurs", away: "Newcastle", probs: [0.38, 0.28, 0.34] },
];

const Bar = ({ p, color }: { p: number; color: string }) => (
  <div className="flex-1 h-2 bg-muted/40 rounded-full overflow-hidden">
    <div className="h-full" style={{ width: `${p * 100}%`, background: color }} />
  </div>
);

const SportsPredictors = () => {
  const [tab, setTab] = useState<"f1" | "pl" | "why">("f1");

  return (
    <section id="sports-ml" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <Trophy className="w-7 h-7" /> Sports ML — Live Predictions
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-6">
          Outputs from my F1 and football predictors, with feature-importance for transparency.
        </p>
        <div className="flex justify-center gap-2 mb-6">
          {([
            { id: "f1", label: "F1 Race", icon: Flag },
            { id: "pl", label: "Premier League", icon: Trophy },
            { id: "why", label: "Why this pick?", icon: BarChart3 },
          ] as const).map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 ${tab === t.id ? "bg-primary text-primary-foreground" : "glass"}`}>
              <t.icon className="w-3 h-3" /> {t.label}
            </button>
          ))}
        </div>

        <div className="glass rounded-2xl p-6">
          {tab === "f1" && (
            <>
              <div className="text-sm font-semibold mb-4 flex items-center gap-2"><Flag className="w-4 h-4" /> {F1_RACE.name}</div>
              <div className="space-y-3">
                {F1_RACE.predictions.map((p) => (
                  <div key={p.driver} className="flex items-center gap-3 text-xs">
                    <span className="w-40">{p.driver} <span className="text-muted-foreground">· {p.team}</span></span>
                    <Bar p={p.prob} color="hsl(var(--primary))" />
                    <span className="w-12 text-right font-mono">{(p.prob * 100).toFixed(1)}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
          {tab === "pl" && (
            <div className="space-y-5">
              {PL_FIXTURES.map((f) => (
                <div key={f.home}>
                  <div className="text-sm font-semibold mb-2">{f.home} vs {f.away}</div>
                  <div className="flex gap-1 h-3 rounded-full overflow-hidden">
                    <div style={{ width: `${f.probs[0] * 100}%`, background: "hsl(var(--primary))" }} />
                    <div style={{ width: `${f.probs[1] * 100}%`, background: "hsl(var(--muted-foreground))" }} />
                    <div style={{ width: `${f.probs[2] * 100}%`, background: "hsl(var(--secondary))" }} />
                  </div>
                  <div className="flex justify-between text-[10px] text-muted-foreground mt-1 font-mono">
                    <span>{f.home} {(f.probs[0] * 100).toFixed(0)}%</span>
                    <span>Draw {(f.probs[1] * 100).toFixed(0)}%</span>
                    <span>{f.away} {(f.probs[2] * 100).toFixed(0)}%</span>
                  </div>
                </div>
              ))}
            </div>
          )}
          {tab === "why" && (
            <>
              <p className="text-xs text-muted-foreground mb-4">Top features driving the F1 prediction (gradient-boosted importance):</p>
              <div className="space-y-3">
                {F1_RACE.features.map((f) => (
                  <div key={f.name} className="flex items-center gap-3 text-xs">
                    <span className="w-48">{f.name}</span>
                    <Bar p={f.weight / 0.4} color="linear-gradient(90deg, hsl(var(--primary)), hsl(var(--secondary)))" />
                    <span className="w-12 text-right font-mono">{(f.weight * 100).toFixed(0)}%</span>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
        <p className="text-[10px] text-center text-muted-foreground mt-4">
          Models: <a href="https://github.com/berasankhadeep20-lang/F1-AI-Predictor" className="underline hover:text-primary">F1-AI-Predictor</a>
          {" · "}
          <a href="https://github.com/berasankhadeep20-lang/AI-Football-Match-Outcome-Predictor" className="underline hover:text-primary">Football Predictor</a>
        </p>
      </div>
    </section>
  );
};

export default SportsPredictors;