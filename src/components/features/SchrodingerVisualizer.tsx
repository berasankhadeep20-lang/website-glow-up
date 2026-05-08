import { useEffect, useRef, useState } from "react";
import { Atom, Play, Pause, RotateCcw, Eraser } from "lucide-react";

/**
 * 1D time-dependent Schrödinger equation solver using split-step Fourier method.
 * Users draw a potential V(x) by dragging on the canvas; a Gaussian wavepacket
 * evolves through it in real time.
 */
const N = 256;
const DX = 0.1;
const DT = 0.005;
const HBAR = 1;
const M = 1;

function fft(re: Float64Array, im: Float64Array, inverse = false) {
  const n = re.length;
  // Bit reversal
  for (let i = 1, j = 0; i < n; i++) {
    let bit = n >> 1;
    for (; j & bit; bit >>= 1) j ^= bit;
    j ^= bit;
    if (i < j) {
      [re[i], re[j]] = [re[j], re[i]];
      [im[i], im[j]] = [im[j], im[i]];
    }
  }
  for (let len = 2; len <= n; len <<= 1) {
    const ang = (inverse ? 2 : -2) * Math.PI / len;
    const wRe = Math.cos(ang), wIm = Math.sin(ang);
    for (let i = 0; i < n; i += len) {
      let curRe = 1, curIm = 0;
      for (let k = 0; k < len / 2; k++) {
        const xRe = re[i + k], xIm = im[i + k];
        const yRe = re[i + k + len / 2] * curRe - im[i + k + len / 2] * curIm;
        const yIm = re[i + k + len / 2] * curIm + im[i + k + len / 2] * curRe;
        re[i + k] = xRe + yRe;
        im[i + k] = xIm + yIm;
        re[i + k + len / 2] = xRe - yRe;
        im[i + k + len / 2] = xIm - yIm;
        const nRe = curRe * wRe - curIm * wIm;
        curIm = curRe * wIm + curIm * wRe;
        curRe = nRe;
      }
    }
  }
  if (inverse) {
    for (let i = 0; i < n; i++) { re[i] /= n; im[i] /= n; }
  }
}

const SchrodingerVisualizer = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [running, setRunning] = useState(true);
  const runningRef = useRef(true);
  useEffect(() => { runningRef.current = running; }, [running]);
  const stateRef = useRef({
    psiRe: new Float64Array(N),
    psiIm: new Float64Array(N),
    V: new Float64Array(N),
    drawing: false,
  });
  const rafRef = useRef<number>();

  const initPacket = () => {
    const { psiRe, psiIm } = stateRef.current;
    const x0 = N * 0.25, sigma = 8, k0 = 2;
    for (let i = 0; i < N; i++) {
      const x = i - x0;
      const env = Math.exp(-(x * x) / (2 * sigma * sigma));
      psiRe[i] = env * Math.cos(k0 * i * DX);
      psiIm[i] = env * Math.sin(k0 * i * DX);
    }
    // Normalize so that sum |ψ|² * DX = 1
    let norm = 0;
    for (let i = 0; i < N; i++) norm += psiRe[i] * psiRe[i] + psiIm[i] * psiIm[i];
    norm = Math.sqrt(norm * DX);
    if (norm > 0) {
      for (let i = 0; i < N; i++) { psiRe[i] /= norm; psiIm[i] /= norm; }
    }
  };

  const clearV = () => stateRef.current.V.fill(0);

  useEffect(() => {
    initPacket();
    // default barrier
    const { V } = stateRef.current;
    V.fill(0);
    for (let i = 140; i < 150; i++) V[i] = 5;

    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const r = canvas.getBoundingClientRect();
      canvas.width = r.width * dpr;
      canvas.height = r.height * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };
    resize();
    window.addEventListener("resize", resize);

    // Precompute kinetic phase factors
    const kArr = new Float64Array(N);
    for (let i = 0; i < N; i++) {
      const k = i < N / 2 ? i : i - N;
      kArr[i] = (2 * Math.PI * k) / (N * DX);
    }

    const step = () => {
      const s = stateRef.current;
      // Half potential step
      for (let i = 0; i < N; i++) {
        const phase = -s.V[i] * DT / (2 * HBAR);
        const c = Math.cos(phase), si = Math.sin(phase);
        const re = s.psiRe[i] * c - s.psiIm[i] * si;
        const im = s.psiRe[i] * si + s.psiIm[i] * c;
        s.psiRe[i] = re; s.psiIm[i] = im;
      }
      // FFT to k-space
      fft(s.psiRe, s.psiIm);
      for (let i = 0; i < N; i++) {
        const phase = -HBAR * kArr[i] * kArr[i] * DT / (2 * M);
        const c = Math.cos(phase), si = Math.sin(phase);
        const re = s.psiRe[i] * c - s.psiIm[i] * si;
        const im = s.psiRe[i] * si + s.psiIm[i] * c;
        s.psiRe[i] = re; s.psiIm[i] = im;
      }
      fft(s.psiRe, s.psiIm, true);
      // Half potential
      for (let i = 0; i < N; i++) {
        const phase = -s.V[i] * DT / (2 * HBAR);
        const c = Math.cos(phase), si = Math.sin(phase);
        const re = s.psiRe[i] * c - s.psiIm[i] * si;
        const im = s.psiRe[i] * si + s.psiIm[i] * c;
        s.psiRe[i] = re; s.psiIm[i] = im;
      }
    };

    const render = () => {
      if (runningRef.current) for (let k = 0; k < 4; k++) step();
      const w = canvas.clientWidth, h = canvas.clientHeight;
      const css = getComputedStyle(canvas);
      const cardVar = getComputedStyle(document.documentElement).getPropertyValue("--card").trim() || "222 47% 11%";
      const mutedVar = getComputedStyle(document.documentElement).getPropertyValue("--muted-foreground").trim() || "215 20% 65%";
      const primaryVar = getComputedStyle(document.documentElement).getPropertyValue("--primary").trim() || "217 91% 60%";
      ctx.fillStyle = `hsl(${cardVar})`;
      ctx.fillRect(0, 0, w, h);
      const s = stateRef.current;
      // Potential
      ctx.strokeStyle = `hsla(${mutedVar}, 0.5)`;
      ctx.lineWidth = 1;
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const x = (i / N) * w;
        const y = h - (s.V[i] / 10) * h;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      // |psi|^2
      ctx.strokeStyle = `hsl(${primaryVar})`;
      ctx.lineWidth = 2;
      ctx.beginPath();
      for (let i = 0; i < N; i++) {
        const x = (i / N) * w;
        const p = s.psiRe[i] * s.psiRe[i] + s.psiIm[i] * s.psiIm[i];
        const y = h - p * h * 4;
        i === 0 ? ctx.moveTo(x, y) : ctx.lineTo(x, y);
      }
      ctx.stroke();
      rafRef.current = requestAnimationFrame(render);
    };
    render();

    const paint = (e: MouseEvent | TouchEvent) => {
      const rect = canvas.getBoundingClientRect();
      const cx = "touches" in e ? e.touches[0].clientX : (e as MouseEvent).clientX;
      const idx = Math.floor(((cx - rect.left) / rect.width) * N);
      const s = stateRef.current;
      for (let d = -3; d <= 3; d++) {
        const i = idx + d;
        if (i >= 0 && i < N) s.V[i] = Math.min(10, s.V[i] + 1);
      }
    };
    const down = (e: MouseEvent) => { stateRef.current.drawing = true; paint(e); };
    const move = (e: MouseEvent) => { if (stateRef.current.drawing) paint(e); };
    const up = () => { stateRef.current.drawing = false; };
    canvas.addEventListener("mousedown", down);
    canvas.addEventListener("mousemove", move);
    window.addEventListener("mouseup", up);
    return () => {
      cancelAnimationFrame(rafRef.current!);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("mousedown", down);
      canvas.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  return (
    <section id="schrodinger" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <Atom className="w-7 h-7" /> Schrödinger Visualizer
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-6">
          Drag on the canvas to draw a potential V(x). Watch the wavepacket scatter, tunnel, reflect.
        </p>
        <div className="glass rounded-2xl p-4">
          <canvas ref={canvasRef} className="w-full h-64 cursor-crosshair rounded-xl" />
          <div className="flex justify-center gap-2 mt-3">
            <button onClick={() => setRunning((p) => !p)} className="px-3 py-1.5 rounded-full glass text-xs flex items-center gap-1.5">
              {running ? <Pause className="w-3 h-3" /> : <Play className="w-3 h-3" />} {running ? "Pause" : "Play"}
            </button>
            <button onClick={() => initPacket()} className="px-3 py-1.5 rounded-full glass text-xs flex items-center gap-1.5">
              <RotateCcw className="w-3 h-3" /> Reset ψ
            </button>
            <button onClick={clearV} className="px-3 py-1.5 rounded-full glass text-xs flex items-center gap-1.5">
              <Eraser className="w-3 h-3" /> Clear V
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default SchrodingerVisualizer;