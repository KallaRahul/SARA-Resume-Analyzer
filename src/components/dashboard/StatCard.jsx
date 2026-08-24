import { ResponsiveContainer, LineChart, Line, BarChart, Bar } from "recharts";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

function MiniLine({ data, color }) {
  return (
    <ResponsiveContainer width="100%" height={48}>
      <LineChart data={data} margin={{ top: 6, right: 0, bottom: 0, left: 0 }}>
        <Line
          type="monotone"
          dataKey="v"
          stroke={color}
          strokeWidth={2.5}
          dot={false}
          isAnimationActive={false}
        />
      </LineChart>
    </ResponsiveContainer>
  );
}

function MiniBars({ data, color }) {
  return (
    <ResponsiveContainer width="100%" height={48}>
      <BarChart data={data} margin={{ top: 6, right: 0, bottom: 0, left: 0 }}>
        <Bar dataKey="v" fill={color} radius={[4, 4, 0, 0]} barSize={8} />
      </BarChart>
    </ResponsiveContainer>
  );
}

export function StatCard({
  label,
  value,
  suffix,
  delta,
  chart = "line",
  data = [],
  icon: Icon,
  accent = false,
}) {
  const positive = delta == null ? null : delta >= 0;
  const color = accent ? "#34d399" : "#10b981";
  const ChartCmp = chart === "bars" ? MiniBars : MiniLine;
  const displayValue = value == null || value === "" ? "—" : value;
  const hasData = Array.isArray(data) && data.length > 0;

  return (
    <Card
      variant={accent ? "glow" : "default"}
      className="glass-card p-6 border border-[var(--glass-border)] shadow-xl relative overflow-hidden"
    >
      <div className="flex items-start justify-between gap-4">
        <div className="space-y-2.5 min-w-0 flex-1">
          <div className="flex items-center gap-2.5">
            {Icon && (
              <div className="h-9 w-9 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
                <Icon size={16} />
              </div>
            )}
            <span className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
              {label}
            </span>
          </div>

          <div className="flex items-baseline gap-1.5">
            <span className="font-display tabular text-3xl font-extrabold text-[var(--ink)] tracking-tight">
              {displayValue}
            </span>
            {suffix && (
              <span className="text-xs font-medium text-[var(--ink-muted)]">
                {suffix}
              </span>
            )}
          </div>

          {delta != null && (
            <Badge
              tone={positive ? "accent" : "danger"}
              dot={true}
              className="text-[11px] font-mono"
            >
              {positive ? "+" : ""}
              {delta}%
            </Badge>
          )}
        </div>

        {hasData && (
          <div className="w-[110px] shrink-0 self-end opacity-90">
            <ChartCmp data={data} color={color} />
          </div>
        )}
      </div>
    </Card>
  );
}
