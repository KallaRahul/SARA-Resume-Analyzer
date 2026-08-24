import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { TrendingUp, TrendingDown, Minus, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { cn } from "@/lib/utils";

const RADIUS = 130;
const ARC_LENGTH = Math.PI * RADIUS;

function statusFor(score) {
  if (score >= 85) return { label: "ATS Preferred", tone: "accent" };
  if (score >= 70) return { label: "ATS Strong", tone: "success" };
  if (score >= 55) return { label: "Fair Match", tone: "warning" };
  if (score > 0) return { label: "Critical Fixes", tone: "danger" };
  return { label: "Unscored", tone: "neutral" };
}

function useCountUp(target, duration = 1100) {
  const [value, setValue] = useState(0);
  useEffect(() => {
    if (target == null) return;
    const start = performance.now();
    let raf;
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const eased = 1 - Math.pow(1 - t, 4);
      setValue(Math.round(target * eased));
      if (t < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, duration]);
  return value;
}

export function AtsGauge({ score = 0, delta = 0 }) {
  const safeScore = Math.max(0, Math.min(100, score || 0));
  const pct = safeScore / 100;
  const dashLength = ARC_LENGTH * pct;
  const status = statusFor(safeScore);
  const animated = useCountUp(safeScore);

  const DeltaIcon =
    delta > 0 ? TrendingUp : delta < 0 ? TrendingDown : Minus;

  return (
    <Card className="glass-card h-full flex flex-col justify-between p-6 border border-[var(--glass-border)] shadow-xl relative overflow-hidden">
      <CardHeader className="mb-2">
        <div>
          <CardTitle className="text-lg font-bold font-display flex items-center gap-2">
            <Sparkles size={16} className="text-emerald-400" />
            ATS Readiness
          </CardTitle>
          <CardDescription>
            Recruiter & ATS Parser Compliance
          </CardDescription>
        </div>
        <Badge tone={status.tone} dot={true}>{status.label}</Badge>
      </CardHeader>

      <div className="flex-1 flex flex-col items-center justify-center gap-4 py-2">
        <div className="relative w-full max-w-[340px]">
          <svg
            viewBox="0 0 300 170"
            className="w-full h-auto block"
            preserveAspectRatio="xMidYMid meet"
          >
            <defs>
              <linearGradient id="atsGrad" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="#10b981" />
                <stop offset="50%" stopColor="#06b6d4" />
                <stop offset="100%" stopColor="#3b82f6" />
              </linearGradient>
            </defs>

            {/* Track */}
            <path
              d={`M 20 155 A ${RADIUS} ${RADIUS} 0 0 1 280 155`}
              fill="none"
              stroke="rgba(255, 255, 255, 0.08)"
              strokeWidth="16"
              strokeLinecap="round"
            />

            {/* Value Arc */}
            <motion.path
              d={`M 20 155 A ${RADIUS} ${RADIUS} 0 0 1 280 155`}
              fill="none"
              stroke="url(#atsGrad)"
              strokeWidth="16"
              strokeLinecap="round"
              strokeDasharray={ARC_LENGTH}
              initial={{ strokeDashoffset: ARC_LENGTH }}
              animate={{ strokeDashoffset: ARC_LENGTH - dashLength }}
              transition={{ duration: 1.2, ease: [0.16, 1, 0.3, 1] }}
            />
          </svg>

          {/* Score sitting inside center */}
          <div className="absolute inset-x-0 top-[42%] flex flex-col items-center pointer-events-none">
            <div className="text-[11px] uppercase tracking-widest text-[var(--ink-muted)] font-extrabold">
              ATS Compatibility
            </div>
            <div className="font-display tabular text-5xl font-extrabold tracking-tight text-[var(--ink)] leading-none mt-1 text-gradient-emerald">
              {animated}%
            </div>
            <div className="text-[11px] text-[var(--ink-muted)] mt-1 font-medium">
              out of 100 benchmark
            </div>
          </div>
        </div>

        {/* Delta pill */}
        <div
          className={cn(
            "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold border",
            delta > 0 && "bg-emerald-500/15 text-emerald-400 border-emerald-500/30",
            delta < 0 && "bg-rose-500/15 text-rose-400 border-rose-500/30",
            delta === 0 && "bg-slate-500/10 text-slate-400 border-slate-500/20"
          )}
        >
          <DeltaIcon size={12} strokeWidth={2.5} />
          {delta > 0 ? "+" : ""}
          {delta} pts vs last scan
        </div>
      </div>
    </Card>
  );
}
