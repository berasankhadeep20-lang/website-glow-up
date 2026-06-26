import { useEffect, useRef, useState } from "react";
import { Waves, Eraser } from "lucide-react";

const N = 256;

const FourierExplorer = () => {
  const timeRef = useRef<HTMLCanvasElement>(null);
  const freqRef = useRef<HTMLCanvasElement>(null);
  const dataRef = useRef<Float64Array>(new Float64Array(N));
  const [, force] = useState(0);

  const dft = (x: Float64Array) => {
    const out = new Float64Array(N / 2);
    for (let k = 0; k < N / 2; k++) {
      let re = 0, im = 0;
      for (let n = 0; n < N; n++) {
        const a = (-2 * Math.PI * k * n) / N;
        re += x[n] * Math.cos(a);
        im += x[n] * Math.sin(a);
      }
      out[k] = Math.sqrt(re * re + im * im) / N;
    }
    return out;
  };

  const drawAll = () => {
    const t = timeRef.current!, f = freqRef.current!;
    const tc = t.getContext("2d")!, fc = f.getContext("2d")!;
    const tw = t.clientWidth, th = t.clientHeight, fw = f.clientWidth, fh = f.clientHeight;
    tc.fillStyle = "#0a0f1f"; tc.fillRect(0, 0, tw, th);
    fc.fillStyle = "#0a0f1f"; fc.fillRect(0, 0, fw, fh);
    tc.strokeStyle = "#334155"; tc.beginPath(); tc.moveTo(0, th / 2); tc.lineTo(tw, th / 2); tc.stroke();
    const data = dataRef.current;
    tc.strokeStyle = "#ec4899"; tc.lineWidth = 2; tc.beginPath();
    for (let i = 0; i < N; i++) {
      const x = (i / (N - 1)) * tw;
      const y = th / 2 - data[i] * (th / 2 - 6);
      i === 0 ? tc.moveTo(x, y) : tc.lineTo(x, y);
    }
    tc.stroke();
    const spec = dft(data);
    let max = 1e-6; for (let i = 0; i < spec.length; i++) max = Math.max(max, spec[i]);
    fc.fillStyle = "#06b6d4";
    for (let k = 0; k < spec.length; k++) {
      const bw = fw / spec.length;
      const h = (spec[k] / max) * (fh - 6);
      fc.fillRect(k * bw, fh - h, bw - 1, h);
    }
  };

  useEffect(() => {
    const t = timeRef.current!, f = freqRef.current!;
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      for (const c of [t, f]) {
        const r = c.getBoundingClientRect();
        c.width = r.width * dpr; c.height = r.height * dpr;
        c.getContext("2d")!.setTransform(dpr, 0, 0, dpr, 0, 0);
      }
      drawAll();
    };
    // preset: sin(2x) + 0.5 sin(8x)
    const d = dataRef.current;
    for (let i = 0; i < N; i++) {
      const x = (i / N) * 2 * Math.PI;
      d[i] = 0.6 * Math.sin(2 * x) + 0.3 * Math.sin(8 * x);
    }
    resize();
    window.addEventListener("resize", resize);

    let drawing = false;
    let lastIdx = -1;
    const paint = (e: MouseEvent) => {
      const rect = t.getBoundingClientRect();
      const idx = Math.max(0, Math.min(N - 1, Math.floor(((e.clientX - rect.left) / rect.width) * N)));
      const v = Math.max(-1, Math.min(1, -((e.clientY - rect.top) / rect.height - 0.5) * 2));
      const d = dataRef.current;
      if (lastIdx < 0) d[idx] = v;
      else {
        const a = Math.min(lastIdx, idx), b = Math.max(lastIdx, idx);
        const lastV = d[lastIdx];
        for (let i = a; i <= b; i++) {
          const t = (i - lastIdx) / Math.max(1, idx - lastIdx);
          d[i] = lastV + (v - lastV) * t;
        }
      }
      lastIdx = idx;
      drawAll();
      force((p) => p + 1);
    };
    const down = (e: MouseEvent) => { drawing = true; lastIdx = -1; paint(e); };
    const move = (e: MouseEvent) => { if (drawing) paint(e); };
    const up = () => { drawing = false; lastIdx = -1; };
    t.addEventListener("mousedown", down);
    t.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      window.removeEventListener("resize", resize);
      t.removeEventListener("mousedown", down);
      t.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  const clear = () => { dataRef.current.fill(0); drawAll(); };

  return (
    <section id="fourier" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <Waves className="w-7 h-7" /> Fourier Transform Explorer
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-6">
          Draw any signal in time. See its frequency spectrum update live.
        </p>
        <div className="glass rounded-2xl p-4 space-y-3">
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Time domain — drag to draw</div>
            <canvas ref={timeRef} className="w-full h-44 rounded-xl cursor-crosshair" />
          </div>
          <div>
            <div className="text-[11px] uppercase tracking-wider text-muted-foreground mb-1">Frequency spectrum |X(k)|</div>
            <canvas ref={freqRef} className="w-full h-40 rounded-xl" />
          </div>
          <div className="flex justify-center">
            <button onClick={clear} className="px-3 py-1.5 rounded-full glass text-xs flex items-center gap-1.5">
              <Eraser className="w-3 h-3" /> Clear
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FourierExplorer;