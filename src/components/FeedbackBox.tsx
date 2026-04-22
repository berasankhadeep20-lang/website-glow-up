import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MessageSquare, X, Send, Bug, Lightbulb, Heart, MoreHorizontal } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

type Category = "bug" | "idea" | "compliment" | "other";

const CATEGORIES: { id: Category; label: string; icon: typeof Bug }[] = [
  { id: "idea", label: "Idea", icon: Lightbulb },
  { id: "bug", label: "Bug", icon: Bug },
  { id: "compliment", label: "Kudos", icon: Heart },
  { id: "other", label: "Other", icon: MoreHorizontal },
];

const FeedbackBox = () => {
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState("");
  const [category, setCategory] = useState<Category>("idea");
  const [submitting, setSubmitting] = useState(false);

  const submit = async () => {
    if (!message.trim()) return;
    setSubmitting(true);
    const { error } = await supabase.from("feedback_submissions").insert({
      message: message.trim(),
      category,
    });
    setSubmitting(false);
    if (error) {
      toast.error("Couldn't send feedback. Try again?");
      return;
    }
    toast.success("Thanks for the feedback! 🙏");
    setMessage("");
    setOpen(false);
  };

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="fixed bottom-6 left-6 z-40 w-12 h-12 rounded-full gradient-bg shadow-lg shadow-primary/30 flex items-center justify-center hover:scale-110 transition-transform"
        aria-label="Send anonymous feedback"
        title="Send anonymous feedback"
      >
        <MessageSquare className="w-5 h-5 text-primary-foreground" />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setOpen(false)}
            className="fixed inset-0 z-[70] bg-background/80 backdrop-blur-md flex items-end sm:items-center justify-center px-4 pb-24 sm:pb-4"
          >
            <motion.div
              initial={{ y: 50, scale: 0.95 }}
              animate={{ y: 0, scale: 1 }}
              exit={{ y: 50, scale: 0.95 }}
              onClick={(e) => e.stopPropagation()}
              className="glass rounded-2xl p-6 max-w-md w-full"
            >
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h3 className="font-semibold">Anonymous feedback</h3>
                  <p className="text-xs text-muted-foreground">No name, no email — just thoughts.</p>
                </div>
                <button onClick={() => setOpen(false)} aria-label="Close">
                  <X className="w-4 h-4 text-muted-foreground hover:text-primary" />
                </button>
              </div>

              <div className="grid grid-cols-4 gap-2 mb-3">
                {CATEGORIES.map((c) => {
                  const Icon = c.icon;
                  const active = category === c.id;
                  return (
                    <button
                      key={c.id}
                      onClick={() => setCategory(c.id)}
                      className={`flex flex-col items-center gap-1 py-2 rounded-lg text-xs transition-colors ${
                        active
                          ? "bg-primary/15 text-primary border border-primary/30"
                          : "bg-muted/40 text-muted-foreground hover:text-primary"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                      {c.label}
                    </button>
                  );
                })}
              </div>

              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value.slice(0, 1000))}
                placeholder="Tell me what to improve, what works, what doesn't…"
                className="w-full h-32 bg-muted/40 rounded-lg p-3 text-sm outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
              <div className="flex items-center justify-between mt-3">
                <span className="text-[10px] text-muted-foreground">{message.length}/1000</span>
                <button
                  onClick={submit}
                  disabled={submitting || !message.trim()}
                  className="gradient-bg text-primary-foreground px-4 py-2 rounded-full text-sm font-semibold inline-flex items-center gap-2 disabled:opacity-40 disabled:cursor-not-allowed hover:scale-105 transition-transform"
                >
                  <Send className="w-3.5 h-3.5" />
                  {submitting ? "Sending…" : "Send"}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};

export default FeedbackBox;