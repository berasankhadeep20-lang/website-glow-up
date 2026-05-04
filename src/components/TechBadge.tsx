import {
  Code2,
  Brain,
  LineChart,
  Database,
  GitBranch,
  Sparkles,
  Trophy,
  Ship,
  Atom,
  FileCode,
  Cpu,
  type LucideIcon,
} from "lucide-react";

type BadgeStyle = { icon: LucideIcon; className: string };

const STYLES: Record<string, BadgeStyle> = {
  python:        { icon: FileCode,  className: "bg-[hsl(48_95%_55%/0.12)] text-[hsl(48_95%_65%)] border-[hsl(48_95%_55%/0.3)]" },
  "scikit-learn":{ icon: Brain,     className: "bg-[hsl(28_90%_55%/0.12)] text-[hsl(28_90%_65%)] border-[hsl(28_90%_55%/0.3)]" },
  pandas:        { icon: Database,  className: "bg-[hsl(260_70%_60%/0.12)] text-[hsl(260_70%_75%)] border-[hsl(260_70%_60%/0.3)]" },
  ml:            { icon: Brain,     className: "bg-[hsl(280_70%_60%/0.12)] text-[hsl(280_70%_75%)] border-[hsl(280_70%_60%/0.3)]" },
  llm:           { icon: Sparkles,  className: "bg-[hsl(200_85%_55%/0.12)] text-[hsl(200_85%_70%)] border-[hsl(200_85%_55%/0.3)]" },
  finance:       { icon: LineChart, className: "bg-[hsl(150_60%_50%/0.12)] text-[hsl(150_60%_65%)] border-[hsl(150_60%_50%/0.3)]" },
  nlp:           { icon: Brain,     className: "bg-[hsl(330_70%_60%/0.12)] text-[hsl(330_70%_75%)] border-[hsl(330_70%_60%/0.3)]" },
  "sports analytics": { icon: Trophy, className: "bg-[hsl(38_90%_55%/0.12)] text-[hsl(38_90%_65%)] border-[hsl(38_90%_55%/0.3)]" },
  yfinance:      { icon: LineChart, className: "bg-[hsl(170_70%_45%/0.12)] text-[hsl(170_70%_60%)] border-[hsl(170_70%_45%/0.3)]" },
  fred:          { icon: LineChart, className: "bg-[hsl(220_75%_60%/0.12)] text-[hsl(220_75%_75%)] border-[hsl(220_75%_60%/0.3)]" },
  sqlite:        { icon: Database,  className: "bg-[hsl(210_70%_50%/0.12)] text-[hsl(210_70%_70%)] border-[hsl(210_70%_50%/0.3)]" },
  "github actions": { icon: GitBranch, className: "bg-[hsl(0_0%_70%/0.12)] text-[hsl(0_0%_85%)] border-[hsl(0_0%_70%/0.3)]" },
  quantum:       { icon: Atom,      className: "bg-[hsl(190_85%_55%/0.12)] text-[hsl(190_85%_70%)] border-[hsl(190_85%_55%/0.3)]" },
  qiskit:        { icon: Atom,      className: "bg-[hsl(280_70%_60%/0.12)] text-[hsl(280_70%_75%)] border-[hsl(280_70%_60%/0.3)]" },
};

const DEFAULT: BadgeStyle = {
  icon: Code2,
  className: "bg-muted text-muted-foreground border-border",
};

interface TechBadgeProps {
  tag: string;
  size?: "sm" | "md";
}

const TechBadge = ({ tag, size = "sm" }: TechBadgeProps) => {
  const style = STYLES[tag.toLowerCase()] ?? DEFAULT;
  const Icon = style.icon;
  const sizing = size === "md" ? "text-sm px-3 py-1.5" : "text-xs px-2.5 py-1";
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border ${sizing} ${style.className}`}
    >
      <Icon className={size === "md" ? "w-3.5 h-3.5" : "w-3 h-3"} />
      {tag}
    </span>
  );
};

export default TechBadge;