import { useRef, MouseEvent } from "react";

export function useTilt(max = 10) {
  const ref = useRef<HTMLDivElement>(null);

  const onMouseMove = (e: MouseEvent<HTMLDivElement>) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const px = x / rect.width - 0.5;
    const py = y / rect.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg) scale3d(1.02,1.02,1.02)`;
  };
  const onMouseLeave = () => {
    const el = ref.current;
    if (!el) return;
    el.style.transform = "perspective(900px) rotateY(0) rotateX(0) scale3d(1,1,1)";
  };

  return { ref, onMouseMove, onMouseLeave, style: { transition: "transform 0.2s ease-out", transformStyle: "preserve-3d" as const } };
}