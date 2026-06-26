import { useMemo, useState } from "react";
import { CircuitBoard, Trash2 } from "lucide-react";

type Gate = "H" | "X" | "Y" | "Z" | "S" | "T" | "CNOT" | "I";

const GATES_1Q: Gate[] = ["H", "X", "Y", "Z", "S", "T"];

type C = [number, number]; // complex
const cAdd = (a: C, b: C): C => [a[0] + b[0], a[1] + b[1]];
const cMul = (a: C, b: C): C => [a[0] * b[0] - a[1] * b[1], a[0] * b[1] + a[1] * b[0]];
const cAbs2 = (a: C) => a[0] * a[0] + a[1] * a[1];

const I: C[][] = [[[1,0],[0,0]],[[0,0],[1,0]]];
const H: C[][] = [[[1/Math.SQRT2,0],[1/Math.SQRT2,0]],[[1/Math.SQRT2,0],[-1/Math.SQRT2,0]]];
const X: C[][] = [[[0,0],[1,0]],[[1,0],[0,0]]];
const Y: C[][] = [[[0,0],[0,-1]],[[0,1],[0,0]]];
const Z: C[][] = [[[1,0],[0,0]],[[0,0],[-1,0]]];
const S: C[][] = [[[1,0],[0,0]],[[0,0],[0,1]]];
const Tg: C[][] = [[[1,0],[0,0]],[[0,0],[Math.SQRT1_2,Math.SQRT1_2]]];

const ONE_Q: Record<string, C[][]> = { H, X, Y, Z, S, T: Tg, I };

// 4x4 matmul
const mm = (A: C[][], B: C[][]): C[][] => {
  const n = A.length;
  const R: C[][] = Array.from({ length: n }, () => Array.from({ length: n }, () => [0, 0] as C));
  for (let i = 0; i < n; i++) for (let j = 0; j < n; j++) for (let k = 0; k < n; k++)
    R[i][j] = cAdd(R[i][j], cMul(A[i][k], B[k][j]));
  return R;
};

// tensor product g_top ⊗ g_bot for 2-qubit system (qubit 0 = top = high-order)
const tensor = (A: C[][], B: C[][]): C[][] => {
  const out: C[][] = Array.from({ length: 4 }, () => Array.from({ length: 4 }, () => [0, 0] as C));
  for (let i = 0; i < 2; i++) for (let j = 0; j < 2; j++)
    for (let k = 0; k < 2; k++) for (let l = 0; l < 2; l++)
      out[i * 2 + k][j * 2 + l] = cMul(A[i][j], B[k][l]);
  return out;
};

// CNOT with control=0, target=1
const CNOT: C[][] = [
  [[1,0],[0,0],[0,0],[0,0]],
  [[0,0],[1,0],[0,0],[0,0]],
  [[0,0],[0,0],[0,0],[1,0]],
  [[0,0],[0,0],[1,0],[0,0]],
];

type Slot = { top: Gate; bot: Gate; cnot?: boolean };

const QuantumCircuitBuilder = () => {
  const [slots, setSlots] = useState<Slot[]>([
    { top: "H", bot: "I" },
    { top: "I", bot: "I", cnot: true },
    { top: "I", bot: "I" },
  ]);

  const setGate = (i: number, wire: "top" | "bot", g: Gate) =>
    setSlots((s) => s.map((sl, k) => k === i ? { ...sl, [wire]: g, cnot: g === "CNOT" ? sl.cnot : sl.cnot } : sl));
  const toggleCNOT = (i: number) =>
    setSlots((s) => s.map((sl, k) => k === i ? { ...sl, cnot: !sl.cnot } : sl));
  const addSlot = () => setSlots((s) => [...s, { top: "I", bot: "I" }]);
  const clear = () => setSlots([{ top: "I", bot: "I" }]);

  const { state, probs } = useMemo(() => {
    let psi: C[] = [[1, 0], [0, 0], [0, 0], [0, 0]];
    for (const sl of slots) {
      let U: C[][] = tensor(ONE_Q[sl.top], ONE_Q[sl.bot]);
      if (sl.cnot) U = mm(CNOT, U);
      const next: C[] = [[0,0],[0,0],[0,0],[0,0]];
      for (let i = 0; i < 4; i++) for (let j = 0; j < 4; j++)
        next[i] = cAdd(next[i], cMul(U[i][j], psi[j]));
      psi = next;
    }
    return { state: psi, probs: psi.map(cAbs2) };
  }, [slots]);

  const labels = ["|00⟩", "|01⟩", "|10⟩", "|11⟩"];

  return (
    <section id="circuit" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <CircuitBoard className="w-7 h-7" /> Quantum Circuit Builder
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-6">
          Two-qubit playground. Tap a gate slot to cycle, toggle CNOT, watch the statevector update.
        </p>
        <div className="glass rounded-2xl p-6 space-y-6">
          <div className="overflow-x-auto">
            <div className="inline-flex items-center gap-2 min-w-full">
              <div className="flex flex-col gap-8 mr-2 text-xs font-mono text-muted-foreground">
                <span>q0</span><span>q1</span>
              </div>
              {slots.map((sl, i) => (
                <div key={i} className="flex flex-col items-center gap-2 relative">
                  <button onClick={() => {
                    const idx = GATES_1Q.indexOf(sl.top as any);
                    const next = GATES_1Q[(idx + 1) % GATES_1Q.length];
                    setGate(i, "top", sl.top === "I" ? "H" : (idx === GATES_1Q.length - 1 ? "I" : next));
                  }}
                    className={`w-12 h-12 rounded-lg border-2 font-mono text-sm ${sl.top !== "I" ? "border-primary bg-primary/20" : "border-border"}`}>
                    {sl.top === "I" ? "·" : sl.top}
                  </button>
                  <button onClick={() => toggleCNOT(i)}
                    className={`absolute left-1/2 -translate-x-1/2 top-12 w-2 h-12 ${sl.cnot ? "bg-secondary" : "bg-border"}`} />
                  <button onClick={() => {
                    const idx = GATES_1Q.indexOf(sl.bot as any);
                    const next = GATES_1Q[(idx + 1) % GATES_1Q.length];
                    setGate(i, "bot", sl.bot === "I" ? "H" : (idx === GATES_1Q.length - 1 ? "I" : next));
                  }}
                    className={`w-12 h-12 rounded-lg border-2 font-mono text-sm ${sl.bot !== "I" ? "border-secondary bg-secondary/20" : "border-border"}`}>
                    {sl.bot === "I" ? "·" : sl.bot}
                  </button>
                  <button onClick={() => toggleCNOT(i)}
                    className={`text-[10px] px-1.5 py-0.5 rounded ${sl.cnot ? "bg-secondary text-secondary-foreground" : "glass text-muted-foreground"}`}>
                    CNOT
                  </button>
                </div>
              ))}
              <button onClick={addSlot} className="ml-3 px-3 py-2 rounded-lg glass text-xs">+ Slot</button>
            </div>
          </div>

          <div className="flex flex-wrap gap-3 text-[10px] text-muted-foreground">
            <span>Click a gate cell to cycle through H · X · Y · Z · S · T · I.</span>
            <button onClick={clear} className="ml-auto px-2 py-1 rounded glass flex items-center gap-1">
              <Trash2 className="w-3 h-3" /> Clear
            </button>
          </div>

          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Statevector</div>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {state.map((c, i) => (
                <div key={i} className="glass rounded-xl p-3 text-center">
                  <div className="font-mono text-sm">{labels[i]}</div>
                  <div className="font-mono text-xs text-muted-foreground mt-1">
                    {c[0].toFixed(3)}{c[1] >= 0 ? "+" : ""}{c[1].toFixed(3)}i
                  </div>
                  <div className="mt-2 h-2 rounded-full bg-muted overflow-hidden">
                    <div className="h-full bg-gradient-to-r from-primary to-secondary"
                      style={{ width: `${probs[i] * 100}%` }} />
                  </div>
                  <div className="text-[10px] text-muted-foreground mt-1">P = {probs[i].toFixed(3)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuantumCircuitBuilder;