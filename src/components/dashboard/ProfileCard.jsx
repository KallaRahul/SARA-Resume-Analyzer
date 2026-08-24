import { useNavigate } from "react-router-dom";
import { Upload, BarChart3, Calendar, Sparkles } from "lucide-react";
import { Card } from "@/components/ui/Card";
import { Avatar } from "@/components/ui/Avatar";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";

function memberSince(date) {
  if (!date) return null;
  const d = new Date(date);
  return d.toLocaleDateString(undefined, { month: "short", year: "numeric" });
}

export function ProfileCard({ user, stats }) {
  const nav = useNavigate();
  const since = memberSince(user?.createdAt);

  return (
    <Card className="glass-card h-full flex flex-col items-center text-center p-6 border border-[var(--glass-border)] shadow-xl relative overflow-hidden justify-between">
      <div className="flex flex-col items-center">
        <div className="relative">
          <Avatar name={user?.name} size={72} className="ring-4 ring-emerald-500/40 shadow-lg shadow-emerald-500/20" />
          <span className="absolute -bottom-1 -right-1 h-6 w-6 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center text-xs font-extrabold shadow-md border-2 border-slate-900">
            ✓
          </span>
        </div>

        <div className="mt-4">
          <div className="font-display text-lg font-bold tracking-tight text-[var(--ink)]">
            {user?.name || "Ravi Teja"}
          </div>
          <div className="text-xs text-[var(--ink-muted)] mt-0.5 font-medium">
            {user?.email || "candidate@sara.ai"}
          </div>
          <Badge tone="accent" dot={true} className="mt-2.5 font-bold uppercase tracking-wider text-[10px]">
            SARA Pro Plan
          </Badge>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-3 w-full my-5 py-4 border-y border-[var(--border)]">
        {stats.map((s) => (
          <div key={s.label}>
            <div className="text-[10px] uppercase tracking-wider text-[var(--ink-muted)] font-bold">
              {s.label}
            </div>
            <div className="font-display tabular text-xl font-extrabold mt-1 text-[var(--ink)]">
              {s.value}
            </div>
          </div>
        ))}
      </div>

      <div className="w-full space-y-3">
        <div className="grid grid-cols-2 gap-2 w-full">
          <Button
            variant="accent"
            size="sm"
            onClick={() => nav("/resumes")}
            className="w-full font-bold text-xs"
          >
            <Upload size={14} /> Scan
          </Button>
          <Button
            variant="glass"
            size="sm"
            onClick={() => nav("/insights")}
            className="w-full font-bold text-xs"
          >
            <BarChart3 size={14} /> Insights
          </Button>
        </div>
        {since && (
          <div className="flex items-center justify-center gap-1.5 text-[11px] text-[var(--ink-muted)] font-medium">
            <Calendar size={12} />
            Member since {since}
          </div>
        )}
      </div>
    </Card>
  );
}
