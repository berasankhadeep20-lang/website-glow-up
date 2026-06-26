import { useState } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, Line, Text } from "@react-three/drei";
import { Compass } from "lucide-react";

const BlochSphereExplorer = () => {
  const [theta, setTheta] = useState(Math.PI / 3);
  const [phi, setPhi] = useState(Math.PI / 4);

  const x = Math.sin(theta) * Math.cos(phi);
  const y = Math.sin(theta) * Math.sin(phi);
  const z = Math.cos(theta);
  const tip: [number, number, number] = [x, z, y];

  const a = Math.cos(theta / 2);
  const bRe = Math.sin(theta / 2) * Math.cos(phi);
  const bIm = Math.sin(theta / 2) * Math.sin(phi);

  return (
    <section id="bloch" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <Compass className="w-7 h-7" /> Bloch Sphere Explorer
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-6">
          Sweep θ and φ to steer a qubit. Drag the sphere to rotate the view.
        </p>
        <div className="grid lg:grid-cols-2 gap-6">
          <div className="glass rounded-2xl h-[420px] overflow-hidden">
            <Canvas camera={{ position: [2.4, 1.6, 2.4], fov: 45 }}>
              <ambientLight intensity={0.7} />
              <mesh>
                <sphereGeometry args={[1, 48, 48]} />
                <meshBasicMaterial color="#0a1525" transparent opacity={0.35} />
              </mesh>
              <mesh>
                <sphereGeometry args={[1.001, 24, 24]} />
                <meshBasicMaterial color="#1e3a5f" wireframe transparent opacity={0.4} />
              </mesh>
              <Line points={[[-1.2, 0, 0], [1.2, 0, 0]]} color="#ef4444" lineWidth={1} />
              <Line points={[[0, -1.2, 0], [0, 1.2, 0]]} color="#22c55e" lineWidth={1} />
              <Line points={[[0, 0, -1.2], [0, 0, 1.2]]} color="#3b82f6" lineWidth={1} />
              <Text position={[0, 1.35, 0]} fontSize={0.15} color="#fff">|0⟩</Text>
              <Text position={[0, -1.35, 0]} fontSize={0.15} color="#fff">|1⟩</Text>
              <Line points={[[0, 0, 0], tip]} color="#ec4899" lineWidth={3} />
              <mesh position={tip}>
                <sphereGeometry args={[0.05, 16, 16]} />
                <meshBasicMaterial color="#ec4899" />
              </mesh>
              <OrbitControls enablePan={false} />
            </Canvas>
          </div>
          <div className="glass rounded-2xl p-6 space-y-5">
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>θ (polar)</span><span className="font-mono">{(theta).toFixed(2)} rad</span>
              </div>
              <input type="range" min={0} max={Math.PI} step={0.01} value={theta}
                onChange={(e) => setTheta(+e.target.value)} className="w-full accent-primary" />
            </div>
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>φ (azimuth)</span><span className="font-mono">{phi.toFixed(2)} rad</span>
              </div>
              <input type="range" min={0} max={2 * Math.PI} step={0.01} value={phi}
                onChange={(e) => setPhi(+e.target.value)} className="w-full accent-primary" />
            </div>
            <div className="pt-3 border-t border-border/40">
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-2">State</div>
              <div className="font-mono text-sm">
                |ψ⟩ = <span className="text-primary">{a.toFixed(3)}</span> |0⟩ +
                <span className="text-secondary"> ({bRe.toFixed(3)}{bIm >= 0 ? "+" : ""}{bIm.toFixed(3)}i)</span> |1⟩
              </div>
              <div className="text-xs text-muted-foreground mt-2">
                P(|0⟩) = {(a * a).toFixed(3)} · P(|1⟩) = {(bRe * bRe + bIm * bIm).toFixed(3)}
              </div>
            </div>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                { l: "|+⟩", t: Math.PI / 2, p: 0 },
                { l: "|−⟩", t: Math.PI / 2, p: Math.PI },
                { l: "|+i⟩", t: Math.PI / 2, p: Math.PI / 2 },
                { l: "|0⟩", t: 0, p: 0 },
              ].map((s) => (
                <button key={s.l} onClick={() => { setTheta(s.t); setPhi(s.p); }}
                  className="px-3 py-1.5 rounded-full glass hover:bg-primary/20 font-mono">{s.l}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default BlochSphereExplorer;