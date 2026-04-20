import { useEffect, useRef, useState } from "react";

interface Node {
  id: string;
  label: string;
  group: string;
  x: number;
  y: number;
  vx: number;
  vy: number;
  level: number;
}

const NODES: Omit<Node, "x" | "y" | "vx" | "vy">[] = [
  { id: "py", label: "Python", group: "lang", level: 85 },
  { id: "java", label: "Java", group: "lang", level: 70 },
  { id: "ml", label: "Machine Learning", group: "ai", level: 75 },
  { id: "qiskit", label: "Qiskit", group: "quantum", level: 60 },
  { id: "quantum", label: "Quantum Computing", group: "quantum", level: 60 },
  { id: "data", label: "Data Analysis", group: "ai", level: 65 },
  { id: "davinci", label: "DaVinci Resolve", group: "media", level: 80 },
  { id: "llm", label: "LLMs", group: "ai", level: 70 },
  { id: "f1", label: "F1 Predictor", group: "project", level: 85 },
  { id: "stock", label: "Stock LLM", group: "project", level: 70 },
  { id: "football", label: "Football AI", group: "project", level: 80 },
];

const EDGES: [string, string][] = [
  ["py", "ml"],
  ["py", "data"],
  ["py", "qiskit"],
  ["ml", "llm"],
  ["ml", "f1"],
  ["ml", "football"],
  ["llm", "stock"],
  ["data", "stock"],
  ["qiskit", "quantum"],
  ["java", "py"],
  ["davinci", "media" as any], // unused, keep distinct
];

// Filter out edges that reference non-existent nodes
const validEdges = EDGES.filter(([a, b]) => NODES.find((n) => n.id === a) && NODES.find((n) => n.id === b));

const GROUP_COLORS: Record<string, string> = {
  lang: "primary",
  ai: "secondary",
  quantum: "primary",
  media: "secondary",
  project: "primary",
};

const SkillsConstellation = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const nodesRef = useRef<Node[]>([]);
  const dragRef = useRef<{ id: string | null; ox: number; oy: number }>({ id: null, ox: 0, oy: 0 });
  const hoverRef = useRef<string | null>(null);
  const [, force] = useState(0);

  useEffect(() => {
    const container = containerRef.current;
    const canvas = canvasRef.current;
    if (!container || !canvas) return;

    const dpr = window.devicePixelRatio || 1;
    const resize = () => {
      const rect = container.getBoundingClientRect();
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = rect.width + "px";
      canvas.style.height = rect.height + "px";
      if (nodesRef.current.length === 0) {
        const cx = rect.width / 2;
        const cy = rect.height / 2;
        const r = Math.min(rect.width, rect.height) * 0.32;
        nodesRef.current = NODES.map((n, i) => {
          const angle = (i / NODES.length) * Math.PI * 2;
          return {
            ...n,
            x: cx + Math.cos(angle) * r,
            y: cy + Math.sin(angle) * r,
            vx: 0,
            vy: 0,
          };
        });
      }
    };
    resize();
    window.addEventListener("resize", resize);

    const ctx = canvas.getContext("2d")!;
    ctx.scale(dpr, dpr);

    const getCss = (name: string) =>
      getComputedStyle(document.documentElement).getPropertyValue(name).trim();

    let raf = 0;
    const tick = () => {
      const w = canvas.width / dpr;
      const h = canvas.height / dpr;
      const primary = getCss("--primary");
      const secondary = getCss("--secondary");
      const fg = getCss("--foreground");

      ctx.clearRect(0, 0, w, h);

      // physics
      const nodes = nodesRef.current;
      const cx = w / 2;
      const cy = h / 2;
      for (const n of nodes) {
        if (dragRef.current.id === n.id) continue;
        // gentle pull to center
        n.vx += (cx - n.x) * 0.0008;
        n.vy += (cy - n.y) * 0.0008;
        // repulsion
        for (const m of nodes) {
          if (m.id === n.id) continue;
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const d2 = dx * dx + dy * dy;
          if (d2 < 14000 && d2 > 0.01) {
            const f = 200 / d2;
            n.vx += dx * f * 0.05;
            n.vy += dy * f * 0.05;
          }
        }
        n.vx *= 0.88;
        n.vy *= 0.88;
        n.x += n.vx;
        n.y += n.vy;
        n.x = Math.max(40, Math.min(w - 40, n.x));
        n.y = Math.max(30, Math.min(h - 30, n.y));
      }

      // edges
      ctx.lineWidth = 1;
      for (const [a, b] of validEdges) {
        const na = nodes.find((n) => n.id === a);
        const nb = nodes.find((n) => n.id === b);
        if (!na || !nb) continue;
        const isHover = hoverRef.current === a || hoverRef.current === b;
        const grad = ctx.createLinearGradient(na.x, na.y, nb.x, nb.y);
        grad.addColorStop(0, `hsl(${primary} / ${isHover ? 0.7 : 0.25})`);
        grad.addColorStop(1, `hsl(${secondary} / ${isHover ? 0.7 : 0.25})`);
        ctx.strokeStyle = grad;
        ctx.beginPath();
        ctx.moveTo(na.x, na.y);
        ctx.lineTo(nb.x, nb.y);
        ctx.stroke();
      }

      // nodes
      for (const n of nodes) {
        const isHover = hoverRef.current === n.id;
        const r = 6 + n.level / 18 + (isHover ? 3 : 0);
        const color = GROUP_COLORS[n.group] === "secondary" ? secondary : primary;
        const glow = ctx.createRadialGradient(n.x, n.y, 0, n.x, n.y, r * 4);
        glow.addColorStop(0, `hsl(${color} / 0.6)`);
        glow.addColorStop(1, `hsl(${color} / 0)`);
        ctx.fillStyle = glow;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r * 4, 0, Math.PI * 2);
        ctx.fill();

        ctx.fillStyle = `hsl(${color})`;
        ctx.beginPath();
        ctx.arc(n.x, n.y, r, 0, Math.PI * 2);
        ctx.fill();

        ctx.font = `${isHover ? "600 12px" : "500 11px"} Poppins, sans-serif`;
        ctx.fillStyle = `hsl(${fg})`;
        ctx.textAlign = "center";
        ctx.fillText(n.label, n.x, n.y - r - 6);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const getPointer = (e: PointerEvent) => {
      const rect = canvas.getBoundingClientRect();
      return { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const findNode = (x: number, y: number) => {
      for (const n of nodesRef.current) {
        const dx = n.x - x;
        const dy = n.y - y;
        if (dx * dx + dy * dy < 350) return n;
      }
      return null;
    };
    const onDown = (e: PointerEvent) => {
      const p = getPointer(e);
      const n = findNode(p.x, p.y);
      if (n) {
        dragRef.current = { id: n.id, ox: p.x - n.x, oy: p.y - n.y };
        canvas.setPointerCapture(e.pointerId);
      }
    };
    const onMove = (e: PointerEvent) => {
      const p = getPointer(e);
      if (dragRef.current.id) {
        const n = nodesRef.current.find((x) => x.id === dragRef.current.id);
        if (n) {
          n.x = p.x - dragRef.current.ox;
          n.y = p.y - dragRef.current.oy;
          n.vx = 0;
          n.vy = 0;
        }
      } else {
        const hov = findNode(p.x, p.y);
        const next = hov?.id || null;
        if (next !== hoverRef.current) {
          hoverRef.current = next;
          canvas.style.cursor = next ? "grab" : "default";
        }
      }
    };
    const onUp = (e: PointerEvent) => {
      dragRef.current = { id: null, ox: 0, oy: 0 };
      try {
        canvas.releasePointerCapture(e.pointerId);
      } catch {}
    };

    canvas.addEventListener("pointerdown", onDown);
    canvas.addEventListener("pointermove", onMove);
    canvas.addEventListener("pointerup", onUp);
    canvas.addEventListener("pointerleave", onUp);

    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
      canvas.removeEventListener("pointerdown", onDown);
      canvas.removeEventListener("pointermove", onMove);
      canvas.removeEventListener("pointerup", onUp);
      canvas.removeEventListener("pointerleave", onUp);
    };
  }, []);

  return (
    <div ref={containerRef} className="glass rounded-2xl overflow-hidden h-[420px] relative">
      <canvas ref={canvasRef} className="w-full h-full block" />
      <div className="absolute top-3 left-3 text-[10px] text-muted-foreground bg-background/40 backdrop-blur px-2 py-1 rounded-full">
        Drag the nodes ✦
      </div>
    </div>
  );
};

export default SkillsConstellation;