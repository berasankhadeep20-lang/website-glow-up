import { useEffect, useRef, useState } from "react";
import { Thermometer, Play, Pause, RotateCcw } from "lucide-react";

const SIZE = 80;

const IsingModel = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [T, setT] = useState(2.5);
  const [running, setRunning] = useState(true);
  const runRef = useRef(true);
  const TRef = useRef(2.5);
  const gridRef = useRef<Int8Array>(new Int8Array(SIZE * SIZE));
  const magRef = useRef(0);
  const [mag, setMag] = useState(0);

  useEffect(() => { runRef.current = running; }, [running]);
  useEffect(() => { TRef.current = T; }, [T]);

  const reset = () => {
    const g = gridRef.current;
    for (let i = 0; i < g.length; i++) g[i] = Math.random() < 0.5 ? 1 : -1;
  };

  useEffect(() => {
    reset();
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
    let frame = 0;
    const step = () => {
      const g = gridRef.current;
      const Tn = TRef.current;
      // Metropolis sweep
      for (let n = 0; n < SIZE * SIZE; n++) {
        const i = (Math.random() * SIZE) | 0;
        const j = (Math.random() * SIZE) | 0;
        const idx = i * SIZE + j;
        const s = g[idx];
        const nb =
          g[((i + 1) % SIZE) * SIZE + j] +
          g[((i - 1 + SIZE) % SIZE) * SIZE + j] +
          g[i * SIZE + (j + 1) % SIZE] +
          g[i * SIZE + (j - 1 + SIZE) % SIZE];
        const dE = 2 * s * nb;
        if (dE <= 0 || Math.random() < Math.exp(-dE / Tn)) g[idx] = -s as 1 | -1;
      }
    };

    const draw = () => {
      const g = gridRef.current;
      const w = canvas.clientWidth, h = canvas.clientHeight;
      const cell = Math.min(w, h) / SIZE;
      ctx.fillStyle = "#0a0f1f";
      ctx.fillRect(0, 0, w, h);
      let m = 0;
      for (let i = 0; i < SIZE; i++) {
        for (let j = 0; j < SIZE; j++) {
          const s = g[i * SIZE + j];
          m += s;
          ctx.fillStyle = s === 1 ? "#ec4899" : "#0ea5e9";
          ctx.fillRect(j * cell, i * cell, cell, cell);
        }
      }
      magRef.current = m / (SIZE * SIZE);
    };

    const loop = () => {
      if (runRef.current) step();
      draw();
      frame++;
      if (frame % 10 === 0) setMag(magRef.current);
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  return (
    <section id="ising" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <Thermometer className="w-7 h-7" /> 2D Ising Model
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-6">
          Metropolis sampling on an 80×80 lattice. Cool below T<sub>c</sub> ≈ 2.27 and watch domains form.
        </p>
        <div className="glass rounded-2xl p-4 grid lg:grid-cols-[1fr_auto] gap-4 items-center">
          <canvas ref={canvasRef} className="w-full aspect-square rounded-xl" />
          <div className="lg:w-56 space-y-4">
            <div>
              <div className="flex justify-between text-xs text-muted-foreground mb-1">
                <span>Temperature</span><span className="font-mono">{T.toFixed(2)}</span>
              </div>
              <input type="range" min={0.1} max={5} step={0.01} value={T}
                onChange={(e) => setT(+e.target.value)} className="w-full accent-primary" />
              <div className="flex justify-between text-[10px] text-muted-foreground mt-1">
                <span>cold</span><span>T_c</span><span>hot</span>
              </div>
            </div>
            <div>
              <div className="text-[11px] uppercase tracking-wider text-muted-foreground">Magnetisation</div>
              <div className="font-mono text-2xl">{mag.toFixed(3)}</div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => setRunning((p) => !p)} className="px-3 py-1.5 rounded-full glass text-xs flex items-center gap-1.5">
                {running ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />} {running ? "Pause" : "Run"}
              </button>
              <button onClick={reset} className="px-3 py-1.5 rounded-full glass text-xs flex items-center gap-1.5">
                <RotateCcw className="w-3 h-3" /> Randomise
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default IsingModel;