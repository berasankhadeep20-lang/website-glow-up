import { useEffect, useRef, useState } from "react";
import { Zap, Play, Pause, RotateCcw } from "lucide-react";

const DoubleSlit = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const histRef = useRef<Float64Array>(new Float64Array(400));
  const runRef = useRef(true);
  const [running, setRunning] = useState(true);
  const [count, setCount] = useState(0);
  const countRef = useRef(0);
  const [rate, setRate] = useState(5);
  const rateRef = useRef(5);
  useEffect(() => { runRef.current = running; }, [running]);
  useEffect(() => { rateRef.current = rate; }, [rate]);

  const probability = (x: number) => {
    // Far-field two-slit pattern: I = cos²(πd x / λL) · sinc²(π a x / λL)
    const d = 0.012, a = 0.003, L = 1.0, lam = 6e-4;
    const u = (Math.PI * x) / (lam * L);
    const c = Math.cos(u * d);
    const s = u * a === 0 ? 1 : Math.sin(u * a) / (u * a);
    return c * c * s * s;
  };

  // Precompute CDF for sampling
  const cdfRef = useRef<Float64Array>(new Float64Array(400));
  useEffect(() => {
    const cdf = cdfRef.current;
    let acc = 0;
    for (let i = 0; i < 400; i++) {
      const x = (i - 200) / 200 * 0.05;
      acc += probability(x);
      cdf[i] = acc;
    }
    for (let i = 0; i < 400; i++) cdf[i] /= acc;
  }, []);

  const reset = () => { histRef.current = new Float64Array(400); countRef.current = 0; setCount(0); };

  useEffect(() => {
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr; canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    let raf = 0;
    const loop = () => {
      if (runRef.current) {
        const cdf = cdfRef.current;
        for (let n = 0; n < rateRef.current; n++) {
          const u = Math.random();
          let lo = 0, hi = 399;
          while (lo < hi) {
            const m = (lo + hi) >> 1;
            if (cdf[m] < u) lo = m + 1; else hi = m;
          }
          histRef.current[lo]++;
          countRef.current++;
        }
      }
      const w = canvas.clientWidth, h = canvas.clientHeight;
      ctx.fillStyle = "#0a0f1f"; ctx.fillRect(0, 0, w, h);
      // top: detector hits as dots
      const detH = h * 0.35;
      const hist = histRef.current;
      let max = 1;
      for (let i = 0; i < hist.length; i++) max = Math.max(max, hist[i]);
      ctx.fillStyle = "#ec4899";
      for (let i = 0; i < hist.length; i++) {
        const x = (i / hist.length) * w;
        const intensity = hist[i] / max;
        ctx.globalAlpha = intensity;
        ctx.fillRect(x, 0, w / hist.length + 1, detH);
      }
      ctx.globalAlpha = 1;
      // bar histogram
      ctx.fillStyle = "#06b6d4";
      for (let i = 0; i < hist.length; i++) {
        const x = (i / hist.length) * w;
        const bh = (hist[i] / max) * (h - detH - 4);
        ctx.fillRect(x, h - bh, w / hist.length + 1, bh);
      }
      // theory curve
      ctx.strokeStyle = "#fbbf24"; ctx.lineWidth = 1.5;
      ctx.beginPath();
      for (let i = 0; i < 400; i++) {
        const x = (i / 400) * w;
        const xp = (i - 200) / 200 * 0.05;
        const p = probability(xp);
        const y = h - p * (h - detH - 4);
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      if (countRef.current !== count) setCount(countRef.current);
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
    // eslint-disable-next-line
  }, []);

  return (
    <section id="doubleslit" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <Zap className="w-7 h-7" /> Double-Slit Interference
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-6">
          Photons arrive one at a time. Each lands somewhere random — but the pattern emerges.
        </p>
        <div className="glass rounded-2xl p-4">
          <canvas ref={canvasRef} className="w-full h-72 rounded-xl" />
          <div className="flex flex-wrap items-center justify-center gap-3 mt-3">
            <button onClick={() => setRunning((p) => !p)} className="px-3 py-1.5 rounded-full glass text-xs flex items-center gap-1.5">
              {running ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />} {running ? "Pause" : "Play"}
            </button>
            <button onClick={reset} className="px-3 py-1.5 rounded-full glass text-xs flex items-center gap-1.5">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-muted-foreground">photons/frame</span>
              <input type="range" min={1} max={50} value={rate} onChange={(e) => setRate(+e.target.value)} className="accent-primary" />
              <span className="font-mono w-6">{rate}</span>
            </div>
            <div className="text-xs font-mono text-muted-foreground">N = {count.toLocaleString()}</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default DoubleSlit;