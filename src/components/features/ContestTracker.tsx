import { useEffect, useState } from "react";
import { CalendarClock, ExternalLink } from "lucide-react";

type Contest = { id: number; name: string; startTimeSeconds: number; durationSeconds: number; type: string; phase: string };

const ContestTracker = () => {
  const [contests, setContests] = useState<Contest[]>([]);
  const [loading, setLoading] = useState(true);
  const [, tick] = useState(0);

  useEffect(() => {
    fetch("https://codeforces.com/api/contest.list?gym=false")
      .then((r) => r.json())
      .then((d) => {
        if (d.status !== "OK") return;
        const upcoming = d.result.filter((c: Contest) => c.phase === "BEFORE" || c.startTimeSeconds * 1000 > Date.now()).slice(0, 5);
        setContests(upcoming.reverse());
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const id = setInterval(() => tick((p) => p + 1), 1000);
    return () => clearInterval(id);
  }, []);

  const fmt = (s: number) => {
    if (s <= 0) return "live";
    const d = Math.floor(s / 86400), h = Math.floor((s % 86400) / 3600), m = Math.floor((s % 3600) / 60), sec = s % 60;
    return d ? `${d}d ${h}h ${m}m` : `${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}:${sec.toString().padStart(2, "0")}`;
  };

  return (
    <section id="contests" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <CalendarClock className="w-7 h-7" /> Upcoming Codeforces Contests
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-6">Live countdown · auto-refreshed</p>
        <div className="glass rounded-2xl p-5">
          {loading && <div className="text-center text-muted-foreground text-sm py-6">Loading…</div>}
          {!loading && contests.length === 0 && <div className="text-center text-muted-foreground text-sm py-6">No upcoming contests.</div>}
          <ul className="divide-y divide-border/40">
            {contests.map((c) => {
              const remaining = c.startTimeSeconds - Math.floor(Date.now() / 1000);
              const date = new Date(c.startTimeSeconds * 1000);
              return (
                <li key={c.id} className="py-3 flex items-center gap-3">
                  <div className="flex-1 min-w-0">
                    <a href={`https://codeforces.com/contest/${c.id}`} target="_blank" rel="noreferrer"
                       className="font-medium text-sm hover:text-primary inline-flex items-center gap-1 truncate">
                      {c.name} <ExternalLink className="w-3 h-3 shrink-0" />
                    </a>
                    <div className="text-[11px] text-muted-foreground">
                      {date.toLocaleString()} · {(c.durationSeconds / 3600).toFixed(1)}h
                    </div>
                  </div>
                  <div className="font-mono text-sm text-primary tabular-nums">{fmt(remaining)}</div>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </section>
  );
};

export default ContestTracker;