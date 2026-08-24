import { useNavigate } from "react-router-dom";
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
} from "recharts";
import {
  TrendingUp,
  Trophy,
  Sparkles,
  AlertCircle,
  ChevronRight,
  BarChart3,
} from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Button } from "@/components/ui/Button";
import { useInsights } from "@/hooks/useAnalytics";

const SEV_TONE = { low: "neutral", medium: "warning", high: "danger" };

export default function Insights() {
  const nav = useNavigate();
  const { data, isLoading, error } = useInsights();

  if (isLoading) return <InsightsSkeleton />;

  if (error) {
    return (
      <EmptyState
        icon={BarChart3}
        title="Couldn't load insights"
        description={error.message}
      />
    );
  }

  if (data?.empty) {
    return (
      <div className="space-y-6">
        <PageHeader
          title="Analytics Insights"
          description="Cross-resume performance tracking & keyword gap patterns."
        />
        <EmptyState
          icon={Sparkles}
          title="No AI Scan Data Yet"
          description="Analyze your first resume to unlock ATS trend charts, recurring keyword gaps, and score trajectory."
          action={
            <Button variant="accent" size="lg" onClick={() => nav("/resumes")} className="font-bold">
              Go to Resumes Vault
            </Button>
          }
        />
      </div>
    );
  }

  const trend = (data.scoreTrend || []).map((p, i) => ({
    label: `#${i + 1}`,
    score: p.score,
    at: p.at,
    resumeTitle: p.resumeTitle,
  }));

  return (
    <div className="space-y-6">
      <PageHeader
        title="Analytics Insights"
        description="Cross-resume performance trends, recurring ATS flags, and keyword density patterns."
      />

      {/* KPI row */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <Kpi
          label="Average ATS Score"
          value={data.averageScore}
          suffix="/ 100"
          icon={TrendingUp}
        />
        <Kpi
          label="Highest Score Achieved"
          value={data.bestScore.value}
          suffix="/ 100"
          sub={data.bestScore.resumeTitle}
          icon={Trophy}
          accent
        />
        <Kpi
          label="Total Scans Executed"
          value={data.totalAnalyses}
          icon={Sparkles}
        />
      </div>

      {/* Trend chart */}
      <Card className="glass-card p-6 border border-[var(--glass-border)] shadow-xl relative overflow-hidden">
        <CardHeader className="!mb-4">
          <div>
            <CardTitle className="text-lg font-bold font-display flex items-center gap-2">
              <TrendingUp size={18} className="text-emerald-400" />
              Chronological Score Trajectory
            </CardTitle>
            <CardDescription className="mt-1">
              Historical progression across all resume versions
            </CardDescription>
          </div>
        </CardHeader>
        <div className="h-[260px] -mx-2 mt-2">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={trend} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
              <defs>
                <linearGradient id="iScoreFill" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#10b981" stopOpacity={0.4} />
                  <stop offset="100%" stopColor="#10b981" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid stroke="rgba(255, 255, 255, 0.08)" vertical={false} strokeDasharray="3 4" />
              <XAxis
                dataKey="label"
                tick={{ fontSize: 11, fill: "var(--ink-muted)", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis
                domain={[0, 100]}
                tick={{ fontSize: 11, fill: "var(--ink-muted)", fontWeight: 600 }}
                axisLine={false}
                tickLine={false}
                width={32}
              />
              <Tooltip
                content={({ active, payload }) =>
                  active && payload?.length ? (
                    <div className="rounded-xl glass-panel border border-emerald-500/40 shadow-2xl px-4 py-2.5 text-xs">
                      <div className="text-[var(--ink-muted)] font-extrabold uppercase tracking-wider text-[10px]">
                        {payload[0].payload.resumeTitle}
                      </div>
                      <div className="font-display tabular text-lg font-extrabold text-emerald-400 mt-0.5">
                        {payload[0].value} / 100 ATS Score
                      </div>
                    </div>
                  ) : null
                }
              />
              <Area
                type="monotone"
                dataKey="score"
                stroke="#10b981"
                strokeWidth={3}
                fill="url(#iScoreFill)"
                dot={{ r: 4, stroke: "#10b981", fill: "#0f172a", strokeWidth: 2 }}
                activeDot={{ r: 7, stroke: "#34d399", fill: "#10b981" }}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
      </Card>

      {/* Issues + Missing Keywords */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="glass-card p-6 border border-[var(--glass-border)] shadow-xl">
          <CardHeader className="!mb-4">
            <div>
              <CardTitle className="text-base font-bold font-display flex items-center gap-2">
                <AlertCircle size={16} className="text-amber-400" />
                Recurring ATS Compliance Flags
              </CardTitle>
              <CardDescription className="mt-1">
                Frequent formatting or content issues surfaced by AI
              </CardDescription>
            </div>
          </CardHeader>
          {data.topIssues.length === 0 ? (
            <p className="text-xs text-[var(--ink-muted)] italic">No issues recorded across your scans.</p>
          ) : (
            <div className="space-y-3.5">
              {data.topIssues.map((issue, i) => (
                <div key={i} className="flex items-start gap-3 p-3 rounded-xl bg-white/5 border border-white/5">
                  <div className="h-8 w-8 rounded-xl bg-rose-500/15 text-rose-400 flex items-center justify-center shrink-0">
                    <AlertCircle size={15} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold text-[var(--ink)] truncate">{issue.title}</div>
                    <div className="flex items-center gap-2 mt-1.5">
                      <Badge tone={SEV_TONE[issue.severity] || "neutral"} className="text-[10px] uppercase font-mono font-bold">
                        {issue.severity}
                      </Badge>
                      <span className="text-[11px] font-mono text-[var(--ink-muted)]">
                        Flagged {issue.count}× in scans
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </Card>

        <Card className="glass-card p-6 border border-[var(--glass-border)] shadow-xl">
          <CardHeader className="!mb-4">
            <div>
              <CardTitle className="text-base font-bold font-display">
                Most-Missed Target Keywords
              </CardTitle>
              <CardDescription className="mt-1">
                Terms expected by job descriptions but missing from your PDFs
              </CardDescription>
            </div>
          </CardHeader>
          {data.topMissingKeywords.length === 0 ? (
            <p className="text-xs text-emerald-400 font-bold italic">
              All target keywords present across your resume scans!
            </p>
          ) : (
            <div className="flex flex-wrap gap-2">
              {data.topMissingKeywords.map((k, i) => (
                <span
                  key={i}
                  className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-mono font-bold bg-rose-500/15 border border-rose-500/30 text-rose-400"
                >
                  {k.keyword}
                  <span className="text-[10px] opacity-80 font-black">×{k.count}</span>
                </span>
              ))}
            </div>
          )}
        </Card>
      </div>

      {/* Per-resume table */}
      <Card className="glass-card p-6 border border-[var(--glass-border)] shadow-xl overflow-hidden">
        <CardHeader className="!mb-4">
          <div>
            <CardTitle className="text-base font-bold font-display">Resume Performance Index</CardTitle>
            <CardDescription className="mt-1">
              Historical breakdown by document version
            </CardDescription>
          </div>
        </CardHeader>
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="text-left text-[10px] uppercase tracking-wider text-emerald-400 font-extrabold border-b border-[var(--border)]">
                <th className="pb-3 px-2 font-bold">Resume Document</th>
                <th className="pb-3 px-2 font-bold text-right">Latest Score</th>
                <th className="pb-3 px-2 font-bold text-right">Peak Score</th>
                <th className="pb-3 px-2 font-bold text-right">Net Growth</th>
                <th className="pb-3 px-2 font-bold text-right">Total Scans</th>
                <th className="pb-3 px-2 w-8" />
              </tr>
            </thead>
            <tbody className="divide-y divide-[var(--border)]">
              {data.resumePerformance.map((r) => (
                <tr
                  key={r.resumeId}
                  onClick={() => nav(`/resumes/${r.resumeId}`)}
                  className="hover:bg-white/5 cursor-pointer transition-colors"
                >
                  <td className="py-3 px-2 font-bold text-[var(--ink)] truncate max-w-[260px]">
                    {r.title}
                  </td>
                  <td className="py-3 px-2 text-right tabular font-display font-extrabold text-sm text-[var(--ink)]">
                    {r.latestScore}
                  </td>
                  <td className="py-3 px-2 text-right tabular text-[var(--ink-muted)] font-mono font-semibold">
                    {r.bestScore}
                  </td>
                  <td className="py-3 px-2 text-right">
                    <Badge tone={r.improvement >= 0 ? "accent" : "danger"} className="font-mono font-bold text-[11px]">
                      {r.improvement >= 0 ? "+" : ""}
                      {r.improvement} pts
                    </Badge>
                  </td>
                  <td className="py-3 px-2 text-right tabular text-[var(--ink-muted)] font-mono">
                    {r.analysesCount}
                  </td>
                  <td className="py-3 px-2 text-emerald-400">
                    <ChevronRight size={16} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}

function Kpi({ label, value, suffix, sub, icon: Icon, accent }) {
  return (
    <Card variant={accent ? "glow" : "default"} className="glass-card p-6 border border-[var(--glass-border)] shadow-xl relative overflow-hidden">
      <div className="flex items-start justify-between">
        <div className="space-y-2 min-w-0">
          <div className="flex items-center gap-2">
            <div className="h-8 w-8 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
              <Icon size={16} />
            </div>
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
              {label}
            </span>
          </div>
          <div className="flex items-baseline gap-1.5">
            <span className="font-display tabular text-3xl font-extrabold tracking-tight text-[var(--ink)] text-gradient-emerald">
              {value}
            </span>
            {suffix && (
              <span className="text-xs font-medium text-[var(--ink-muted)]">
                {suffix}
              </span>
            )}
          </div>
          {sub && (
            <div className="text-xs font-semibold text-emerald-400 truncate mt-1">
              {sub}
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

function InsightsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-1/3 rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[120px] rounded-2xl" />
        ))}
      </div>
      <Skeleton className="h-[300px] rounded-3xl" />
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
        <Skeleton className="h-[300px] rounded-3xl" />
        <Skeleton className="h-[300px] rounded-3xl" />
      </div>
    </div>
  );
}
