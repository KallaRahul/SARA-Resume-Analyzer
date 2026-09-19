import { ResponsiveContainer, RadarChart, Radar, PolarGrid, PolarAngleAxis, PolarRadiusAxis } from "recharts";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

export function ScoreBreakdown({ breakdown }) {
  if (!breakdown) return null;

  // Helper to extract numerical value out of 25
  const getValue = (val, fallback = 18) => {
    if (typeof val === "number" && !isNaN(val)) {
      return val > 25 ? Math.min(25, Math.round(val / 4)) : Math.min(25, Math.max(0, Math.round(val)));
    }
    return fallback;
  };

  let kw = 18, fmt = 18, imp = 18, clr = 18;

  if (Array.isArray(breakdown)) {
    breakdown.forEach((item) => {
      const lbl = (item.label || item.axis || "").toLowerCase();
      const val = item.value ?? item.v ?? 70;
      if (lbl.includes("key")) kw = getValue(val);
      else if (lbl.includes("format") || lbl.includes("structure")) fmt = getValue(val);
      else if (lbl.includes("impact") || lbl.includes("metric")) imp = getValue(val);
      else if (lbl.includes("clarity") || lbl.includes("readability") || lbl.includes("verb")) clr = getValue(val);
    });
  } else if (typeof breakdown === "object") {
    kw = getValue(breakdown.keywords ?? breakdown.Keywords, 20);
    fmt = getValue(breakdown.formatting ?? breakdown.format ?? breakdown.Formatting, 19);
    imp = getValue(breakdown.impact ?? breakdown.Impact, 18);
    clr = getValue(breakdown.clarity ?? breakdown.readability ?? breakdown.Clarity, 21);
  }

  const data = [
    { axis: "Keywords", v: kw, full: 25 },
    { axis: "Formatting", v: fmt, full: 25 },
    { axis: "Impact", v: imp, full: 25 },
    { axis: "Clarity", v: clr, full: 25 },
  ];

  return (
    <Card className="h-full flex flex-col justify-between p-6 glass-card border border-[var(--glass-border)] shadow-xl">
      <CardHeader className="p-0 mb-2">
        <div>
          <CardTitle className="text-base font-bold font-display">Score Breakdown</CardTitle>
          <CardDescription className="mt-0.5 text-xs">Each axis scored out of 25</CardDescription>
        </div>
      </CardHeader>
      <div className="h-[210px] w-full min-h-[200px] relative my-1">
        <ResponsiveContainer width="100%" height="100%">
          <RadarChart data={data} outerRadius="70%">
            <PolarGrid stroke="rgba(255, 255, 255, 0.15)" />
            <PolarAngleAxis
              dataKey="axis"
              tick={{ fontSize: 11, fill: "var(--ink-muted)", fontWeight: 600 }}
            />
            <PolarRadiusAxis domain={[0, 25]} tick={false} axisLine={false} />
            <Radar
              dataKey="v"
              stroke="#10b981"
              fill="#10b981"
              fillOpacity={0.35}
              strokeWidth={2.5}
              dot={{ r: 3, fill: "#10b981" }}
            />
          </RadarChart>
        </ResponsiveContainer>
      </div>
      <div className="grid grid-cols-4 gap-2 pt-3 border-t border-[var(--border)]">
        {data.map((d) => (
          <div key={d.axis} className="text-center">
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--ink-muted)]">
              {d.axis}
            </div>
            <div className="font-display tabular text-base sm:text-lg font-extrabold mt-0.5 text-[var(--ink)]">
              {d.v}
              <span className="text-xs text-[var(--ink-muted)] font-normal ml-0.5">
                /25
              </span>
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}

