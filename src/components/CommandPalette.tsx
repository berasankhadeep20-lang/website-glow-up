import { useEffect, useState } from "react";
import { Command } from "cmdk";
import { motion, AnimatePresence } from "framer-motion";
import {
  GraduationCap,
  Wrench,
  FolderGit2,
  BookOpen,
  PenSquare,
  Presentation,
  FileText,
  TerminalSquare,
  Mail,
  Github,
  Linkedin,
  Twitter,
  Youtube,
  Instagram,
  Copy,
  Sun,
  Moon,
  Volume2,
  Calendar,
  Atom,
  BookHeart,
} from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { useSound } from "@/contexts/SoundContext";

const SECTIONS = [
  { id: "now", label: "Now", icon: Calendar },
  { id: "education", label: "Education", icon: GraduationCap },
  { id: "skills", label: "Skills", icon: Wrench },
  { id: "projects", label: "Projects", icon: FolderGit2 },
  { id: "research", label: "Research", icon: BookOpen },
  { id: "blog", label: "Blog", icon: PenSquare },
  { id: "workshops", label: "Workshops", icon: Presentation },
  { id: "physics", label: "Physics demo", icon: Atom },
  { id: "resume", label: "Resume", icon: FileText },
  { id: "terminal", label: "Terminal", icon: TerminalSquare },
  { id: "guestbook", label: "Guestbook", icon: BookHeart },
  { id: "contact", label: "Contact", icon: Mail },
];

const SOCIALS = [
  { label: "GitHub", url: "https://github.com/berasankhadeep20-lang", icon: Github },
  { label: "LinkedIn", url: "https://www.linkedin.com/in/sankhadeep-bera-64a1a0364/", icon: Linkedin },
  { label: "X / Twitter", url: "https://x.com/RonnieDeep04", icon: Twitter },
  { label: "YouTube", url: "https://youtube.com/@ronniedeep", icon: Youtube },
  { label: "Instagram", url: "https://www.instagram.com/ronnie_deep_04/", icon: Instagram },
];

const CommandPalette = () => {
  const [open, setOpen] = useState(false);
  const { mode, toggleMode } = useTheme();
  const { toggle: toggleSound, enabled: soundOn, play } = useSound();

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault();
        setOpen((p) => !p);
      }
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const run = (fn: () => void) => {
    play("click");
    fn();
    setOpen(false);
  };

  const goto = (id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
          className="fixed inset-0 z-[60] bg-background/80 backdrop-blur-sm flex items-start justify-center pt-24 px-4"
        >
          <motion.div
            initial={{ scale: 0.95, y: -10 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: -10 }}
            onClick={(e) => e.stopPropagation()}
            className="w-full max-w-xl glass rounded-2xl overflow-hidden shadow-2xl"
          >
            <Command label="Global command menu" className="bg-transparent">
              <Command.Input
                autoFocus
                placeholder="Type a command or search…"
                className="w-full px-4 py-4 bg-transparent border-b border-border/50 outline-none text-foreground placeholder:text-muted-foreground"
              />
              <Command.List className="max-h-80 overflow-y-auto p-2 scrollbar-thin">
                <Command.Empty className="py-6 text-center text-sm text-muted-foreground">
                  No results found.
                </Command.Empty>

                <Command.Group heading="Jump to section" className="text-xs text-muted-foreground px-2 py-1">
                  {SECTIONS.map((s) => (
                    <Command.Item
                      key={s.id}
                      onSelect={() => run(() => goto(s.id))}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm aria-selected:bg-primary/10 aria-selected:text-primary"
                    >
                      <s.icon className="w-4 h-4" />
                      {s.label}
                    </Command.Item>
                  ))}
                </Command.Group>

                <Command.Group heading="Actions" className="text-xs text-muted-foreground px-2 py-1 mt-2">
                  <Command.Item
                    onSelect={() =>
                      run(() => {
                        navigator.clipboard.writeText("berasankhadeep20@gmail.com");
                      })
                    }
                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm aria-selected:bg-primary/10 aria-selected:text-primary"
                  >
                    <Copy className="w-4 h-4" /> Copy email
                  </Command.Item>
                  <Command.Item
                    onSelect={() => run(toggleMode)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm aria-selected:bg-primary/10 aria-selected:text-primary"
                  >
                    {mode === "dark" ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                    Toggle {mode === "dark" ? "light" : "dark"} mode
                  </Command.Item>
                  <Command.Item
                    onSelect={() => run(toggleSound)}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm aria-selected:bg-primary/10 aria-selected:text-primary"
                  >
                    <Volume2 className="w-4 h-4" /> Sound: {soundOn ? "On" : "Off"}
                  </Command.Item>
                </Command.Group>

                <Command.Group heading="Open social" className="text-xs text-muted-foreground px-2 py-1 mt-2">
                  {SOCIALS.map((s) => (
                    <Command.Item
                      key={s.label}
                      onSelect={() => run(() => window.open(s.url, "_blank", "noopener,noreferrer"))}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm aria-selected:bg-primary/10 aria-selected:text-primary"
                    >
                      <s.icon className="w-4 h-4" /> {s.label}
                    </Command.Item>
                  ))}
                </Command.Group>
              </Command.List>
              <div className="px-4 py-2 border-t border-border/50 flex justify-between text-[10px] text-muted-foreground">
                <span>↑↓ navigate · ↵ select · esc close</span>
                <span>⌘K</span>
              </div>
            </Command>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CommandPalette;