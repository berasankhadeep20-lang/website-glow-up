import { useEffect, useState } from "react";
import { Target } from "lucide-react";

const HANDLE = "Ronnie_Deep_04";

type TagStat = { tag: string; solved: number; avgRating: number };

const WeakTopicAnalyzer = () => {
  const [stats, setStats] = useState<TagStat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://codeforces.com/api/user.status?handle=${HANDLE}&count=2000`)
      .then((r) => r.json())
      .then((d) => {
        if (d.status !== "OK") return;
        const solved = new Map<string, { tags: string[]; rating?: number }>();
        for (const s of d.result) {
          if (s.verdict !== "OK") continue;
          const key = `${s.problem.contestId}-${s.problem.index}`;
          if (!solved.has(key)) solved.set(key, { tags: s.problem.tags || [], rating: s.problem.rating });
        }
        const acc = new Map<string, { count: number; ratingSum: number; ratingN: number }>();
        for (const p of solved.values()) {
          for (const t of p.tags) {
            const a = acc.get(t) || { count: 0, ratingSum: 0, ratingN: 0 };
            a.count++;
            if (p.rating) { a.ratingSum += p.rating; a.ratingN++; }
            acc.set(t, a);
          }
        }
        const arr: TagStat[] = Array.from(acc.entries()).map(([tag, v]) => ({
          tag, solved: v.count, avgRating: v.ratingN ? v.ratingSum / v.ratingN : 0,
        }));
        setStats(arr);
      })
      .finally(() => setLoading(false));
  }, []);

  const weakest = [...stats].filter((s) => s.solved >= 2).sort((a, b) => a.avgRating - b.avgRating).slice(0, 6);
  const strongest = [...stats].sort((a, b) => b.solved - a.solved).slice(0, 6);

  return (
    <section id="weak-topics" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <Target className="w-7 h-7" /> Weak Topic Analyzer
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-6">
          Live parse of <span className="font-mono">{HANDLE}</span>'s submissions on Codeforces.
        </p>
        {loading ? (
          <div className="text-center text-muted-foreground text-sm">Crunching submissions…</div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold mb-3 text-red-400">📉 Lowest avg rating (room to grow)</h3>
              <ul className="space-y-2">
                {weakest.map((s) => (
                  <li key={s.tag} className="flex justify-between text-sm">
                    <span className="font-mono">{s.tag}</span>
                    <span className="text-muted-foreground text-xs">
                      {s.solved} solved · avg {Math.round(s.avgRating)}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
            <div className="glass rounded-2xl p-5">
              <h3 className="text-sm font-semibold mb-3 text-emerald-400">💪 Strongest tags by volume</h3>
              <ul className="space-y-2">
                {strongest.map((s) => (
                  <li key={s.tag} className="flex justify-between text-sm">
                    <span className="font-mono">{s.tag}</span>
                    <span className="text-muted-foreground text-xs">{s.solved} solved</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default WeakTopicAnalyzer;