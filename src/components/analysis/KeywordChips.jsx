import { Check, X, KeyRound, Sparkles } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";

function Chip({ children, tone }) {
  if (tone === "present") {
    return (
      <span className="inline-flex items-center gap-1.5 h-8 pl-2 pr-3.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-mono font-bold transition-all hover:scale-105 shadow-sm">
        <span className="h-4 w-4 rounded-full bg-emerald-500 text-slate-950 flex items-center justify-center font-black">
          <Check size={10} strokeWidth={4} />
        </span>
        {children}
      </span>
    );
  }
  return (
    <span className="inline-flex items-center gap-1.5 h-8 pl-2 pr-3.5 rounded-xl bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-mono font-bold transition-all hover:scale-105 shadow-sm">
      <span className="h-4 w-4 rounded-full bg-rose-500 text-slate-950 flex items-center justify-center font-black">
        <X size={10} strokeWidth={4} />
      </span>
      {children}
    </span>
  );
}

function SectionHeader({ tone, label, count }) {
  const isPresent = tone === "present";
  return (
    <div className="flex items-center gap-3 mb-3.5">
      <span
        className={
          isPresent
            ? "h-7 w-7 rounded-xl bg-emerald-500/20 text-emerald-400 border border-emerald-500/40 flex items-center justify-center"
            : "h-7 w-7 rounded-xl bg-rose-500/20 text-rose-400 border border-rose-500/40 flex items-center justify-center"
        }
      >
        {isPresent ? <Check size={14} strokeWidth={3} /> : <X size={14} strokeWidth={3} />}
      </span>
      <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink)] font-display">{label} Keywords</div>
      <span className="px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-xs font-mono font-bold text-emerald-400">
        {count}
      </span>
      <div className="flex-1 h-px bg-[var(--border)]" />
    </div>
  );
}

export function KeywordChips({ present = [], missing = [] }) {
  const total = present.length + missing.length;
  const pct = total ? Math.round((present.length / total) * 100) : 0;

  return (
    <Card className="glass-card p-6 border border-[var(--glass-border)] shadow-xl">
      <CardHeader className="!mb-4">
        <div>
          <CardTitle className="text-lg font-bold font-display flex items-center gap-2">
            <KeyRound size={18} className="text-emerald-400" />
            ATS Keyword Coverage
          </CardTitle>
          <CardDescription className="mt-1">
            Exact term match analysis against targeted job descriptions
          </CardDescription>
        </div>
      </CardHeader>

      {/* Match-rate Hero Panel */}
      <div className="relative rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 mb-6 overflow-hidden backdrop-blur-md">
        <div className="relative flex items-center justify-between gap-4">
          <div>
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--ink-muted)]">
              ATS Keyword Density
            </div>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="font-display tabular-nums text-4xl font-extrabold text-gradient-emerald">
                {present.length}
              </span>
              <span className="text-[var(--ink-muted)] text-sm font-semibold">
                / {total} matched terms
              </span>
            </div>
          </div>

          <div className="text-right">
            <div className="font-display tabular-nums text-3xl font-extrabold text-emerald-400">
              {pct}%
            </div>
            <div className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--ink-muted)] mt-1">
              Match Ratio
            </div>
          </div>
        </div>

        <div className="relative mt-4 h-2 w-full rounded-full bg-slate-900 overflow-hidden border border-white/5">
          <div
            className="h-full rounded-full bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 transition-all duration-700 ease-out shadow-md"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>

      <div className="space-y-6">
        <div>
          <SectionHeader tone="present" label="Verified Present" count={present.length} />
          {present.length ? (
            <div className="flex flex-wrap gap-2">
              {present.map((k) => (
                <Chip key={k} tone="present">
                  {k}
                </Chip>
              ))}
            </div>
          ) : (
            <p className="text-xs text-[var(--ink-muted)] pl-10 italic">No keywords detected yet.</p>
          )}
        </div>

        <div>
          <SectionHeader tone="missing" label="Missing & Recommended" count={missing.length} />
          {missing.length ? (
            <div className="flex flex-wrap gap-2">
              {missing.map((k) => (
                <Chip key={k} tone="missing">
                  {k}
                </Chip>
              ))}
            </div>
          ) : (
            <p className="text-xs text-emerald-400 pl-10 font-bold flex items-center gap-1">
              <Sparkles size={14} />
              Outstanding! Your resume covers all critical ATS target keywords.
            </p>
          )}
        </div>
      </div>
    </Card>
  );
}
