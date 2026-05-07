import { useState } from "react";
import { Sparkles, Play } from "lucide-react";

/**
 * CHSH Bell test: Alice picks angle A∈{0, π/4}, Bob picks B∈{π/8, 3π/8}.
 * Quantum correlation E(A,B) = -cos(2(A-B)) for the singlet state.
 * Classical (local hidden variable) bound: |S| ≤ 2.  Quantum reaches 2√2.
 */
const angles = [
  { name: "A0", v: 0 },
  { name: "A1", v: Math.PI / 4 },
  { name: "B0", v: Math.PI / 8 },
  { name: "B1", v: 3 * Math.PI / 8 },
];

const sample = (alice: number, bob: number, mode: "quantum" | "classical") => {
  if (mode === "quantum") {
    const p = 0.5 * (1 - Math.cos(2 * (alice - bob))); // P(differ)
    return Math.random() < p ? -1 : 1;
  }
  const lambda = Math.random() * 2 * Math.PI;
  const a = Math.cos(lambda - alice) > 0 ? 1 : -1;
  const b = Math.cos(lambda - bob) > 0 ? 1 : -1;
  return a * b;
};

const BellInequality = () => {
  const [mode, setMode] = useState<"quantum" | "classical">("quantum");
  const [stats, setStats] = useState({ trials: 0, S: 0, e: [0, 0, 0, 0] as number[] });

  const run = () => {
    const N = 1000;
    const totals = [0, 0, 0, 0];
    for (let n = 0; n < N; n++) {
      totals[0] += sample(angles[0].v, angles[2].v, mode); // E(A0,B0)
      totals[1] += sample(angles[0].v, angles[3].v, mode); // E(A0,B1)
      totals[2] += sample(angles[1].v, angles[2].v, mode); // E(A1,B0)
      totals[3] += sample(angles[1].v, angles[3].v, mode); // E(A1,B1)
    }
    const e = totals.map((t) => t / N);
    const S = e[0] - e[1] + e[2] + e[3];
    setStats({ trials: N, S, e });
  };

  const violated = Math.abs(stats.S) > 2;

  return (
    <section id="bell" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <Sparkles className="w-7 h-7" /> Bell Inequality (CHSH)
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-6">
          Classical local-realism caps |S| at 2. Quantum mechanics breaks the cap and tops out at 2√2 ≈ 2.828.
        </p>
        <div className="glass rounded-2xl p-6">
          <div className="flex justify-center gap-2 mb-4">
            {(["quantum", "classical"] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)} className={`px-4 py-2 rounded-full text-xs ${mode === m ? "bg-primary text-primary-foreground" : "glass"}`}>
                {m === "quantum" ? "Entangled qubits" : "Local hidden variables"}
              </button>
            ))}
          </div>
          <div className="flex justify-center mb-6">
            <button onClick={run} className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs flex items-center gap-1.5">
              <Play className="w-3 h-3" /> Run 1000 trials
            </button>
          </div>
          {stats.trials > 0 && (
            <div className="space-y-3 text-sm font-mono">
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div>E(A₀,B₀) = {stats.e[0].toFixed(3)}</div>
                <div>E(A₀,B₁) = {stats.e[1].toFixed(3)}</div>
                <div>E(A₁,B₀) = {stats.e[2].toFixed(3)}</div>
                <div>E(A₁,B₁) = {stats.e[3].toFixed(3)}</div>
              </div>
              <div className={`text-center text-2xl font-bold ${violated ? "text-primary" : "text-muted-foreground"}`}>
                S = {stats.S.toFixed(3)}
              </div>
              <p className="text-center text-xs text-muted-foreground">
                {violated ? "✨ Bell inequality violated — no local hidden variable theory can explain this." : "Within classical bound |S| ≤ 2."}
              </p>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default BellInequality;