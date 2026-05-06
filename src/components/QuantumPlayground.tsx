import { useMemo, useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Text } from "@react-three/drei";
import { motion } from "framer-motion";
import { Atom, Trash2, Plus } from "lucide-react";
import * as THREE from "three";

// Complex number helpers ----------------------------------------------------
type C = { re: number; im: number };
const c = (re: number, im = 0): C => ({ re, im });
const cAdd = (a: C, b: C): C => ({ re: a.re + b.re, im: a.im + b.im });
const cMul = (a: C, b: C): C => ({
  re: a.re * b.re - a.im * b.im,
  im: a.re * b.im + a.im * b.re,
});

type State = [C, C]; // |ψ⟩ = α|0⟩ + β|1⟩
type Mat = [[C, C], [C, C]];

const apply = (m: Mat, s: State): State => [
  cAdd(cMul(m[0][0], s[0]), cMul(m[0][1], s[1])),
  cAdd(cMul(m[1][0], s[0]), cMul(m[1][1], s[1])),
];

const SQRT1_2 = Math.SQRT1_2;

const GATES: Record<string, { label: string; mat: Mat; color: string }> = {
  H: {
    label: "H",
    color: "#06b6d4",
    mat: [
      [c(SQRT1_2), c(SQRT1_2)],
      [c(SQRT1_2), c(-SQRT1_2)],
    ],
  },
  X: { label: "X", color: "#f43f5e", mat: [[c(0), c(1)], [c(1), c(0)]] },
  Y: { label: "Y", color: "#a855f7", mat: [[c(0), c(0, -1)], [c(0, 1), c(0)]] },
  Z: { label: "Z", color: "#22c55e", mat: [[c(1), c(0)], [c(0), c(-1)]] },
  S: { label: "S", color: "#eab308", mat: [[c(1), c(0)], [c(0), c(0, 1)]] },
  T: {
    label: "T",
    color: "#ec4899",
    mat: [[c(1), c(0)], [c(0), { re: SQRT1_2, im: SQRT1_2 }]],
  },
};

// Convert state to Bloch sphere coordinates (x, y, z).
function stateToBloch(s: State): [number, number, number] {
  // x = 2 Re(α* β), y = 2 Im(α* β), z = |α|^2 - |β|^2
  const aConj: C = { re: s[0].re, im: -s[0].im };
  const ab = cMul(aConj, s[1]);
  const x = 2 * ab.re;
  const y = 2 * ab.im;
  const z = s[0].re ** 2 + s[0].im ** 2 - (s[1].re ** 2 + s[1].im ** 2);
  return [x, y, z];
}

function BlochSphere({ vec }: { vec: [number, number, number] }) {
  const [x, y, z] = vec;
  // Three.js: y-up. Map physics z → three y so |0⟩ is at top.
  const tip: [number, number, number] = [x, z, y];
  return (
    <Canvas camera={{ position: [2.4, 1.6, 2.4], fov: 45 }}>
      <ambientLight intensity={0.7} />
      <pointLight position={[5, 5, 5]} />
      {/* Sphere */}
      <mesh>
        <sphereGeometry args={[1, 48, 48]} />
        <meshBasicMaterial color="#0a1525" transparent opacity={0.35} />
      </mesh>
      <mesh>
        <sphereGeometry args={[1.001, 24, 24]} />
        <meshBasicMaterial color="#1e3a5f" wireframe transparent opacity={0.4} />
      </mesh>
      {/* Axes */}
      <Line points={[[-1.2, 0, 0], [1.2, 0, 0]]} color="#ef4444" lineWidth={1} />
      <Line points={[[0, -1.2, 0], [0, 1.2, 0]]} color="#22c55e" lineWidth={1} />
      <Line points={[[0, 0, -1.2], [0, 0, 1.2]]} color="#3b82f6" lineWidth={1} />
      <Text position={[0, 1.35, 0]} fontSize={0.15} color="#fff">|0⟩</Text>
      <Text position={[0, -1.35, 0]} fontSize={0.15} color="#fff">|1⟩</Text>
      <Text position={[1.35, 0, 0]} fontSize={0.13} color="#fca5a5">+x</Text>
      <Text position={[0, 0, 1.35]} fontSize={0.13} color="#93c5fd">+y</Text>
      {/* State vector */}
      <Line points={[[0, 0, 0], tip]} color="#ec4899" lineWidth={3} />
      <mesh position={tip}>
        <sphereGeometry args={[0.05, 16, 16]} />
        <meshBasicMaterial color="#ec4899" />
      </mesh>
      <OrbitControls enablePan={false} />
    </Canvas>
  );
}

const fmt = (z: C) => {
  const r = Math.abs(z.re) < 1e-6 ? 0 : z.re;
  const i = Math.abs(z.im) < 1e-6 ? 0 : z.im;
  if (i === 0) return r.toFixed(3);
  if (r === 0) return `${i.toFixed(3)}i`;
  return `${r.toFixed(3)}${i >= 0 ? "+" : ""}${i.toFixed(3)}i`;
};

const QuantumPlayground = () => {
  const [circuit, setCircuit] = useState<string[]>(["H"]);
  const initial: State = [c(1), c(0)];
  const finalState = useMemo(
    () => circuit.reduce<State>((s, g) => apply(GATES[g].mat, s), initial),
    [circuit],
  );
  const bloch = stateToBloch(finalState);
  const p0 = finalState[0].re ** 2 + finalState[0].im ** 2;
  const p1 = finalState[1].re ** 2 + finalState[1].im ** 2;

  return (
    <section id="quantum" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <Atom className="w-7 h-7" /> Quantum Circuit Playground
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-10">
          Drop single-qubit gates onto the wire and watch the Bloch sphere evolve.
        </p>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Builder */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl p-5 flex flex-col gap-4"
          >
            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                Gate palette
              </h3>
              <div className="flex flex-wrap gap-2">
                {Object.entries(GATES).map(([k, g]) => (
                  <button
                    key={k}
                    onClick={() => setCircuit((p) => [...p, k])}
                    className="w-10 h-10 rounded-lg font-mono text-sm font-bold text-white inline-flex items-center justify-center hover:scale-110 transition-transform"
                    style={{ background: g.color }}
                    title={`Apply ${g.label} gate`}
                  >
                    {g.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Circuit (|0⟩ → ...)
                </h3>
                <button
                  onClick={() => setCircuit([])}
                  className="text-xs text-muted-foreground hover:text-destructive inline-flex items-center gap-1"
                >
                  <Trash2 className="w-3 h-3" /> Clear
                </button>
              </div>
              <div className="bg-muted/30 rounded-lg p-4 min-h-[64px] flex items-center gap-2 flex-wrap">
                <span className="text-xs text-muted-foreground font-mono">|0⟩ ─</span>
                {circuit.length === 0 && (
                  <span className="text-xs text-muted-foreground italic">empty — click a gate above</span>
                )}
                {circuit.map((g, i) => (
                  <button
                    key={i}
                    onClick={() => setCircuit((p) => p.filter((_, j) => j !== i))}
                    className="w-9 h-9 rounded-md font-mono text-sm font-bold text-white inline-flex items-center justify-center hover:opacity-80"
                    style={{ background: GATES[g].color }}
                    title="Remove"
                  >
                    {g}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                State vector
              </h3>
              <div className="font-mono text-sm space-y-1 text-foreground">
                <div>|ψ⟩ = <span className="text-primary">{fmt(finalState[0])}</span> |0⟩ + <span className="text-secondary">{fmt(finalState[1])}</span> |1⟩</div>
                <div className="text-xs text-muted-foreground">
                  P(|0⟩) = {p0.toFixed(3)} · P(|1⟩) = {p1.toFixed(3)}
                </div>
              </div>
            </div>
          </motion.div>

          {/* Bloch sphere */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="glass rounded-2xl overflow-hidden h-[420px]"
          >
            <BlochSphere vec={bloch} />
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default QuantumPlayground;