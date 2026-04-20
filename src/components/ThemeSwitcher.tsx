import { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Palette, Moon, Sun, Volume2, VolumeX } from "lucide-react";
import { useTheme, ACCENTS } from "@/contexts/ThemeContext";
import { useSound } from "@/contexts/SoundContext";

const ThemeSwitcher = () => {
  const { mode, toggleMode, accent, setAccent } = useTheme();
  const { enabled: soundOn, toggle: toggleSound, play } = useSound();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, []);

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => {
          setOpen((p) => !p);
          play("click");
        }}
        className="w-9 h-9 rounded-full glass flex items-center justify-center hover:text-primary transition-colors"
        aria-label="Theme settings"
      >
        <Palette className="w-4 h-4" />
      </button>
      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            className="absolute right-0 top-12 w-64 glass rounded-2xl p-4 shadow-xl z-50"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Mode</span>
              <button
                onClick={() => {
                  toggleMode();
                  play("click");
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 text-xs hover:text-primary transition-colors"
              >
                {mode === "dark" ? <Moon className="w-3 h-3" /> : <Sun className="w-3 h-3" />}
                {mode === "dark" ? "Dark" : "Light"}
              </button>
            </div>
            <div className="flex items-center justify-between mb-4">
              <span className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">Sound</span>
              <button
                onClick={() => {
                  toggleSound();
                  play("click");
                }}
                className="flex items-center gap-2 px-3 py-1.5 rounded-full bg-muted/60 text-xs hover:text-primary transition-colors"
              >
                {soundOn ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
                {soundOn ? "On" : "Off"}
              </button>
            </div>
            <div className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">Accent</div>
            <div className="grid grid-cols-5 gap-2">
              {ACCENTS.map((a) => {
                const isActive = a.id === accent.id;
                return (
                  <button
                    key={a.id}
                    onClick={() => {
                      setAccent(a);
                      play("success");
                    }}
                    title={a.name}
                    className={`relative w-full aspect-square rounded-full transition-transform hover:scale-110 ${
                      isActive ? "ring-2 ring-foreground ring-offset-2 ring-offset-card" : ""
                    }`}
                    style={{
                      background: `linear-gradient(135deg, hsl(${a.primary}), hsl(${a.secondary}))`,
                    }}
                  />
                );
              })}
            </div>
            <p className="text-[10px] text-muted-foreground mt-3">Saved across sessions.</p>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default ThemeSwitcher;