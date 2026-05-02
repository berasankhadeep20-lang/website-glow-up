import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Trophy, Code2, Target } from "lucide-react";

const CF_HANDLE = "Ronnie_Deep_04";

interface CFUser {
  handle: string;
  rating?: number;
  maxRating?: number;
  rank?: string;
  maxRank?: string;
  contribution?: number;
}

interface CFStatus {
  problem: { name: string; rating?: number };
  verdict: string;
}

const ratingColor = (r?: number) => {
  if (!r) return "text-muted-foreground";
  if (r < 1200) return "text-gray-400";
  if (r < 1400) return "text-green-400";
  if (r < 1600) return "text-cyan-400";
  if (r < 1900) return "text-blue-400";
  if (r < 2100) return "text-violet-400";
  if (r < 2400) return "text-orange-400";
  return "text-red-400";
};

const CodingStats = () => {
  const [user, setUser] = useState<CFUser | null>(null);
  const [solved, setSolved] = useState<number | null>(null);
  const [contests, setContests] = useState<number | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`https://codeforces.com/api/user.info?handles=${CF_HANDLE}`).then((r) => r.json()),
      fetch(`https://codeforces.com/api/user.status?handle=${CF_HANDLE}&from=1&count=10000`).then((r) => r.json()),
      fetch(`https://codeforces.com/api/user.rating?handle=${CF_HANDLE}`).then((r) => r.json()),
    ])
      .then(([info, status, rating]) => {
        if (info.status !== "OK") throw new Error(info.comment || "CF user not found");
        setUser(info.result[0]);
        if (status.status === "OK") {
          const set = new Set<string>();
          (status.result as CFStatus[]).forEach((s) => {
            if (s.verdict === "OK") set.add(s.problem.name);
          });
          setSolved(set.size);
        }
        if (rating.status === "OK") setContests(rating.result.length);
      })
      .catch((e) => setError(e instanceof Error ? e.message : "Failed to load"));
  }, []);

  return (
    <section id="coding" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <Code2 className="w-7 h-7" /> Competitive Programming
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-10">
          Live stats from Codeforces · handle{" "}
          <a
            href={`https://codeforces.com/profile/${CF_HANDLE}`}
            target="_blank"
            rel="noopener noreferrer"
            className="text-primary hover:underline"
          >
            {CF_HANDLE}
          </a>
        </p>

        {error ? (
          <p className="text-center text-muted-foreground text-sm">{error}</p>
        ) : !user ? (
          <p className="text-center text-muted-foreground text-sm">Loading…</p>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-4">
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="glass rounded-2xl p-5 text-center hover:-translate-y-1 hover:glow-primary transition-all"
            >
              <Trophy className="w-5 h-5 mx-auto mb-2 text-primary" />
              <div className={`text-3xl font-bold ${ratingColor(user.rating)}`}>{user.rating ?? "—"}</div>
              <div className="text-xs text-muted-foreground mt-1 capitalize">{user.rank || "Unrated"}</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.05 }}
              className="glass rounded-2xl p-5 text-center hover:-translate-y-1 hover:glow-primary transition-all"
            >
              <Target className="w-5 h-5 mx-auto mb-2 text-accent" />
              <div className={`text-3xl font-bold ${ratingColor(user.maxRating)}`}>{user.maxRating ?? "—"}</div>
              <div className="text-xs text-muted-foreground mt-1 capitalize">Peak ({user.maxRank || "—"})</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.1 }}
              className="glass rounded-2xl p-5 text-center hover:-translate-y-1 hover:glow-primary transition-all"
            >
              <div className="text-3xl font-bold text-primary">{solved ?? "—"}</div>
              <div className="text-xs text-muted-foreground mt-1">Problems Solved</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.15 }}
              className="glass rounded-2xl p-5 text-center hover:-translate-y-1 hover:glow-primary transition-all"
            >
              <div className="text-3xl font-bold text-accent">{contests ?? "—"}</div>
              <div className="text-xs text-muted-foreground mt-1">Contests Played</div>
            </motion.div>
          </div>
        )}
      </div>
    </section>
  );
};

export default CodingStats;