import { motion } from "framer-motion";
import { Calendar, MapPin, Sparkles, ShieldCheck, ExternalLink } from "lucide-react";

type Status = "past" | "upcoming";

interface Item {
  title: string;
  org: string;
  date: string; // ISO or human
  location?: string;
  status: Status;
  url?: string;
}

const items: Item[] = [
  // Upcoming (placeholders — edit when you have details)
  {
    title: "Quantum Algorithms Bootcamp (TBA)",
    org: "Upcoming — to confirm",
    date: "2026-09",
    location: "IISER Kolkata",
    status: "upcoming",
  },
  // Past
  {
    title: "Qiskit Quantum Computing Workshop",
    org: "IBM",
    date: "2025",
    location: "Online",
    status: "past",
  },
  {
    title: "Julia Workshop",
    org: "Slashdot, IISER Kolkata",
    date: "2025",
    location: "IISER Kolkata",
    status: "past",
  },
  {
    title: "Colour Grading Workshop",
    org: "Pixel Club & Slashdot",
    date: "2024",
    location: "IISER Kolkata",
    status: "past",
  },
];

interface Credential {
  title: string;
  issuer: string;
  date: string;
  verifyUrl?: string;
}

// Placeholders — replace verifyUrl with real credential URLs when ready.
const credentials: Credential[] = [
  { title: "IBM Quantum — Introductory Badge", issuer: "IBM", date: "2025", verifyUrl: "#" },
  { title: "Machine Learning Specialization", issuer: "Coursera", date: "2025", verifyUrl: "#" },
  { title: "Python for Data Science", issuer: "Coursera", date: "2024", verifyUrl: "#" },
];

const WorkshopsSection = () => (
  <section id="workshops" className="py-24 px-6">
    <div className="max-w-4xl mx-auto">
      <h2 className="text-3xl font-bold gradient-text mb-2 text-center">Workshops & Credentials</h2>
      <p className="text-center text-muted-foreground text-sm mb-12">
        A timeline of trainings I've done — and what's coming up next.
      </p>

      {/* Timeline */}
      <div className="relative pl-6 border-l border-border/60 space-y-6 mb-16">
        {items.map((it, i) => (
          <motion.div
            key={it.title}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="relative"
          >
            <span
              className={`absolute -left-[31px] top-2 w-3 h-3 rounded-full ${
                it.status === "upcoming"
                  ? "bg-secondary animate-pulse ring-4 ring-secondary/20"
                  : "bg-primary"
              }`}
            />
            <div className="glass rounded-xl px-5 py-4 flex flex-col gap-1">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-sm font-semibold text-foreground">{it.title}</h3>
                {it.status === "upcoming" && (
                  <span className="text-[10px] px-2 py-0.5 rounded-full bg-secondary/20 text-secondary inline-flex items-center gap-1">
                    <Sparkles className="w-3 h-3" /> Upcoming
                  </span>
                )}
              </div>
              <p className="text-xs text-muted-foreground">{it.org}</p>
              <div className="flex items-center gap-3 text-[11px] text-muted-foreground mt-1">
                <span className="inline-flex items-center gap-1">
                  <Calendar className="w-3 h-3" /> {it.date}
                </span>
                {it.location && (
                  <span className="inline-flex items-center gap-1">
                    <MapPin className="w-3 h-3" /> {it.location}
                  </span>
                )}
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Verified credentials */}
      <h3 className="text-xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-2">
        <ShieldCheck className="w-5 h-5" /> Verified Credentials
      </h3>
      <p className="text-center text-muted-foreground text-xs mb-6">
        Issuer-verified badges and certificates (placeholders — verify links coming soon).
      </p>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {credentials.map((c, i) => (
          <motion.div
            key={c.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="glass rounded-xl p-4 flex flex-col gap-1.5"
          >
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-4 h-4 text-primary" />
              <span className="text-[10px] uppercase tracking-wider text-muted-foreground">
                {c.issuer}
              </span>
            </div>
            <h4 className="text-sm font-semibold text-foreground">{c.title}</h4>
            <span className="text-[11px] text-muted-foreground">{c.date}</span>
            {c.verifyUrl && c.verifyUrl !== "#" && (
              <a
                href={c.verifyUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-[11px] text-primary inline-flex items-center gap-1 mt-1 hover:underline"
              >
                Verify <ExternalLink className="w-3 h-3" />
              </a>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  </section>
);

export default WorkshopsSection;
