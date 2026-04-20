import { createContext, useContext, useEffect, useState, ReactNode } from "react";

type Mode = "dark" | "light";

export interface AccentPreset {
  id: string;
  name: string;
  primary: string; // HSL triplet "H S% L%"
  secondary: string;
}

export const ACCENTS: AccentPreset[] = [
  { id: "cyan", name: "Cyan / Magenta", primary: "183 100% 50%", secondary: "295 100% 48%" },
  { id: "lime", name: "Lime / Teal", primary: "84 100% 55%", secondary: "175 100% 45%" },
  { id: "sunset", name: "Sunset", primary: "20 100% 60%", secondary: "340 100% 60%" },
  { id: "violet", name: "Violet / Pink", primary: "265 95% 65%", secondary: "320 100% 65%" },
  { id: "matrix", name: "Matrix", primary: "135 100% 50%", secondary: "165 100% 45%" },
];

interface ThemeCtx {
  mode: Mode;
  setMode: (m: Mode) => void;
  accent: AccentPreset;
  setAccent: (a: AccentPreset) => void;
  toggleMode: () => void;
}

const Ctx = createContext<ThemeCtx | null>(null);

const applyAccent = (a: AccentPreset) => {
  const root = document.documentElement;
  root.style.setProperty("--primary", a.primary);
  root.style.setProperty("--secondary", a.secondary);
  root.style.setProperty("--accent", a.secondary);
  root.style.setProperty("--ring", a.primary);
  root.style.setProperty("--sidebar-primary", a.primary);
  root.style.setProperty("--sidebar-accent", a.secondary);
};

const applyMode = (m: Mode) => {
  const root = document.documentElement;
  root.classList.toggle("light", m === "light");
  root.classList.toggle("dark", m === "dark");
};

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [mode, setModeState] = useState<Mode>(() => {
    if (typeof window === "undefined") return "dark";
    return (localStorage.getItem("theme-mode") as Mode) || "dark";
  });
  const [accent, setAccentState] = useState<AccentPreset>(() => {
    if (typeof window === "undefined") return ACCENTS[0];
    const id = localStorage.getItem("theme-accent");
    return ACCENTS.find((a) => a.id === id) || ACCENTS[0];
  });

  useEffect(() => {
    applyMode(mode);
    localStorage.setItem("theme-mode", mode);
  }, [mode]);

  useEffect(() => {
    applyAccent(accent);
    localStorage.setItem("theme-accent", accent.id);
  }, [accent]);

  return (
    <Ctx.Provider
      value={{
        mode,
        setMode: setModeState,
        accent,
        setAccent: setAccentState,
        toggleMode: () => setModeState((p) => (p === "dark" ? "light" : "dark")),
      }}
    >
      {children}
    </Ctx.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useTheme must be used within ThemeProvider");
  return ctx;
};