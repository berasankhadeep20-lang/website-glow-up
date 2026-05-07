import { useEffect, useRef, useState } from "react";
import { Waves, RotateCcw } from "lucide-react";

/**
 * D2Q9 Lattice Boltzmann fluid simulation.
 * Click/drag to add solid obstacles; flow streams left → right.
 */
const NX = 120, NY = 60;
const tau = 0.6;
const u0 = 0.1;
const w = [4 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 9, 1 / 36, 1 / 36, 1 / 36, 1 / 36];
const cx = [0, 1, 0, -1, 0, 1, -1, -1, 1];
const cy = [0, 0, 1, 0, -1, 1, 1, -1, -1];
const opp = [0, 3, 4, 1, 2, 7, 8, 5, 6];

const LatticeBoltzmann = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const stateRef = useRef({
    f: new Float32Array(NX * NY * 9),
    obstacle: new Uint8Array(NX * NY),
    drawing: false,
  });
  const rafRef = useRef<number>();

  const init = () => {
    const { f, obstacle } = stateRef.current;
    obstacle.fill(0);
    // central cylinder
    for (let y = 0; y < NY; y++) for (let x = 0; x < NX; x++) {
      const dx = x - 30, dy = y - NY / 2;
      if (dx * dx + dy * dy < 36) obstacle[y * NX + x] = 1;
    }
    for (let i = 0; i < NX * NY; i++) for (let k = 0; k < 9; k++) {
      const u = u0, eu = cx[k] * u;
      f[i * 9 + k] = w[k] * (1 + 3 * eu + 4.5 * eu * eu - 1.5 * u * u);
    }
  };

  useEffect(() => {
    init();
    const canvas = canvasRef.current!;
    const ctx = canvas.getContext("2d")!;
    canvas.width = NX * 4; canvas.height = NY * 4;
    const img = ctx.createImageData(NX, NY);

    const step = () => {
      const { f, obstacle } = stateRef.current;
      // collide
      for (let y = 0; y < NY; y++) for (let x = 0; x < NX; x++) {
        const i = y * NX + x;
        if (obstacle[i]) continue;
        let rho = 0, ux = 0, uy = 0;
        for (let k = 0; k < 9; k++) { const v = f[i * 9 + k]; rho += v; ux += v * cx[k]; uy += v * cy[k]; }
        ux /= rho; uy /= rho;
        for (let k = 0; k < 9; k++) {
          const eu = cx[k] * ux + cy[k] * uy;
          const feq = w[k] * rho * (1 + 3 * eu + 4.5 * eu * eu - 1.5 * (ux * ux + uy * uy));
          f[i * 9 + k] -= (f[i * 9 + k] - feq) / tau;
        }
      }
      // bounce-back at obstacles
      const tmp = new Float32Array(f);
      for (let y = 0; y < NY; y++) for (let x = 0; x < NX; x++) {
        const i = y * NX + x;
        for (let k = 0; k < 9; k++) {
          const nx = (x + cx[k] + NX) % NX, ny = y + cy[k];
          if (ny < 0 || ny >= NY) continue;
          const ni = ny * NX + nx;
          if (obstacle[ni]) f[i * 9 + opp[k]] = tmp[i * 9 + k];
          else f[ni * 9 + k] = tmp[i * 9 + k];
        }
      }
      // inflow left
      for (let y = 0; y < NY; y++) {
        const i = y * NX;
        for (let k = 0; k < 9; k++) {
          const eu = cx[k] * u0;
          f[i * 9 + k] = w[k] * (1 + 3 * eu + 4.5 * eu * eu - 1.5 * u0 * u0);
        }
      }
    };

    const render = () => {
      step();
      const { f, obstacle } = stateRef.current;
      for (let y = 0; y < NY; y++) for (let x = 0; x < NX; x++) {
        const i = y * NX + x;
        let rho = 0, ux = 0, uy = 0;
        for (let k = 0; k < 9; k++) { const v = f[i * 9 + k]; rho += v; ux += v * cx[k]; uy += v * cy[k]; }
        const speed = Math.min(1, Math.sqrt(ux * ux + uy * uy) / rho * 8);
        const idx = i * 4;
        if (obstacle[i]) { img.data[idx] = 30; img.data[idx + 1] = 30; img.data[idx + 2] = 40; }
        else {
          img.data[idx] = Math.floor(speed * 255);
          img.data[idx + 1] = Math.floor((1 - Math.abs(speed - 0.5) * 2) * 200);
          img.data[idx + 2] = Math.floor((1 - speed) * 220);
        }
        img.data[idx + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);
      ctx.imageSmoothingEnabled = false;
      ctx.drawImage(canvas, 0, 0, NX, NY, 0, 0, canvas.width, canvas.height);
      rafRef.current = requestAnimationFrame(render);
    };
    render();

    const paint = (e: MouseEvent) => {
      const r = canvas.getBoundingClientRect();
      const x = Math.floor(((e.clientX - r.left) / r.width) * NX);
      const y = Math.floor(((e.clientY - r.top) / r.height) * NY);
      for (let dy = -2; dy <= 2; dy++) for (let dx = -2; dx <= 2; dx++) {
        const nx = x + dx, ny = y + dy;
        if (nx >= 0 && nx < NX && ny >= 0 && ny < NY) stateRef.current.obstacle[ny * NX + nx] = 1;
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
      canvas.removeEventListener("mousedown", down);
      canvas.removeEventListener("mousemove", move);
      window.removeEventListener("mouseup", up);
    };
  }, []);

  return (
    <section id="fluid" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <Waves className="w-7 h-7" /> Lattice Boltzmann Fluid
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-6">
          D2Q9 simulation. Drag to paint obstacles and watch turbulent vortices form behind them.
        </p>
        <div className="glass rounded-2xl p-4">
          <canvas ref={canvasRef} className="w-full rounded-xl cursor-crosshair" style={{ aspectRatio: `${NX}/${NY}`, imageRendering: "pixelated" }} />
          <div className="flex justify-center mt-3">
            <button onClick={init} className="px-3 py-1.5 rounded-full glass text-xs flex items-center gap-1.5">
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        </div>
      </div>
    </section>
  );
};

export default LatticeBoltzmann;