import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  History as HistoryIcon,
  Upload,
  Sparkles,
  PenLine,
  ChevronRight,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { cn, relativeTime } from "@/lib/utils";
import { useHistory } from "@/hooks/useAnalytics";

const FILTERS = [
  { key: "all", label: "All Activity", icon: HistoryIcon },
  { key: "upload", label: "PDF Uploads", icon: Upload },
  { key: "analyze", label: "AI Scans", icon: Sparkles },
  { key: "rewrite", label: "Bullet Rewrites", icon: PenLine },
];

const ICONS = {
  upload: Upload,
  analyze: Sparkles,
  rewrite: PenLine,
};

const TONES = {
  upload: "neutral",
  analyze: "accent",
  rewrite: "accent",
};

function dayKey(date) {
  const d = new Date(date);
  const today = new Date();
  const yesterday = new Date();
  yesterday.setDate(today.getDate() - 1);

  const isSameDay = (a, b) =>
    a.toDateString() === b.toDateString();

  if (isSameDay(d, today)) return "Today";
  if (isSameDay(d, yesterday)) return "Yesterday";
  return d.toLocaleDateString(undefined, {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: d.getFullYear() !== today.getFullYear() ? "numeric" : undefined,
  });
}

export default function History() {
  const nav = useNavigate();
  const { data, isLoading, error } = useHistory();
  const [filter, setFilter] = useState("all");

  const events = data?.events || [];
  const totals = data?.totals || { all: 0 };

  const filtered = useMemo(() => {
    if (filter === "all") return events;
    return events.filter((e) => e.type === filter);
  }, [events, filter]);

  const grouped = useMemo(() => {
    const groups = new Map();
    for (const e of filtered) {
      const key = dayKey(e.at);
      if (!groups.has(key)) groups.set(key, []);
      groups.get(key).push(e);
    }
    return Array.from(groups.entries());
  }, [filtered]);

  if (isLoading) return <HistorySkeleton />;

  if (error) {
    return (
      <EmptyState
        icon={HistoryIcon}
        title="Couldn't load activity history"
        description={error.message}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity Audit Log"
        description="Chronological log of all uploaded resumes, AI analysis runs, and bullet merges."
      />

      <div className="inline-flex items-center gap-1.5 bg-white/5 border border-white/10 p-1.5 rounded-2xl backdrop-blur-md flex-wrap">
        {FILTERS.map((f) => {
          const Icon = f.icon;
          const count = totals[f.key] ?? events.length;
          const isActive = filter === f.key;
          return (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "h-9 px-4 text-xs font-bold rounded-xl transition-all inline-flex items-center gap-2",
                isActive
                  ? "bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow-md"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
              )}
            >
              <Icon size={14} />
              {f.label}
              <span
                className={cn(
                  "font-mono text-[10px] px-2 py-0.5 rounded-md font-extrabold",
                  isActive
                    ? "bg-slate-950/30 text-slate-950"
                    : "bg-white/10 text-[var(--ink-muted)]"
                )}
              >
                {count}
              </span>
            </button>
          );
        })}
      </div>

      {grouped.length === 0 ? (
        <EmptyState
          icon={HistoryIcon}
          title="No activity recorded"
          description={
            filter === "all"
              ? "Once you upload a resume or execute an AI scan, events will populate here."
              : "No events match this activity filter."
          }
        />
      ) : (
        <div className="space-y-8">
          {grouped.map(([day, items]) => (
            <div key={day}>
              <div className="flex items-center gap-3 mb-3.5">
                <h3 className="text-xs uppercase tracking-wider font-extrabold text-emerald-400 font-display">
                  {day}
                </h3>
                <div className="flex-1 h-px bg-[var(--border)]" />
                <span className="text-xs font-mono font-bold text-[var(--ink-muted)]">
                  {items.length} events
                </span>
              </div>

              <Card className="glass-card !p-0 border border-[var(--glass-border)] shadow-xl overflow-hidden divide-y divide-[var(--border)]">
                {items.map((e) => {
                  const Icon = ICONS[e.type] || HistoryIcon;
                  return (
                    <button
                      key={e.id}
                      onClick={() =>
                        e.resumeId && nav(`/resumes/${e.resumeId}`)
                      }
                      className="w-full text-left flex items-center justify-between gap-4 px-6 py-4 hover:bg-white/5 transition-colors"
                    >
                      <div className="flex items-center gap-3.5 min-w-0">
                        <div className="h-10 w-10 shrink-0 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center">
                          <Icon size={16} />
                        </div>
                        <div className="min-w-0">
                          <div className="text-xs font-bold text-[var(--ink)] truncate">
                            {e.title}
                          </div>
                          <div className="text-[11px] text-[var(--ink-muted)] mt-0.5 truncate font-medium">
                            {e.subtitle}
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 shrink-0">
                        <div className="text-right">
                          <Badge tone={TONES[e.type] || "neutral"} className="font-mono text-[10px] font-bold uppercase">
                            {e.label}
                          </Badge>
                          <div className="text-[10px] text-[var(--ink-muted)] mt-1 font-mono">
                            {relativeTime(e.at)}
                          </div>
                        </div>
                        <ChevronRight size={16} className="text-emerald-400" />
                      </div>
                    </button>
                  );
                })}
              </Card>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function HistorySkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-1/3 rounded-2xl" />
      <Skeleton className="h-11 w-[420px] rounded-full" />
      {Array.from({ length: 3 }).map((_, i) => (
        <div key={i} className="space-y-3">
          <Skeleton className="h-4 w-24 rounded-full" />
          <Skeleton className="h-[240px] rounded-3xl" />
        </div>
      ))}
    </div>
  );
}
