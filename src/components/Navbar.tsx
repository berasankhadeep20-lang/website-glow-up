import { useState, useEffect } from "react";
import { motion } from "framer-motion";

const links = [
  { label: "Education", href: "#education" },
  { label: "Skills", href: "#skills" },
  { label: "Projects", href: "#projects" },
  { label: "Workshops", href: "#workshops" },
  { label: "Terminal", href: "#terminal" },
  { label: "Contact", href: "#contact" },
];

const Navbar = () => {
  const [scrolled, setScrolled] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.nav
      initial={{ y: -80 }}
      animate={{ y: 0 }}
      className={`fixed top-0 w-full z-50 transition-all duration-300 ${
        scrolled ? "glass py-3" : "py-5"
      }`}
    >
      <div className="max-w-6xl mx-auto px-6 flex justify-between items-center">
        <span className="text-lg font-bold gradient-text">SB</span>
        <div className="hidden md:flex gap-6">
          {links.map((l) => (
            <a
              key={l.href}
              href={l.href}
              className="text-sm text-muted-foreground hover:text-primary transition-colors"
            >
              {l.label}
            </a>
          ))}
        </div>
      </div>
    </motion.nav>
  );
};

export default Navbar;
