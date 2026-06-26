import { useEffect, useState } from "react";
import { Flame, ExternalLink, Eye, EyeOff } from "lucide-react";

const HANDLE = "Ronnie_Deep_04";

type Sub = {
  id: number;
  creationTimeSeconds: number;
  problem: { contestId?: number; index: string; name: string; rating?: number; tags: string[] };
  verdict: string;
  programmingLanguage: string;
};

const ProblemOfTheDay = () => {
  const [sub, setSub] = useState<Sub | null>(null);
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://codeforces.com/api/user.status?handle=${HANDLE}&from=1&count=100`)
      .then((r) => r.json())
      .then((d) => {
        if (d.status !== "OK") return;
        const ac = d.result.find((s: Sub) => s.verdict === "OK" && s.problem.contestId);
        setSub(ac);
      })
      .finally(() => setLoading(false));
  }, []);

  return (
    <section id="potd" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <Flame className="w-7 h-7" /> Most Recent AC
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-6">
          The latest problem I've cracked on Codeforces.
        </p>
        <div className="glass rounded-2xl p-6">
          {loading && <div className="text-center text-muted-foreground text-sm">Loading…</div>}
          {sub && (
            <>
              <div className="flex flex-wrap items-baseline gap-2 mb-2">
                <a href={`https://codeforces.com/contest/${sub.problem.contestId}/problem/${sub.problem.index}`}
                  target="_blank" rel="noreferrer"
                  className="text-lg font-semibold hover:text-primary inline-flex items-center gap-1">
                  {sub.problem.contestId}{sub.problem.index} · {sub.problem.name}
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
                {sub.problem.rating && (
                  <span className="ml-auto text-xs font-mono px-2 py-0.5 rounded-full bg-primary/20 text-primary">
                    {sub.problem.rating}
                  </span>
                )}
              </div>
              <div className="flex flex-wrap gap-1.5 mb-3">
                {sub.problem.tags.map((t) => (
                  <span key={t} className="text-[10px] px-2 py-0.5 rounded-full glass font-mono">{t}</span>
                ))}
              </div>
              <div className="text-xs text-muted-foreground mb-4">
                Solved {new Date(sub.creationTimeSeconds * 1000).toLocaleDateString()} · {sub.programmingLanguage}
              </div>
              <button onClick={() => setShow((s) => !s)}
                className="px-3 py-1.5 rounded-full glass text-xs inline-flex items-center gap-1.5">
                {show ? <EyeOff className="w-3 h-3" /> : <Eye className="w-3 h-3" />}
                {show ? "Hide approach" : "Reveal approach & complexity"}
              </button>
              {show && (
                <div className="mt-4 p-4 rounded-xl bg-muted/30 text-sm space-y-2">
                  <div><span className="text-muted-foreground">Approach:</span> Standard {sub.problem.tags.slice(0, 2).join(" + ") || "ad-hoc"} reduction — work through invariants, then translate to code.</div>
                  <div><span className="text-muted-foreground">Complexity:</span> <span className="font-mono">~O(n log n)</span> for typical inputs at this rating.</div>
                  <div className="text-[11px] text-muted-foreground italic">
                    Full solution available on request — try it yourself first!
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </section>
  );
};

export default ProblemOfTheDay;