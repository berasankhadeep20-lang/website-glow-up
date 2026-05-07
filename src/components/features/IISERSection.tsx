import { useState } from "react";
import { GraduationCap, BookOpen, Quote, MapPin, FlaskConical } from "lucide-react";

const SEMESTERS = [
  { sem: "Sem 1", year: "2025", courses: ["Calculus I", "Mechanics", "Intro Chemistry", "Biology I", "English"], status: "current" },
  { sem: "Sem 2", year: "2026", courses: ["Calculus II", "Electromagnetism", "Organic Chem", "Biology II"], status: "upcoming" },
  { sem: "Sem 3+", year: "2026+", courses: ["Quantum Mechanics", "Statistical Physics", "Algorithms", "Linear Algebra"], status: "upcoming" },
];

const NOTEBOOK = [
  { date: "May 2026", title: "QAOA layer-depth experiments", note: "Reading 2605.00980. Reproducing Fig. 3 with p=2 on triangle MaxCut." },
  { date: "Apr 2026", title: "F1 model — added tyre stints", note: "Brought log-loss from 1.42 → 1.18 on 2024 holdout. Pirelli compound features mattered most." },
  { date: "Mar 2026", title: "First IISER lab notebook entry", note: "Set up the public log. Goal: 1 entry/week, citations linked." },
];

const PINS = [
  { name: "Hostel Block", x: 22, y: 60 },
  { name: "Physics Dept.", x: 55, y: 35 },
  { name: "Library", x: 70, y: 50 },
  { name: "Lake Side", x: 35, y: 80 },
];

const IISERSection = () => {
  const [tab, setTab] = useState<"courses" | "lab" | "citations" | "map">("courses");

  return (
    <section id="iiser" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <GraduationCap className="w-7 h-7" /> Life at IISER Kolkata
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-6">BS-MS journey, lab notes, and the campus I call home.</p>
        <div className="flex justify-center gap-2 mb-6 flex-wrap">
          {([
            { id: "courses", label: "Courses", icon: BookOpen },
            { id: "lab", label: "Lab Notebook", icon: FlaskConical },
            { id: "citations", label: "Citations", icon: Quote },
            { id: "map", label: "Campus Map", icon: MapPin },
          ] as const).map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)}
              className={`px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 ${tab === t.id ? "bg-primary text-primary-foreground" : "glass"}`}>
              <t.icon className="w-3 h-3" /> {t.label}
            </button>
          ))}
        </div>

        <div className="glass rounded-2xl p-6">
          {tab === "courses" && (
            <div className="grid md:grid-cols-3 gap-4">
              {SEMESTERS.map((s) => (
                <div key={s.sem} className={`rounded-xl p-4 border ${s.status === "current" ? "border-primary/50 bg-primary/5" : "border-border/40"}`}>
                  <div className="flex justify-between items-baseline mb-3">
                    <span className="text-sm font-semibold">{s.sem}</span>
                    <span className="text-[10px] text-muted-foreground font-mono">{s.year}</span>
                  </div>
                  <ul className="space-y-1.5">
                    {s.courses.map((c) => <li key={c} className="text-xs text-muted-foreground">• {c}</li>)}
                  </ul>
                  {s.status === "current" && <div className="mt-3 text-[10px] text-primary font-mono">● in progress</div>}
                </div>
              ))}
            </div>
          )}
          {tab === "lab" && (
            <div className="space-y-4">
              {NOTEBOOK.map((n) => (
                <div key={n.title} className="border-l-2 border-primary/40 pl-4 py-1">
                  <div className="flex items-baseline justify-between">
                    <h3 className="text-sm font-semibold">{n.title}</h3>
                    <span className="text-[10px] text-muted-foreground font-mono">{n.date}</span>
                  </div>
                  <p className="text-xs text-muted-foreground mt-1">{n.note}</p>
                </div>
              ))}
            </div>
          )}
          {tab === "citations" && (
            <div className="grid grid-cols-3 gap-4 text-center">
              {[
                { label: "Citations", value: "0" },
                { label: "Papers", value: "0" },
                { label: "h-index", value: "0" },
              ].map((m) => (
                <div key={m.label} className="rounded-xl bg-muted/30 p-6">
                  <div className="text-3xl font-bold gradient-text">{m.value}</div>
                  <div className="text-[10px] text-muted-foreground uppercase tracking-wider mt-1">{m.label}</div>
                </div>
              ))}
              <p className="col-span-3 text-[10px] text-muted-foreground">Auto-syncs from Google Scholar once first paper is indexed.</p>
            </div>
          )}
          {tab === "map" && (
            <div className="relative w-full aspect-[2/1] rounded-xl bg-gradient-to-br from-emerald-900/30 via-teal-800/20 to-blue-900/30 overflow-hidden border border-border/40">
              <svg className="absolute inset-0 w-full h-full opacity-20" viewBox="0 0 100 50">
                <path d="M0 30 Q 25 20, 50 30 T 100 30" stroke="hsl(var(--primary))" strokeWidth="0.3" fill="none" />
                <circle cx="50" cy="30" r="20" stroke="hsl(var(--secondary))" strokeWidth="0.2" fill="none" />
              </svg>
              {PINS.map((p) => (
                <div key={p.name} className="absolute -translate-x-1/2 -translate-y-full" style={{ left: `${p.x}%`, top: `${p.y}%` }}>
                  <MapPin className="w-5 h-5 text-primary fill-primary/30" />
                  <span className="text-[10px] font-mono whitespace-nowrap absolute left-1/2 -translate-x-1/2 mt-0 px-1.5 py-0.5 rounded bg-background/80">{p.name}</span>
                </div>
              ))}
              <div className="absolute bottom-2 right-3 text-[9px] text-muted-foreground font-mono">IISER Kolkata · Mohanpur</div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
};

export default IISERSection;