import { useEffect, useState } from "react";
import { TrendingUp } from "lucide-react";

const HANDLE = "Ronnie_Deep_04";
const MILESTONES = [1200, 1400, 1600, 1900, 2100, 2400];

type R = { ratingUpdateTimeSeconds: number; newRating: number };

const RatingPredictor = () => {
  const [history, setHistory] = useState<R[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://codeforces.com/api/user.rating?handle=${HANDLE}`)
      .then((r) => r.json())
      .then((d) => { if (d.status === "OK") setHistory(d.result); })
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <section id="predictor" className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center text-muted-foreground text-sm">Loading rating history…</div>
    </section>
  );

  if (history.length < 3) return (
    <section id="predictor" className="py-24 px-6">
      <div className="max-w-3xl mx-auto text-center text-muted-foreground text-sm">Need more contest history to predict.</div>
    </section>
  );

  // Linear regression on (time -> rating)
  const t0 = history[0].ratingUpdateTimeSeconds;
  const xs = history.map((h) => (h.ratingUpdateTimeSeconds - t0) / 86400);
  const ys = history.map((h) => h.newRating);
  const n = xs.length;
  const meanX = xs.reduce((a, b) => a + b, 0) / n;
  const meanY = ys.reduce((a, b) => a + b, 0) / n;
  let num = 0, den = 0;
  for (let i = 0; i < n; i++) { num += (xs[i] - meanX) * (ys[i] - meanY); den += (xs[i] - meanX) ** 2; }
  const slope = den === 0 ? 0 : num / den; // rating per day
  const intercept = meanY - slope * meanX;

  const current = history[history.length - 1].newRating;
  const nowDay = xs[xs.length - 1];

  const predict = (target: number) => {
    if (slope <= 0) return null;
    const day = (target - intercept) / slope;
    if (day <= nowDay) return null;
    const date = new Date((t0 + day * 86400) * 1000);
    return date;
  };

  return (
    <section id="predictor" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <TrendingUp className="w-7 h-7" /> Rating Milestone Predictor
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-6">
          Linear regression on your CF contest history · current rating <span className="font-mono text-primary">{current}</span>
          · trend <span className="font-mono">{(slope * 30).toFixed(1)}/mo</span>
        </p>
        <div className="glass rounded-2xl p-5">
          <ul className="divide-y divide-border/40">
            {MILESTONES.filter((m) => m > current).map((m) => {
              const d = predict(m);
              return (
                <li key={m} className="py-2.5 flex items-center justify-between text-sm">
                  <span className="font-mono">→ {m}</span>
                  <span className="text-muted-foreground">
                    {d ? d.toLocaleDateString(undefined, { year: "numeric", month: "short", day: "numeric" }) : "needs steeper trend"}
                  </span>
                </li>
              );
            })}
          </ul>
          <p className="text-[10px] text-muted-foreground mt-3 italic">
            Toy model — assumes linear improvement. Reality is messier.
          </p>
        </div>
      </div>
    </section>
  );
};

export default RatingPredictor;