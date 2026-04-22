import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { BookHeart, Send } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Entry {
  id: string;
  name: string;
  message: string;
  emoji: string | null;
  created_at: string;
}

const EMOJI_OPTIONS = ["👋", "🚀", "💡", "🔬", "❤️", "🎉", "🌟", "🤝"];

const formatTime = (iso: string) => {
  const d = new Date(iso);
  const diff = (Date.now() - d.getTime()) / 1000;
  if (diff < 60) return "just now";
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
  return d.toLocaleDateString();
};

const Guestbook = () => {
  const [entries, setEntries] = useState<Entry[]>([]);
  const [name, setName] = useState("");
  const [message, setMessage] = useState("");
  const [emoji, setEmoji] = useState("👋");
  const [submitting, setSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    const { data, error } = await supabase
      .from("guestbook_entries")
      .select("id, name, message, emoji, created_at")
      .order("created_at", { ascending: false })
      .limit(50);
    if (!error && data) setEntries(data as Entry[]);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const submit = async () => {
    if (!name.trim() || !message.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from("guestbook_entries").insert({
      name: name.trim(),
      message: message.trim(),
      emoji,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Couldn't sign the guestbook. Try again?");
      return;
    }
    toast.success("Signed! Thanks for stopping by 🙏");
    setName("");
    setMessage("");
    load();
  };

  return (
    <section id="guestbook" className="py-24 px-6">
      <div className="max-w-3xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-10"
        >
          <div className="inline-flex items-center gap-2 mb-3 text-primary">
            <BookHeart className="w-5 h-5" />
          </div>
          <h2 className="text-3xl font-bold gradient-text mb-2">Guestbook</h2>
          <p className="text-muted-foreground text-sm">
            Leave a note — say hi, share an idea, or just sign your name.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="glass rounded-2xl p-5 mb-8"
        >
          <div className="flex flex-col sm:flex-row gap-3 mb-3">
            <input
              value={name}
              onChange={(e) => setName(e.target.value.slice(0, 50))}
              placeholder="Your name"
              className="flex-1 bg-muted/40 rounded-lg px-3 py-2 text-sm outline-none focus:ring-2 focus:ring-primary/40"
            />
            <div className="flex gap-1 overflow-x-auto scrollbar-thin">
              {EMOJI_OPTIONS.map((e) => (
                <button
                  key={e}
                  onClick={() => setEmoji(e)}
                  className={`w-9 h-9 rounded-lg flex-shrink-0 text-lg transition-all ${
                    emoji === e ? "bg-primary/15 ring-1 ring-primary/40" : "hover:bg-muted/60"
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
          </div>
          <textarea
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 280))}
            placeholder="Your message (max 280 chars)"
            className="w-full bg-muted/40 rounded-lg p-3 text-sm h-20 outline-none focus:ring-2 focus:ring-primary/40 resize-none"
          />
          <div className="flex items-center justify-between mt-2">
            <span className="text-[10px] text-muted-foreground">{message.length}/280</span>
            <button
              onClick={submit}
              disabled={submitting || !name.trim() || !message.trim()}
              className="gradient-bg text-primary-foreground px-4 py-1.5 rounded-full text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-transform"
            >
              <Send className="w-3.5 h-3.5" />
              {submitting ? "Signing…" : "Sign"}
            </button>
          </div>
        </motion.div>

        {loading ? (
          <p className="text-center text-sm text-muted-foreground">Loading messages…</p>
        ) : entries.length === 0 ? (
          <p className="text-center text-sm text-muted-foreground">Be the first to sign! ✍️</p>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {entries.map((entry) => (
                <motion.div
                  key={entry.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0 }}
                  className="glass rounded-xl p-4 flex gap-3"
                >
                  <div className="text-2xl flex-shrink-0">{entry.emoji || "💬"}</div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-baseline justify-between gap-2 mb-1">
                      <span className="text-sm font-semibold text-primary truncate">{entry.name}</span>
                      <span className="text-[10px] text-muted-foreground flex-shrink-0">
                        {formatTime(entry.created_at)}
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground break-words">{entry.message}</p>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        )}
      </div>
    </section>
  );
};

export default Guestbook;