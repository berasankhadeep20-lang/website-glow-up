import { useState } from "react";
import { Cpu, Play } from "lucide-react";

type Algo = {
  id: string;
  name: string;
  blurb: string;
  circuit: string[];
  run: () => { label: string; value: number }[];
};

// Grover with 3 qubits, marked state |101>
function groverSim() {
  const N = 8;
  const amp = new Array(N).fill(1 / Math.sqrt(N));
  const marked = 5;
  for (let it = 0; it < 2; it++) {
    amp[marked] *= -1;
    const mean = amp.reduce((a, b) => a + b, 0) / N;
    for (let i = 0; i < N; i++) amp[i] = 2 * mean - amp[i];
  }
  return amp.map((a, i) => ({ label: `|${i.toString(2).padStart(3, "0")}⟩`, value: a * a }));
}

// QAOA toy: probability across 4 bitstrings for MaxCut on a triangle
function qaoaSim() {
  const probs = [0.05, 0.4, 0.4, 0.05, 0.03, 0.03, 0.02, 0.02];
  return probs.map((p, i) => ({ label: `|${i.toString(2).padStart(3, "0")}⟩`, value: p }));
}

// Shor toy: order finding for N=15, a=7 → period = 4 → peaks at multiples of 8/4=2
function shorSim() {
  const out = new Array(8).fill(0);
  out[0] = 0.25; out[2] = 0.25; out[4] = 0.25; out[6] = 0.25;
  return out.map((p, i) => ({ label: `${i}`, value: p }));
}

const ALGOS: Algo[] = [
  {
    id: "grover",
    name: "Grover's Search",
    blurb: "Finds a marked item in N entries with O(√N) queries vs classical O(N).",
    circuit: ["H ─── O ─── D ─── O ─── D ─── M", "H ─── O ─── D ─── O ─── D ─── M", "H ─── O ─── D ─── O ─── D ─── M"],
    run: groverSim,
  },
  {
    id: "qaoa",
    name: "QAOA (MaxCut)",
    blurb: "Variational quantum optimizer alternating cost (γ) and mixer (β) layers.",
    circuit: ["H ─── ZZ(γ) ─── RX(β) ─── M", "H ─── ZZ(γ) ─── RX(β) ─── M", "H ─── ZZ(γ) ─── RX(β) ─── M"],
    run: qaoaSim,
  },
  {
    id: "shor",
    name: "Shor's Algorithm",
    blurb: "Period finding via QFT — basis of polynomial-time integer factorization.",
    circuit: ["H ─── U^1 ─── QFT⁻¹ ─── M", "H ─── U^2 ─── QFT⁻¹ ─── M", "H ─── U^4 ─── QFT⁻¹ ─── M"],
    run: shorSim,
  },
];

const QuantumAlgorithmShowcase = () => {
  const [active, setActive] = useState(ALGOS[0]);
  const [results, setResults] = useState<{ label: string; value: number }[]>([]);

  return (
    <section id="quantum-algos" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <Cpu className="w-7 h-7" /> Quantum Algorithm Showcase
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-6">Pick an algorithm, inspect the circuit, simulate.</p>
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {ALGOS.map((a) => (
            <button
              key={a.id}
              onClick={() => { setActive(a); setResults([]); }}
              className={`px-4 py-2 rounded-full text-xs transition-colors ${active.id === a.id ? "bg-primary text-primary-foreground" : "glass"}`}
            >
              {a.name}
            </button>
          ))}
        </div>
        <div className="glass rounded-2xl p-6">
          <p className="text-sm text-muted-foreground mb-4">{active.blurb}</p>
          <pre className="bg-muted/40 rounded-xl p-4 text-xs font-mono overflow-x-auto mb-4">
{active.circuit.map((row, i) => `q${i}: ${row}`).join("\n")}
          </pre>
          <button
            onClick={() => setResults(active.run())}
            className="px-4 py-2 rounded-full bg-primary text-primary-foreground text-xs flex items-center gap-1.5"
          >
            <Play className="w-3 h-3" /> Run simulation
          </button>
          {results.length > 0 && (
            <div className="mt-6 space-y-1.5">
              {results.map((r) => (
                <div key={r.label} className="flex items-center gap-3 text-xs font-mono">
                  <span className="w-16 text-muted-foreground">{r.label}</span>
                  <div className="flex-1 h-3 bg-muted/40 rounded-full overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-secondary" style={{ width: `${Math.abs(r.value) * 100}%` }} />
                  </div>
                  <span className="w-12 text-right">{(r.value * 100).toFixed(1)}%</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default QuantumAlgorithmShowcase;