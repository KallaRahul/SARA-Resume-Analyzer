import { useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Layers, FileText, PenLine, ChevronRight, Search, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card } from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { SearchInput } from "@/components/ui/Input";
import { cn, relativeTime } from "@/lib/utils";
import { useAllVersions } from "@/hooks/useAnalytics";

const FILTERS = [
  { key: "all", label: "All Versions" },
  { key: "upload", label: "Uploaded PDFs" },
  { key: "rewrite", label: "AI Rewrites" },
];

export default function Versions() {
  const nav = useNavigate();
  const { data, isLoading, error } = useAllVersions();
  const [filter, setFilter] = useState("all");
  const [query, setQuery] = useState("");

  const versions = data?.versions || [];
  const totals = data?.totals || { all: 0, uploads: 0, rewrites: 0 };

  const filtered = useMemo(() => {
    let v = versions;
    if (filter === "upload") v = v.filter((x) => x.sourceType === "upload");
    if (filter === "rewrite") v = v.filter((x) => x.sourceType === "rewrite");
    if (query.trim()) {
      const q = query.toLowerCase();
      v = v.filter(
        (x) =>
          x.resumeTitle?.toLowerCase().includes(q) ||
          x.label?.toLowerCase().includes(q)
      );
    }
    return v;
  }, [versions, filter, query]);

  if (isLoading) return <VersionsSkeleton />;

  if (error) {
    return (
      <EmptyState
        icon={Layers}
        title="Couldn't load version history"
        description={error.message}
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title="Document Versions"
        description="Full audit history of every uploaded resume and AI rewrite iteration."
      />

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
        <TotalCard label="Total Iterations" value={totals.all} icon={Layers} />
        <TotalCard label="Uploaded PDFs" value={totals.uploads} icon={FileText} />
        <TotalCard label="AI Rewrites Created" value={totals.rewrites} icon={PenLine} accent />
      </div>

      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="inline-flex items-center gap-1 bg-white/5 border border-white/10 p-1.5 rounded-2xl backdrop-blur-md">
          {FILTERS.map((f) => (
            <button
              key={f.key}
              onClick={() => setFilter(f.key)}
              className={cn(
                "h-8 px-4 text-xs font-bold rounded-xl transition-all",
                filter === f.key
                  ? "bg-gradient-to-r from-emerald-400 to-teal-400 text-slate-950 shadow-md"
                  : "text-[var(--ink-muted)] hover:text-[var(--ink)]"
              )}
            >
              {f.label}
            </button>
          ))}
        </div>

        <SearchInput
          className="w-full sm:w-[320px]"
          placeholder="Filter by title or version code..."
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          leftIcon={<Search size={16} />}
        />
      </div>

      {filtered.length === 0 ? (
        <EmptyState
          icon={Layers}
          title="No matching versions found"
          description={
            versions.length === 0
              ? "Upload a resume PDF to start building version history."
              : "Try adjusting your search query or filter tags."
          }
        />
      ) : (
        <div className="space-y-3.5">
          {filtered.map((v) => (
            <VersionRow
              key={v.id}
              version={v}
              onClick={() => nav(`/resumes/${v.resumeId}`)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function VersionRow({ version, onClick }) {
  const isUpload = version.sourceType === "upload";
  return (
    <Card onClick={onClick} className="glass-card p-5 border border-[var(--glass-border)] shadow-xl cursor-pointer flex items-center gap-4 hover:border-emerald-500/40 transition-all">
      <div
        className={cn(
          "h-11 w-11 rounded-xl flex items-center justify-center shrink-0 border",
          isUpload
            ? "bg-slate-800/60 border-slate-700/60 text-slate-400"
            : "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
        )}
      >
        {isUpload ? <FileText size={18} /> : <Sparkles size={18} />}
      </div>

      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="font-display text-base font-bold text-[var(--ink)]">
            {version.label}
          </span>
          <span className="text-[var(--ink-muted)] text-xs font-semibold truncate">
            {version.resumeTitle}
          </span>
        </div>
        <div className="text-xs text-[var(--ink-muted)] mt-0.5 font-medium">
          {isUpload ? "Uploaded PDF" : "AI Bullet Rewrite"} • {relativeTime(version.createdAt)}
        </div>
      </div>

      {version.score != null ? (
        <div className="text-right shrink-0">
          <div className="font-display tabular text-xl font-extrabold text-[var(--ink)] text-gradient-emerald">
            {version.score}
          </div>
          <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-[var(--ink-muted)]">
            ATS Score
          </div>
        </div>
      ) : (
        <Badge tone="neutral" className="font-mono text-xs">Unscored</Badge>
      )}

      <Badge tone={isUpload ? "neutral" : "accent"} className="capitalize font-bold text-xs font-mono">
        {version.sourceType}
      </Badge>

      <ChevronRight size={18} className="text-emerald-400" />
    </Card>
  );
}

function TotalCard({ label, value, icon: Icon, accent }) {
  return (
    <Card variant={accent ? "glow" : "default"} className="glass-card p-6 border border-[var(--glass-border)] shadow-xl relative overflow-hidden">
      <div className="flex items-center gap-3.5">
        <div className="h-10 w-10 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0">
          <Icon size={18} />
        </div>
        <div className="flex-1">
          <div className="text-xs font-bold uppercase tracking-wider text-[var(--ink-muted)]">
            {label}
          </div>
          <div className="font-display tabular text-2xl font-extrabold text-[var(--ink)] mt-0.5">
            {value}
          </div>
        </div>
      </div>
    </Card>
  );
}

function VersionsSkeleton() {
  return (
    <div className="space-y-6">
      <Skeleton className="h-10 w-1/3 rounded-2xl" />
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <Skeleton key={i} className="h-[80px] rounded-2xl" />
        ))}
      </div>
      {Array.from({ length: 5 }).map((_, i) => (
        <Skeleton key={i} className="h-[80px] rounded-2xl" />
      ))}
    </div>
  );
}
