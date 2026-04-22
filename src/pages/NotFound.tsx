import { Link, useLocation } from "react-router-dom";
import { useEffect } from "react";
import { motion } from "framer-motion";
import { Home, AlertTriangle, FolderGit2, BookOpen, Mail, TerminalSquare } from "lucide-react";

const QUICK_LINKS = [
  { label: "Projects", href: "/#projects", icon: FolderGit2 },
  { label: "Blog", href: "/#blog", icon: BookOpen },
  { label: "Terminal", href: "/#terminal", icon: TerminalSquare },
  { label: "Contact", href: "/#contact", icon: Mail },
];

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error("404 Error: User attempted to access non-existent route:", location.pathname);
  }, [location.pathname]);

  return (
    <div className="relative min-h-screen flex items-center justify-center px-6 overflow-hidden bg-background">
      {/* Background glow */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 rounded-full bg-primary/20 blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 rounded-full bg-accent/20 blur-3xl" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="glass rounded-3xl p-10 md:p-16 max-w-xl w-full text-center"
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: "spring" }}
          className="w-20 h-20 mx-auto mb-6 rounded-full gradient-bg flex items-center justify-center"
        >
          <AlertTriangle className="w-10 h-10 text-primary-foreground" />
        </motion.div>

        <h1 className="text-7xl md:text-8xl font-bold gradient-text mb-4">404</h1>
        <p className="text-xl md:text-2xl font-semibold mb-2">Page not found</p>
        <p className="text-muted-foreground mb-8">
          The page{" "}
          <code className="px-2 py-0.5 rounded bg-muted text-sm">{location.pathname}</code>{" "}
          doesn't exist or has been moved.
        </p>

        <Link
          to="/"
          className="gradient-bg text-primary-foreground px-6 py-3 rounded-full font-semibold hover:scale-110 transition-transform shadow-lg shadow-primary/25 inline-flex items-center gap-2"
        >
          <Home className="w-4 h-4" />
          Back to Home
        </Link>

        <div className="mt-10 pt-6 border-t border-border/50">
          <p className="text-xs uppercase tracking-wider text-muted-foreground mb-4">
            Or jump to
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {QUICK_LINKS.map((q) => {
              const Icon = q.icon;
              return (
                <Link
                  key={q.label}
                  to={q.href}
                  className="glass rounded-xl py-3 px-2 hover:text-primary hover:-translate-y-0.5 transition-all flex flex-col items-center gap-1.5 text-xs"
                >
                  <Icon className="w-4 h-4" />
                  {q.label}
                </Link>
              );
            })}
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default NotFound;
