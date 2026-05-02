import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Briefcase, X, Mail, FileText, FolderGit2, Code2, Copy, Check } from "lucide-react";

const STORAGE_KEY = "recruiter-mode";

const RecruiterMode = () => {
  const [active, setActive] = useState(false);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (localStorage.getItem(STORAGE_KEY) === "1") setActive(true);
    if (new URLSearchParams(window.location.search).get("recruiter") === "1") setActive(true);
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle("recruiter-mode", active);
    localStorage.setItem(STORAGE_KEY, active ? "1" : "0");
  }, [active]);

  const goto = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });

  const copyEmail = async () => {
    await navigator.clipboard.writeText("berasankhadeep20@gmail.com");
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  };

  return (
    <>
      <button
        onClick={() => setActive((p) => !p)}
        className="fixed top-20 right-4 z-40 flex items-center gap-2 px-3 py-1.5 rounded-full glass text-xs hover:text-primary transition-colors"
        aria-label="Toggle recruiter mode"
      >
        <Briefcase className="w-3.5 h-3.5" />
        <span className="hidden sm:inline">{active ? "Recruiter mode ON" : "Recruiter mode"}</span>
      </button>

      <AnimatePresence>
        {active && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-32 right-4 z-40 glass rounded-2xl p-4 w-72 shadow-xl border border-primary/30"
          >
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-semibold uppercase tracking-wider text-primary">
                Recruiter quick view
              </span>
              <button onClick={() => setActive(false)} aria-label="Close">
                <X className="w-4 h-4 text-muted-foreground hover:text-foreground" />
              </button>
            </div>
            <p className="text-xs text-muted-foreground mb-3">
              Hi! Here are the fastest ways to evaluate me:
            </p>
            <div className="space-y-1.5">
              <button
                onClick={() => goto("resume")}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/40 hover:bg-primary/10 hover:text-primary transition-colors text-sm"
              >
                <FileText className="w-4 h-4" /> Resume
              </button>
              <button
                onClick={() => goto("projects")}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/40 hover:bg-primary/10 hover:text-primary transition-colors text-sm"
              >
                <FolderGit2 className="w-4 h-4" /> Projects
              </button>
              <button
                onClick={() => goto("coding")}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/40 hover:bg-primary/10 hover:text-primary transition-colors text-sm"
              >
                <Code2 className="w-4 h-4" /> Coding stats
              </button>
              <button
                onClick={copyEmail}
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg bg-muted/40 hover:bg-primary/10 hover:text-primary transition-colors text-sm"
              >
                {copied ? <Check className="w-4 h-4 text-primary" /> : <Copy className="w-4 h-4" />}
                {copied ? "Email copied!" : "Copy email"}
              </button>
              <a
                href="mailto:berasankhadeep20@gmail.com?subject=Opportunity%20for%20Sankhadeep"
                className="w-full flex items-center gap-2 px-3 py-2 rounded-lg gradient-bg text-primary-foreground transition-colors text-sm font-semibold"
              >
                <Mail className="w-4 h-4" /> Reach out
              </a>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default RecruiterMode;