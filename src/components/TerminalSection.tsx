import { useState, useRef, useEffect, KeyboardEvent } from "react";
import { motion } from "framer-motion";

const INFO: Record<string, string> = {
  name: "Sankhadeep Bera",
  location: "Kolkata, India",
  university: "IISER Kolkata (BS-MS)",
  email: "berasankhadeep20@gmail.com",
  github: "https://github.com/berasankhadeep20-lang",
  linkedin: "https://www.linkedin.com/in/sankhadeep-bera-64a1a0364/",
  codeforces: "https://codeforces.com/profile/Ronnie_Deep_04",
  youtube: "https://youtube.com/@ronniedeep",
  twitter: "https://x.com/RonnieDeep04",
  instagram: "https://www.instagram.com/ronnie_deep_04/",
};

const COMMANDS: Record<string, string> = {
  help: "List all available commands",
  whoami: "Display name and bio",
  education: "Show education timeline",
  skills: "List technical skills",
  projects: "Show project list",
  workshops: "Show workshops attended",
  contact: "Display contact info",
  socials: "Show social media links",
  "cat about.txt": "Read about me",
  clear: "Clear the terminal",
  neofetch: "System-style info summary",
  ls: "List available info files",
  pwd: "Print working directory",
  date: "Show current date",
  echo: "Repeat your text (usage: echo <text>)",
};

function processCommand(input: string): string[] {
  const cmd = input.trim().toLowerCase();

  if (cmd === "help") {
    return [
      "Available commands:",
      "",
      ...Object.entries(COMMANDS).map(([k, v]) => `  \x1b[36m${k.padEnd(18)}\x1b[0m ${v}`),
    ];
  }
  if (cmd === "whoami") {
    return [
      "Sankhadeep Bera",
      "BS-MS Student at IISER Kolkata | Programmer | Editor",
      "JEE Mains 94.89% | WBJEE Rank 1596 | IAT Rank 3065",
    ];
  }
  if (cmd === "education") {
    return [
      "📚 Education:",
      "  ├─ IISER Kolkata — BS-MS (Currently Pursuing)",
      "  ├─ Bhavans Gangabux Kanoria Vidyamandir — Class 12, 89.8% (CBSE 2025)",
      "  └─ St. Joseph's College Bowbazar — Class 10, 94% (ICSE 2023)",
    ];
  }
  if (cmd === "skills") {
    return [
      "🛠 Skills:",
      "  • Python",
      "  • Java",
      "  • Quantum Computing (Qiskit)",
      "  • DaVinci Resolve Editing",
    ];
  }
  if (cmd === "projects") {
    return [
      "🚀 Projects:",
      "  1. F1 AI Race Predictor — ML-based F1 race outcome prediction",
      "  2. LLM for Stock Market — LLM-based stock analysis & insights",
      "  3. AI Football Predictor — ML football match outcome prediction",
      "",
      "  Type 'cat project1', 'cat project2', or 'cat project3' for details.",
    ];
  }
  if (cmd === "cat project1") {
    return [
      "F1 AI Race Predictor",
      "ML system predicting Formula 1 race outcomes using historical data.",
      "→ github.com/berasankhadeep20-lang/F1-AI-Predictor",
    ];
  }
  if (cmd === "cat project2") {
    return [
      "LLM for Stock Market Analysis",
      "LLM project analyzing stock data and generating financial insights.",
      "→ github.com/berasankhadeep20-lang/LLM-For-stock-market",
    ];
  }
  if (cmd === "cat project3") {
    return [
      "AI Football Match Outcome Predictor",
      "Predicts match outcomes using team stats and historical data.",
      "→ github.com/berasankhadeep20-lang/AI-Football-Match-Outcome-Predictor",
    ];
  }
  if (cmd === "workshops") {
    return [
      "🎓 Workshops:",
      "  • Julia Workshop — Slashdot IISER Kolkata",
      "  • Qiskit Quantum Computing — IBM",
      "  • Colour Grading — Pixel Club & Slashdot",
    ];
  }
  if (cmd === "contact") {
    return [
      "📬 Contact:",
      `  Email: ${INFO.email}`,
      `  GitHub: ${INFO.github}`,
      `  Codeforces: ${INFO.codeforces}`,
    ];
  }
  if (cmd === "socials") {
    return [
      "🌐 Socials:",
      `  LinkedIn:  ${INFO.linkedin}`,
      `  Twitter:   ${INFO.twitter}`,
      `  Instagram: ${INFO.instagram}`,
      `  YouTube:   ${INFO.youtube}`,
    ];
  }
  if (cmd === "cat about.txt") {
    return [
      "Hi! I'm Sankhadeep Bera, a BS-MS student at IISER Kolkata.",
      "I'm passionate about programming, machine learning, and quantum computing.",
      "I also enjoy video editing with DaVinci Resolve.",
      "I scored 94.89 percentile in JEE Mains 2025,",
      "WBJEE Rank 1596, and IAT Rank 3065.",
    ];
  }
  if (cmd === "neofetch") {
    return [
      "  ┌──────────────────────────┐",
      "  │   sankhadeep@portfolio   │",
      "  ├──────────────────────────┤",
      `  │  OS:       Portfolio v1  │`,
      `  │  User:     Sankhadeep    │`,
      `  │  Uni:      IISER Kolkata │`,
      `  │  Lang:     Python, Java  │`,
      `  │  Editor:   DaVinci       │`,
      `  │  Shell:    /bin/curious   │`,
      "  └──────────────────────────┘",
    ];
  }
  if (cmd === "ls") {
    return ["about.txt  education  skills  projects  workshops  contact  socials"];
  }
  if (cmd === "pwd") {
    return ["/home/sankhadeep/portfolio"];
  }
  if (cmd === "date") {
    return [new Date().toString()];
  }
  if (cmd.startsWith("echo ")) {
    return [cmd.slice(5)];
  }
  if (cmd === "clear") {
    return ["__CLEAR__"];
  }
  if (cmd === "") {
    return [];
  }
  return [`command not found: ${cmd}`, "Type 'help' for available commands."];
}

interface Line {
  type: "input" | "output";
  text: string;
}

const Terminal = () => {
  const [lines, setLines] = useState<Line[]>([
    { type: "output", text: "Welcome to Sankhadeep's portfolio terminal! Type 'help' for commands." },
    { type: "output", text: "" },
  ]);
  const [input, setInput] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [lines]);

  const handleSubmit = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key !== "Enter") return;
    const result = processCommand(input);
    if (result[0] === "__CLEAR__") {
      setLines([]);
    } else {
      setLines((prev) => [
        ...prev,
        { type: "input", text: input },
        ...result.map((t) => ({ type: "output" as const, text: t })),
        { type: "output", text: "" },
      ]);
    }
    setInput("");
  };

  const colorize = (text: string) => {
    // Simple ANSI-like coloring: \x1b[36m = cyan, \x1b[0m = reset
    const parts = text.split(/\x1b\[(\d+)m/);
    const result: JSX.Element[] = [];
    let currentColor = "";
    for (let i = 0; i < parts.length; i++) {
      if (i % 2 === 1) {
        currentColor = parts[i] === "36" ? "text-primary" : "";
      } else {
        result.push(
          <span key={i} className={currentColor}>{parts[i]}</span>
        );
      }
    }
    return result;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="glass rounded-2xl overflow-hidden max-w-3xl mx-auto"
      onClick={() => inputRef.current?.focus()}
    >
      {/* Title bar */}
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border/50">
        <div className="w-3 h-3 rounded-full bg-red-500" />
        <div className="w-3 h-3 rounded-full bg-yellow-500" />
        <div className="w-3 h-3 rounded-full bg-green-500" />
        <span className="ml-3 text-xs text-muted-foreground">sankhadeep@portfolio:~</span>
      </div>

      {/* Terminal body */}
      <div className="p-4 h-80 overflow-y-auto font-mono text-sm leading-relaxed scrollbar-thin">
        {lines.map((line, i) => (
          <div key={i}>
            {line.type === "input" ? (
              <div>
                <span className="text-green-400">❯ </span>
                <span className="text-foreground">{line.text}</span>
              </div>
            ) : (
              <div className="text-muted-foreground whitespace-pre">{colorize(line.text)}</div>
            )}
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-green-400">❯ </span>
          <input
            ref={inputRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleSubmit}
            className="flex-1 bg-transparent outline-none text-foreground ml-1 caret-primary"
            autoFocus
            spellCheck={false}
          />
        </div>
        <div ref={bottomRef} />
      </div>
    </motion.div>
  );
};

const TerminalSection = () => (
  <section id="terminal" className="py-24 px-6">
    <div className="max-w-5xl mx-auto">
      <h2 className="text-3xl font-bold gradient-text mb-4 text-center">Interactive Terminal</h2>
      <p className="text-center text-muted-foreground text-sm mb-10">
        Type <span className="text-primary font-mono">help</span> to see all available commands
      </p>
      <Terminal />
    </div>
  </section>
);

export default TerminalSection;
