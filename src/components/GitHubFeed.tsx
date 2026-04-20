import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Github, GitCommit, Star, GitFork, Calendar } from "lucide-react";

const USER = "berasankhadeep20-lang";

interface Repo {
  id: number;
  name: string;
  html_url: string;
  description: string | null;
  stargazers_count: number;
  forks_count: number;
  language: string | null;
  pushed_at: string;
}

interface Event {
  id: string;
  type: string;
  repo: { name: string };
  created_at: string;
  payload: any;
}

const GitHubFeed = () => {
  const [repos, setRepos] = useState<Repo[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    Promise.all([
      fetch(`https://api.github.com/users/${USER}/repos?sort=pushed&per_page=6`).then((r) =>
        r.ok ? r.json() : Promise.reject(r.status)
      ),
      fetch(`https://api.github.com/users/${USER}/events/public?per_page=10`).then((r) =>
        r.ok ? r.json() : Promise.reject(r.status)
      ),
    ])
      .then(([r, e]) => {
        setRepos(r);
        setEvents(e);
      })
      .catch((err) => setError(`GitHub API error (${err})`))
      .finally(() => setLoading(false));
  }, []);

  const eventLabel = (e: Event) => {
    switch (e.type) {
      case "PushEvent":
        return `Pushed ${e.payload?.commits?.length || 0} commit(s)`;
      case "CreateEvent":
        return `Created ${e.payload?.ref_type || "repo"}`;
      case "WatchEvent":
        return "Starred";
      case "ForkEvent":
        return "Forked";
      case "PullRequestEvent":
        return `${e.payload?.action || "updated"} PR`;
      case "IssuesEvent":
        return `${e.payload?.action || "updated"} issue`;
      default:
        return e.type.replace("Event", "");
    }
  };

  const fmtDate = (s: string) =>
    new Date(s).toLocaleDateString("en-US", { month: "short", day: "numeric" });

  return (
    <section id="github" className="py-24 px-6">
      <div className="max-w-5xl mx-auto">
        <h2 className="text-3xl font-bold gradient-text mb-2 text-center flex items-center justify-center gap-3">
          <Github className="w-7 h-7" /> Live GitHub Activity
        </h2>
        <p className="text-center text-muted-foreground text-sm mb-10">
          Latest repositories and contributions, fetched live from GitHub
        </p>

        {loading ? (
          <p className="text-center text-muted-foreground">Loading…</p>
        ) : error ? (
          <p className="text-center text-muted-foreground text-sm">{error}</p>
        ) : (
          <div className="grid lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Recent Repositories
              </h3>
              <div className="grid sm:grid-cols-2 gap-4">
                {repos.map((r, i) => (
                  <motion.a
                    key={r.id}
                    href={r.html_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.04 }}
                    className="glass rounded-xl p-4 block hover:-translate-y-1 hover:glow-primary transition-all"
                  >
                    <div className="font-semibold text-primary mb-1 truncate">{r.name}</div>
                    <p className="text-xs text-muted-foreground line-clamp-2 min-h-[2.5em]">
                      {r.description || "No description"}
                    </p>
                    <div className="flex items-center gap-3 mt-3 text-[11px] text-muted-foreground">
                      {r.language && (
                        <span className="flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-accent" />
                          {r.language}
                        </span>
                      )}
                      <span className="flex items-center gap-1">
                        <Star className="w-3 h-3" /> {r.stargazers_count}
                      </span>
                      <span className="flex items-center gap-1">
                        <GitFork className="w-3 h-3" /> {r.forks_count}
                      </span>
                      <span className="ml-auto flex items-center gap-1">
                        <Calendar className="w-3 h-3" /> {fmtDate(r.pushed_at)}
                      </span>
                    </div>
                  </motion.a>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-sm font-semibold uppercase tracking-wider text-muted-foreground mb-4">
                Activity Feed
              </h3>
              <div className="glass rounded-xl p-4 max-h-[400px] overflow-y-auto scrollbar-thin space-y-3">
                {events.length === 0 && (
                  <p className="text-xs text-muted-foreground">No recent public activity.</p>
                )}
                {events.map((e, i) => (
                  <motion.div
                    key={e.id}
                    initial={{ opacity: 0, x: -10 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.03 }}
                    className="flex gap-3 text-xs"
                  >
                    <div className="mt-0.5 text-primary">
                      <GitCommit className="w-3.5 h-3.5" />
                    </div>
                    <div className="min-w-0">
                      <div className="text-foreground">{eventLabel(e)}</div>
                      <a
                        href={`https://github.com/${e.repo.name}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-primary truncate block hover:underline"
                      >
                        {e.repo.name}
                      </a>
                      <div className="text-[10px] text-muted-foreground">{fmtDate(e.created_at)}</div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default GitHubFeed;