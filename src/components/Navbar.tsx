import { useState, useEffect, useRef, useLayoutEffect } from "react";
import { motion } from "framer-motion";
import ThemeSwitcher from "./ThemeSwitcher";
import { useActiveSection } from "@/hooks/useActiveSection";

const links = [
  { label: "Now", href: "now" },
  { label: "Education", href: "education" },
  { label: "Skills", href: "skills" },
  { label: "Projects", href: "projects" },
  { label: "GitHub", href: "github" },
  { label: "Research", href: "research" },
  { label: "Blog", href: "blog" },
  { label: "Workshops", href: "workshops" },
  { label: "Physics", href: "physics" },
  { label: "Resume", href: "resume" },
  { label: "Terminal", href: "terminal" },
  { label: "Guestbook", href: "guestbook" },
  { label: "Contact", href: "contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);
  const ids = links.map((l) => l.href);
  const active = useActiveSection(ids);
  const containerRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});
  const [pill, setPill] = useState({ left: 0, width: 0, opacity: 0 });

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useLayoutEffect(() => {
    const el = itemRefs.current[active];
    const c = containerRef.current;
    if (el && c) {
      const rect = el.getBoundingClientRect();
      const cRect = c.getBoundingClientRect();
      setPill({ left: rect.left - cRect.left, width: rect.width, opacity: 1 });
    } else {
      setPill((p) => ({ ...p, opacity: 0 }));
    }
  }, [active]);

  const onClick = (e: React.MouseEvent, href: string) => {
    e.preventDefault();
    document.getElementById(href)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "glass py-3" : "py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center gap-4">
        <a
          href="#"
          onClick={(e) => {
            e.preventDefault();
            window.scrollTo({ top: 0, behavior: "smooth" });
          }}
          className="text-lg font-bold gradient-text"
        >
          SB
        </a>
        <div ref={containerRef} className="hidden md:flex relative items-center gap-1">
          <motion.div
            className="absolute h-8 rounded-full bg-primary/15 border border-primary/30"
            animate={{ left: pill.left, width: pill.width, opacity: pill.opacity }}
            transition={{ type: "spring", stiffness: 380, damping: 30 }}
            style={{ top: "50%", translateY: "-50%" }}
          />
          {links.map((l) => (
            <a
              key={l.href}
              ref={(el) => (itemRefs.current[l.href] = el)}
              href={`#${l.href}`}
              onClick={(e) => onClick(e, l.href)}
              className={`relative z-10 px-3 py-1 text-sm transition-colors ${
                active === l.href ? "text-primary" : "text-muted-foreground hover:text-primary"
              }`}
            >
              {l.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => {
              const ev = new KeyboardEvent("keydown", { key: "k", metaKey: true });
              document.dispatchEvent(ev);
            }}
            className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs text-muted-foreground hover:text-primary transition-colors"
            aria-label="Open command palette"
          >
            <span>⌘K</span>
            <span>Search</span>
          </button>
          <ThemeSwitcher />
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;