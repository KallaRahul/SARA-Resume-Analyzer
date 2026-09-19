import { useState, useMemo, useEffect } from "react";
import { ArrowRight, Loader2, Sparkles, Wand2, Info, Copy, Check } from "lucide-react";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Checkbox } from "@/components/ui/Checkbox";
import { useToast } from "@/context/UIContext";
import { cn } from "@/lib/utils";

function GradientNumber({ value, size = 32 }) {
  return (
    <span
      className="font-display tabular-nums font-extrabold leading-none tracking-tight text-gradient-emerald"
      style={{ fontSize: size }}
    >
      {value}
    </span>
  );
}

export function BulletRewrites({ rewrites = [], onApply, isApplying, error }) {
  const toast = useToast();
  const ids = useMemo(() => rewrites.map((r) => r._id).filter(Boolean), [rewrites]);
  const [selected, setSelected] = useState(() => new Set(ids));
  const [copiedId, setCopiedId] = useState(null);

  // Keep selection synchronized when rewrites change
  useEffect(() => {
    setSelected(new Set(ids));
  }, [ids]);

  const allSelected = selected.size === ids.length && ids.length > 0;
  const someSelected = selected.size > 0;

  function toggle(id) {
    setSelected((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  }

  function toggleAll() {
    setSelected(allSelected ? new Set() : new Set(ids));
  }

  function applySelected() {
    onApply?.(Array.from(selected));
  }

  function applyAll() {
    onApply?.(ids);
  }

  function handleCopy(id, text) {
    if (navigator?.clipboard) {
      navigator.clipboard.writeText(text);
      setCopiedId(id);
      toast?.success("Copied to clipboard", "Impact bullet rewrite copied");
      setTimeout(() => setCopiedId(null), 2000);
    }
  }

  if (!rewrites?.length) {
    return (
      <Card className="glass-card p-6 border border-[var(--glass-border)] shadow-xl">
        <CardHeader>
          <div>
            <CardTitle className="text-base font-bold font-display">Suggested Bullet Rewrites</CardTitle>
            <CardDescription className="mt-1">No AI rewrites needed for this section.</CardDescription>
          </div>
        </CardHeader>
      </Card>
    );
  }

  return (
    <Card className="glass-card p-6 border border-[var(--glass-border)] shadow-xl">
      <CardHeader className="!mb-4">
        <div>
          <CardTitle className="text-lg font-bold font-display flex items-center gap-2">
            <Sparkles size={18} className="text-emerald-400" />
            Impact Bullet Rewriter
          </CardTitle>
          <CardDescription className="mt-1">
            Transform standard bullet points into metric-backed outcome statements
          </CardDescription>
        </div>
      </CardHeader>

      {/* Hero Action Header */}
      <div className="relative rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-5 mb-6 overflow-hidden backdrop-blur-md">
        <div className="relative flex items-center justify-between gap-6 flex-wrap">
          <div className="flex items-center gap-6">
            <div>
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--ink-muted)]">
                Generated Rewrites
              </div>
              <div className="flex items-baseline gap-1.5 mt-1">
                <GradientNumber value={rewrites.length} size={36} />
                <span className="text-xs text-[var(--ink-muted)] font-medium">
                  bullets
                </span>
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div>
              <div className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--ink-muted)]">
                Selected Bullets
              </div>
              <div className="flex items-baseline gap-1 mt-1">
                <span className="font-display tabular-nums text-2xl font-extrabold text-[var(--ink)]">
                  {selected.size}
                </span>
                <span className="text-[var(--ink-muted)] text-xs font-medium">
                  / {rewrites.length}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3 flex-wrap">
            <Button variant="glass" size="sm" onClick={toggleAll} className="text-xs font-bold">
              {allSelected ? "Deselect All" : "Select All"}
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={applySelected}
              disabled={!someSelected || isApplying}
              className="text-xs font-bold"
            >
              {isApplying ? (
                <Loader2 size={14} className="animate-spin" />
              ) : (
                <Sparkles size={14} />
              )}
              Apply Selected ({selected.size})
            </Button>

            <Button
              variant="accent"
              size="sm"
              onClick={applyAll}
              disabled={isApplying}
              className="font-bold text-xs shadow-lg shadow-emerald-500/20 btn-shine"
            >
              <Wand2 size={14} />
              Apply All & Create Version
            </Button>
          </div>
        </div>
      </div>

      <div className="space-y-4">
        {rewrites.map((r, i) => {
          const id = r._id || `idx-${i}`;
          const isSelected = selected.has(id);
          return (
            <div
              key={id}
              onClick={() => toggle(id)}
              className={cn(
                "group relative rounded-2xl border p-5 transition-all duration-200 cursor-pointer select-none",
                isSelected
                  ? "border-emerald-500/50 bg-emerald-500/10 shadow-lg"
                  : "border-[var(--glass-border)] bg-slate-900/40 hover:bg-slate-900/60"
              )}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <GradientNumber value={String(i + 1).padStart(2, "0")} size={22} />
                  {r.section && (
                    <span className="inline-flex items-center h-6 px-3 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[11px] font-bold font-mono uppercase tracking-wider">
                      {r.section}
                    </span>
                  )}
                </div>
                <div className="flex items-center gap-2">
                  <span
                    className={cn(
                      "text-xs font-bold transition-colors",
                      isSelected ? "text-emerald-400" : "text-[var(--ink-muted)]"
                    )}
                  >
                    {isSelected ? "Selected for merge" : "Skip"}
                  </span>
                  <Checkbox checked={isSelected} onChange={() => toggle(id)} />
                </div>
              </div>

              {/* Before vs After Grid */}
              <div className="grid grid-cols-1 md:grid-cols-[1fr_40px_1fr] gap-3 items-stretch">
                <div className="relative rounded-xl bg-slate-950/60 p-4 border border-white/5">
                  <div className="flex items-center gap-1.5 mb-2">
                    <span className="h-2 w-2 rounded-full bg-rose-400/60" />
                    <div className="text-[10px] uppercase tracking-wider font-extrabold text-[var(--ink-muted)]">
                      Original Bullet
                    </div>
                  </div>
                  <div className="text-xs text-[var(--ink-muted)] leading-relaxed font-mono">
                    {r.original}
                  </div>
                </div>

                <div className="flex items-center justify-center py-2 md:py-0">
                  <div className="h-9 w-9 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0 shadow-md">
                    <ArrowRight size={16} strokeWidth={2.5} />
                  </div>
                </div>

                <div className="relative rounded-xl p-4 border border-emerald-500/30 bg-emerald-500/10 backdrop-blur-md">
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <div className="flex items-center gap-1.5">
                      <Sparkles size={12} className="text-emerald-400" />
                      <div className="text-[10px] uppercase tracking-wider font-extrabold text-emerald-400">
                        AI Impact Bullet Rewrite
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleCopy(id, r.rewritten);
                      }}
                      className="px-2 py-1 rounded-lg bg-emerald-500/15 text-emerald-400 hover:bg-emerald-500/30 text-[10px] font-bold flex items-center gap-1 transition-colors"
                      title="Copy bullet to clipboard"
                    >
                      {copiedId === id ? <Check size={11} /> : <Copy size={11} />}
                      {copiedId === id ? "Copied!" : "Copy"}
                    </button>
                  </div>
                  <div className="text-xs text-[var(--ink)] leading-relaxed font-semibold">
                    {r.rewritten}
                  </div>
                </div>
              </div>

              {/* Rationale */}
              {r.rationale && (
                <div className="mt-4 flex items-start gap-2.5 rounded-xl bg-white/5 border border-white/5 px-3.5 py-2.5">
                  <span className="h-5 w-5 rounded-md bg-emerald-500/15 text-emerald-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Info size={12} strokeWidth={2.5} />
                  </span>
                  <div className="text-xs text-[var(--ink-muted)] leading-relaxed">
                    <span className="font-bold text-[var(--ink)]">
                      Why recruiters prefer this:{" "}
                    </span>
                    {r.rationale}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {error && (
        <div className="mt-4 text-xs font-semibold text-rose-400 bg-rose-500/15 border border-rose-500/30 rounded-xl p-3">
          {error}
        </div>
      )}
    </Card>
  );
}

