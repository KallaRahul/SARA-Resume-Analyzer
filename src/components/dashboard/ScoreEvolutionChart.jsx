import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from "recharts";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { TrendingUp, Sparkles } from "lucide-react";

function CustomTooltip({ active, payload, label }) {
  if (!active || !payload?.length) return null;
  return (
    <div className="rounded-xl glass-panel border border-emerald-500/40 shadow-2xl px-4 py-2.5 text-xs">
      <div className="text-[var(--ink-muted)] font-extrabold uppercase tracking-wider text-[10px]">
        {label}
      </div>
      <div className="font-display tabular text-lg font-extrabold text-emerald-400 mt-0.5 flex items-center gap-1">
        <Sparkles size={12} />
        {payload[0].value} ATS Score
      </div>
    </div>
  );
}

export function ScoreEvolutionChart({ data, currentScore, delta }) {
  return (
    <Card className="glass-card h-full p-6 border border-[var(--glass-border)] shadow-xl relative overflow-hidden flex flex-col justify-between">
      <CardHeader className="mb-2">
        <div>
          <CardTitle className="text-lg font-bold font-display flex items-center gap-2">
            <TrendingUp size={18} className="text-emerald-400" />
            Score Trajectory
          </CardTitle>
          <CardDescription>
            ATS Score evolution over resume versions
          </CardDescription>
        </div>
        <Badge tone="accent" dot={true} className="font-bold font-mono">
          Top Tier Match
        </Badge>
      </CardHeader>

      <div className="flex items-end justify-between gap-6 my-3">
        <div>
          <div className="text-xs uppercase tracking-wider text-[var(--ink-muted)] font-extrabold">
            Current Analysis
          </div>
          <div className="flex items-baseline gap-2 mt-1">
            <span className="font-display tabular text-4xl font-extrabold text-[var(--ink)] tracking-tight text-gradient-emerald">
              {currentScore}
            </span>
            <span className="text-sm font-semibold text-[var(--ink-muted)]">/ 100 benchmark</span>
          </div>
        </div>
        <div className="text-right">
          <div className="text-xs uppercase tracking-wider text-[var(--ink-muted)] font-extrabold">
            Net Score Boost
          </div>
          <Badge tone={delta >= 0 ? "accent" : "danger"} className="mt-1 font-mono font-bold text-xs">
            {delta >= 0 ? "+" : ""}
            {delta} pts growth
          </Badge>
        </div>
      </div>

      <div className="h-[200px] -mx-2 mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
            <defs>
              <linearGradient id="scoreFill" x1="0" y1="0" x2="0" y2="1">
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
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="score"
              stroke="#10b981"
              strokeWidth={3}
              fill="url(#scoreFill)"
              dot={{ r: 4, stroke: "#10b981", fill: "#0f172a", strokeWidth: 2 }}
              activeDot={{ r: 7, stroke: "#34d399", fill: "#10b981" }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </Card>
  );
}
