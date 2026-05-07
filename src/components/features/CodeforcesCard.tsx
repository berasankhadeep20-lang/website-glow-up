import { useEffect, useState } from "react";
import { Code2, Trophy, Calendar, ExternalLink } from "lucide-react";

const HANDLE = "Ronnie_Deep_04";

interface UserInfo { rating?: number; maxRating?: number; rank?: string; maxRank?: string; }
interface Contest { contestId: number; contestName: string; rank: number; newRating: number; ratingUpdateTimeSeconds: number; }
interface Problem { name: string; rating?: number; index: string; contestId: number; }

const CodeforcesCard = () => {
  const [info, setInfo] = useState<UserInfo | null>(null);
  const [recent, setRecent] = useState<Contest[]>([]);
  const [pod, setPod] = useState<Problem | null>(null);

  useEffect(() => {
    fetch(`https://codeforces.com/api/user.info?handles=${HANDLE}`)
      .then((r) => r.json())
      .then((d) => d.status === "OK" && setInfo(d.result[0]))
      .catch(() => {});
    fetch(`https://codeforces.com/api/user.rating?handle=${HANDLE}`)
      .then((r) => r.json())
      .then((d) => { if (d.status === "OK") setRecent(d.result.slice(-3).reverse()); })
      .catch(() => {});
    fetch(`https://codeforces.com/api/user.status?handle=${HANDLE}&from=1&count=20`)
      .then((r) => r.json())
      .then((d) => {
        if (d.status === "OK") {
          const accepted = d.result.find((s: any) => s.verdict === "OK");
          if (accepted) setPod({
            name: accepted.problem.name,
            rating: accepted.problem.rating,
            index: accepted.problem.index,
            contestId: accepted.problem.contestId,
          });
        }
      })
      .catch(() => {});
  }, []);

  const ratingColor = (r?: number) => {
    if (!r) return "text-muted-foreground";
    if (r >= 2400) return "text-red-500";
    if (r >= 2100) return "text-orange-500";
    if (r >= 1900) return "text-purple-500";
    if (r >= 1600) return "text-blue-500";
    if (r >= 1400) return "text-cyan-500";
    if (r >= 1200) return "text-green-500";
    return "text-gray-400";
  };

  return (
    <section id="codeforces" className="py-24 px-6">
      <div className="max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <Code2 className="w-7 h-7" /> Codeforces · {HANDLE}
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-6">Live rating, recent contests, and the last problem I solved.</p>

        <div className="grid md:grid-cols-2 gap-4">
          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-2">
              <Trophy className="w-3 h-3" /> Rating
            </div>
            <div className="flex items-baseline gap-3">
              <span className={`text-5xl font-bold ${ratingColor(info?.rating)}`}>{info?.rating ?? "—"}</span>
              <span className="text-xs text-muted-foreground">max {info?.maxRating ?? "—"}</span>
            </div>
            <div className="text-xs mt-2 capitalize text-muted-foreground">{info?.rank ?? "unrated"}</div>

            <div className="mt-5 text-[11px] uppercase tracking-wider text-muted-foreground mb-2">Recent contests</div>
            <div className="space-y-2">
              {recent.length === 0 && <div className="text-xs text-muted-foreground">No contests yet.</div>}
              {recent.map((c) => (
                <div key={c.contestId} className="flex justify-between text-xs">
                  <span className="truncate flex-1 mr-2">{c.contestName}</span>
                  <span className={`font-mono ${ratingColor(c.newRating)}`}>#{c.rank} → {c.newRating}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="glass rounded-2xl p-6">
            <div className="flex items-center gap-2 text-xs text-muted-foreground uppercase tracking-wider mb-2">
              <Calendar className="w-3 h-3" /> Last solved
            </div>
            {pod ? (
              <a href={`https://codeforces.com/problemset/problem/${pod.contestId}/${pod.index}`} target="_blank" rel="noopener noreferrer"
                 className="block group">
                <div className="text-lg font-semibold leading-tight mb-2 group-hover:text-primary transition-colors flex items-start gap-2">
                  {pod.name} <ExternalLink className="w-3.5 h-3.5 mt-1 opacity-50" />
                </div>
                <div className="flex gap-2 text-[10px] font-mono">
                  <span className="px-2 py-0.5 rounded-full bg-muted/40">{pod.index}</span>
                  {pod.rating && <span className={`px-2 py-0.5 rounded-full bg-muted/40 ${ratingColor(pod.rating)}`}>★ {pod.rating}</span>}
                  <span className="px-2 py-0.5 rounded-full bg-green-500/20 text-green-500">accepted</span>
                </div>
              </a>
            ) : (
              <div className="text-xs text-muted-foreground">No solved submissions found.</div>
            )}
          </div>
        </div>
        <p className="text-[10px] text-center text-muted-foreground mt-4">
          Live data from the public Codeforces API · refreshes on page load.
        </p>
      </div>
    </section>
  );
};

export default CodeforcesCard;