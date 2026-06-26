import { useState } from "react";
import { Shield, Zap, RotateCcw } from "lucide-react";

/**
 * Toy distance-3 surface-code lattice (5×5 data qubits with X/Z stabilizers).
 * Clicking a data qubit injects an X error; stabilizers next to it light up.
 */
const SIZE = 5;

type Cell = { x: boolean; z: boolean }; // X / Z error flags

const QuantumErrorCorrection = () => {
  const [grid, setGrid] = useState<Cell[]>(() =>
    Array.from({ length: SIZE * SIZE }, () => ({ x: false, z: false })),
  );
  const [mode, setMode] = useState<"X" | "Z">("X");

  const flip = (i: number) => {
    setGrid((g) => g.map((c, k) => k === i ? { ...c, [mode.toLowerCase()]: !c[mode.toLowerCase() as "x" | "z"] } : c));
  };
  const reset = () => setGrid((g) => g.map(() => ({ x: false, z: false })));

  // Z-stabilizers sit at "even" plaquettes — measure parity of X errors on 4 neighbours
  // X-stabilizers measure parity of Z errors on 4 neighbours
  const stab = (cx: number, cy: number, kind: "X" | "Z") => {
    let parity = 0;
    for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
      const x = cx + dx, y = cy + dy;
      if (x < 0 || y < 0 || x >= SIZE || y >= SIZE) continue;
      const c = grid[y * SIZE + x];
      parity ^= (kind === "Z" ? (c.x ? 1 : 0) : (c.z ? 1 : 0));
    }
    return parity === 1;
  };

  return (
    <section id="qec" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <Shield className="w-7 h-7" /> Quantum Error Correction
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-6">
          Click a data qubit to inject an error. Stabiliser checks light up at the boundary of the error chain.
        </p>
        <div className="glass rounded-2xl p-6">
          <div className="flex justify-center gap-2 mb-4">
            {(["X", "Z"] as const).map((m) => (
              <button key={m} onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 ${mode === m ? "bg-primary text-primary-foreground" : "glass"}`}>
                <Zap className="w-3 h-3" /> Inject {m}
              </button>
            ))}
            <button onClick={reset} className="px-3 py-1.5 rounded-full glass text-xs flex items-center gap-1.5">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
          <div className="relative mx-auto" style={{ width: 360, height: 360 }}>
            {/* Stabilizer checks at half-integer positions */}
            {Array.from({ length: SIZE - 1 }).flatMap((_, sy) =>
              Array.from({ length: SIZE - 1 }).map((_, sx) => {
                const kind: "X" | "Z" = (sx + sy) % 2 === 0 ? "Z" : "X";
                const triggered = stab(sx + 0.5 | 0, sy + 0.5 | 0, kind);
                // approximate centre: between (sx,sy) and (sx+1,sy+1)
                const cellSize = 360 / SIZE;
                const left = (sx + 0.5) * cellSize + cellSize / 2 - 8;
                const top = (sy + 0.5) * cellSize + cellSize / 2 - 8;
                return (
                  <div key={`s${sx}-${sy}`} className={`absolute w-4 h-4 rounded-sm ${triggered ? (kind === "Z" ? "bg-pink-500 shadow-[0_0_12px] shadow-pink-500" : "bg-cyan-400 shadow-[0_0_12px] shadow-cyan-400") : "bg-muted/40"}`}
                    style={{ left, top }} title={`${kind} stabilizer`} />
                );
              })
            )}
            {/* Data qubits */}
            {grid.map((c, i) => {
              const x = i % SIZE, y = (i / SIZE) | 0;
              const cellSize = 360 / SIZE;
              const hasErr = c.x || c.z;
              return (
                <button key={i} onClick={() => flip(i)}
                  className={`absolute w-9 h-9 rounded-full border-2 transition-all ${hasErr ? "border-red-500 bg-red-500/40" : "border-border bg-card/60"} hover:scale-110`}
                  style={{ left: x * cellSize + cellSize / 2 - 18, top: y * cellSize + cellSize / 2 - 18 }}>
                  <span className="text-[10px] font-mono">{c.x ? "X" : ""}{c.z ? "Z" : ""}</span>
                </button>
              );
            })}
          </div>
          <div className="flex justify-center gap-4 mt-4 text-[11px] text-muted-foreground">
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-pink-500 inline-block" /> Z-check</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-cyan-400 inline-block" /> X-check</span>
            <span className="flex items-center gap-1"><span className="w-2 h-2 bg-red-500 rounded-full inline-block" /> Errored qubit</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default QuantumErrorCorrection;