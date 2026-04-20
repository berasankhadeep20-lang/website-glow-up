import { createContext, useContext, useEffect, useRef, useState, ReactNode, useCallback } from "react";

type SoundCtx = {
  enabled: boolean;
  toggle: () => void;
  play: (kind: "click" | "type" | "open" | "success") => void;
};

const Ctx = createContext<SoundCtx | null>(null);

export const SoundProvider = ({ children }: { children: ReactNode }) => {
  const [enabled, setEnabled] = useState<boolean>(() => {
    if (typeof window === "undefined") return false;
    return localStorage.getItem("sound-enabled") === "1";
  });
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    localStorage.setItem("sound-enabled", enabled ? "1" : "0");
  }, [enabled]);

  const ensureCtx = () => {
    if (!ctxRef.current && typeof window !== "undefined") {
      const AC = window.AudioContext || (window as any).webkitAudioContext;
      if (AC) ctxRef.current = new AC();
    }
    return ctxRef.current;
  };

  const play = useCallback(
    (kind: "click" | "type" | "open" | "success") => {
      if (!enabled) return;
      const ctx = ensureCtx();
      if (!ctx) return;
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.connect(g);
      g.connect(ctx.destination);

      const now = ctx.currentTime;
      switch (kind) {
        case "click":
          o.type = "square";
          o.frequency.setValueAtTime(880, now);
          g.gain.setValueAtTime(0.04, now);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.06);
          o.start(now);
          o.stop(now + 0.07);
          break;
        case "type":
          o.type = "triangle";
          o.frequency.setValueAtTime(1200 + Math.random() * 400, now);
          g.gain.setValueAtTime(0.025, now);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.04);
          o.start(now);
          o.stop(now + 0.05);
          break;
        case "open":
          o.type = "sine";
          o.frequency.setValueAtTime(440, now);
          o.frequency.exponentialRampToValueAtTime(880, now + 0.15);
          g.gain.setValueAtTime(0.05, now);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.2);
          o.start(now);
          o.stop(now + 0.21);
          break;
        case "success":
          o.type = "sine";
          o.frequency.setValueAtTime(660, now);
          o.frequency.exponentialRampToValueAtTime(990, now + 0.18);
          g.gain.setValueAtTime(0.06, now);
          g.gain.exponentialRampToValueAtTime(0.0001, now + 0.25);
          o.start(now);
          o.stop(now + 0.26);
          break;
      }
    },
    [enabled]
  );

  return (
    <Ctx.Provider value={{ enabled, toggle: () => setEnabled((p) => !p), play }}>
      {children}
    </Ctx.Provider>
  );
};

export const useSound = () => {
  const ctx = useContext(Ctx);
  if (!ctx) return { enabled: false, toggle: () => {}, play: () => {} } as SoundCtx;
  return ctx;
};