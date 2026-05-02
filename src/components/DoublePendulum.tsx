import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { Play, Pause, RotateCcw } from "lucide-react";

/**
 * Real double-pendulum simulation using Lagrangian equations of motion.
 * Numerically integrated with RK4 for stability — chaos visible after a few seconds.
 */
const DoublePendulum = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    a1: Math.PI / 2,
    a2: Math.PI / 2,
    a1v: 0,
    a2v: 0,
    trail: [] as { x: number; y: number }[],
  });
  const rafRef = useRef<number>();
  const [running, setRunning] = useState(true);

  const reset = () => {
    stateRef.current = {
      a1: Math.PI / 2 + (Math.random() - 0.5) * 0.1,
      a2: Math.PI / 2 + (Math.random() - 0.5) * 0.1,
      a1v: 0,
      a2v: 0,
      trail: [],
    };
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;

    const resize = () => {
      const rect = canvas.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Resolve CSS HSL tokens to concrete strings (canvas doesn't accept var()).
    const cssVar = (name: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim();
    const colors = {
      bg: `hsl(${cssVar("--background")})`,
      fg: cssVar("--foreground"),
      primary: cssVar("--primary"),
      secondary: cssVar("--secondary"),
      muted: cssVar("--muted-foreground"),
    };

    const m1 = 1, m2 = 1, L1 = 1, L2 = 1, g = 9.81;

    const derivatives = (a1: number, a2: number, a1v: number, a2v: number) => {
      const num1 = -g * (2 * m1 + m2) * Math.sin(a1);
      const num2 = -m2 * g * Math.sin(a1 - 2 * a2);
      const num3 = -2 * Math.sin(a1 - a2) * m2 * (a2v * a2v * L2 + a1v * a1v * L1 * Math.cos(a1 - a2));
      const den = L1 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
      const a1a = (num1 + num2 + num3) / den;

      const num4 = 2 * Math.sin(a1 - a2);
      const num5 = a1v * a1v * L1 * (m1 + m2);
      const num6 = g * (m1 + m2) * Math.cos(a1);
      const num7 = a2v * a2v * L2 * m2 * Math.cos(a1 - a2);
      const den2 = L2 * (2 * m1 + m2 - m2 * Math.cos(2 * a1 - 2 * a2));
      const a2a = (num4 * (num5 + num6 + num7)) / den2;

      return { da1: a1v, da2: a2v, da1v: a1a, da2v: a2a };
    };

    const step = (dt: number) => {
      const s = stateRef.current;
      // RK4
      const k1 = derivatives(s.a1, s.a2, s.a1v, s.a2v);
      const k2 = derivatives(
        s.a1 + (k1.da1 * dt) / 2,
        s.a2 + (k1.da2 * dt) / 2,
        s.a1v + (k1.da1v * dt) / 2,
        s.a2v + (k1.da2v * dt) / 2
      );
      const k3 = derivatives(
        s.a1 + (k2.da1 * dt) / 2,
        s.a2 + (k2.da2 * dt) / 2,
        s.a1v + (k2.da1v * dt) / 2,
        s.a2v + (k2.da2v * dt) / 2
      );
      const k4 = derivatives(
        s.a1 + k3.da1 * dt,
        s.a2 + k3.da2 * dt,
        s.a1v + k3.da1v * dt,
        s.a2v + k3.da2v * dt
      );
      s.a1 += (dt / 6) * (k1.da1 + 2 * k2.da1 + 2 * k3.da1 + k4.da1);
      s.a2 += (dt / 6) * (k1.da2 + 2 * k2.da2 + 2 * k3.da2 + k4.da2);
      s.a1v += (dt / 6) * (k1.da1v + 2 * k2.da1v + 2 * k3.da1v + k4.da1v);
      s.a2v += (dt / 6) * (k1.da2v + 2 * k2.da2v + 2 * k3.da2v + k4.da2v);
    };

    const draw = () => {
      const rect = canvas.getBoundingClientRect();
      const w = rect.width, h = rect.height;
      const cx = w / 2, cy = h / 2 - 40;
      const scale = Math.min(w, h) / 5;

      const s = stateRef.current;
      const x1 = cx + scale * Math.sin(s.a1);
      const y1 = cy + scale * Math.cos(s.a1);
      const x2 = x1 + scale * Math.sin(s.a2);
      const y2 = y1 + scale * Math.cos(s.a2);

      // fade trail
      ctx.fillStyle = `hsla(${colors.bg.replace("hsl(", "").replace(")", "")}, 0.18)`;
      ctx.fillRect(0, 0, w, h);

      // trail
      s.trail.push({ x: x2, y: y2 });
      if (s.trail.length > 600) s.trail.shift();
      ctx.beginPath();
      for (let i = 1; i < s.trail.length; i++) {
        const p = s.trail[i];
        const prev = s.trail[i - 1];
        const alpha = i / s.trail.length;
        ctx.strokeStyle = `hsla(${colors.secondary}, ${alpha * 0.8})`;
        ctx.lineWidth = 1.2;
        ctx.beginPath();
        ctx.moveTo(prev.x, prev.y);
        ctx.lineTo(p.x, p.y);
        ctx.stroke();
      }

      // rods
      ctx.strokeStyle = `hsla(${colors.fg}, 0.6)`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(x1, y1);
      ctx.lineTo(x2, y2);
      ctx.stroke();

      // pivot
      ctx.fillStyle = `hsl(${colors.muted})`;
      ctx.beginPath();
      ctx.arc(cx, cy, 4, 0, Math.PI * 2);
      ctx.fill();

      // bobs
      ctx.fillStyle = `hsl(${colors.primary})`;
      ctx.beginPath();
      ctx.arc(x1, y1, 9, 0, Math.PI * 2);
      ctx.fill();
      ctx.fillStyle = `hsl(${colors.secondary})`;
      ctx.beginPath();
      ctx.arc(x2, y2, 9, 0, Math.PI * 2);
      ctx.fill();
    };

    let last = performance.now();
    const loop = (t: number) => {
      const dt = Math.min((t - last) / 1000, 0.033);
      last = t;
      if (running) {
        // sub-step for stability
        for (let i = 0; i < 4; i++) step(dt / 4);
      }
      draw();
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      window.removeEventListener("resize", resize);
    };
  }, [running]);

  return (
    <section id="physics" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-8"
        >
          <h2 className="text-3xl font-bold gradient-text mb-2">Chaos in Motion</h2>
          <p className="text-muted-foreground text-sm">
            Live double-pendulum simulation — Lagrangian mechanics, RK4 integration. Two nearly identical
            initial conditions diverge wildly. That's chaos.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.97 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-4 relative"
        >
          <canvas ref={canvasRef} className="w-full h-[420px] rounded-xl" />
          <div className="absolute bottom-6 right-6 flex gap-2">
            <button
              onClick={() => setRunning((p) => !p)}
              className="w-10 h-10 rounded-full glass flex items-center justify-center hover:text-primary transition-colors"
              aria-label={running ? "Pause" : "Play"}
            >
              {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
            </button>
            <button
              onClick={reset}
              className="w-10 h-10 rounded-full glass flex items-center justify-center hover:text-primary transition-colors"
              aria-label="Reset"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default DoublePendulum;