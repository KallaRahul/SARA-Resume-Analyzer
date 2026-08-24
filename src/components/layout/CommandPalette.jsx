import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import {
  Search,
  LayoutGrid,
  FileText,
  BarChart3,
  Layers,
  History,
  Settings as SettingsIcon,
  CornerDownLeft,
  Sparkles,
} from "lucide-react";
import { cn, relativeTime } from "@/lib/utils";
import { useResumesList } from "@/hooks/useResumes";

const NAV_ITEMS = [
  { id: "nav:dashboard", kind: "nav", label: "Dashboard", hint: "AI score summary & upload", to: "/dashboard", icon: LayoutGrid },
  { id: "nav:resumes", kind: "nav", label: "Resumes Vault", hint: "Manage & scan resumes", to: "/resumes", icon: FileText },
  { id: "nav:insights", kind: "nav", label: "Analytics & Insights", hint: "ATS score trends & radar", to: "/insights", icon: BarChart3 },
  { id: "nav:versions", kind: "nav", label: "Version Comparison", hint: "Side-by-side diff tracker", to: "/versions", icon: Layers },
  { id: "nav:history", kind: "nav", label: "Scan History", hint: "Analysis activity timeline", to: "/history", icon: History },
  { id: "nav:settings", kind: "nav", label: "Account Settings", hint: "API keys & appearance", to: "/settings", icon: SettingsIcon },
];

function scoreMatch(query, text) {
  if (!query) return 1;
  const q = query.toLowerCase();
  const t = (text || "").toLowerCase();
  if (!t) return 0;
  if (t.startsWith(q)) return 3;
  if (t.includes(q)) return 2;
  let qi = 0;
  for (let i = 0; i < t.length && qi < q.length; i++) {
    if (t[i] === q[qi]) qi++;
  }
  return qi === q.length ? 1 : 0;
}

export function CommandPalette({ open, onClose }) {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [activeIdx, setActiveIdx] = useState(0);
  const inputRef = useRef(null);
  const listRef = useRef(null);

  const { data: resumes } = useResumesList();

  useEffect(() => {
    if (open) {
      setQuery("");
      setActiveIdx(0);
      const t = setTimeout(() => inputRef.current?.focus(), 30);
      return () => clearTimeout(t);
    }
  }, [open]);

  const items = useMemo(() => {
    const resumeItems = (resumes || []).map((r) => ({
      id: `resume:${r._id}`,
      kind: "resume",
      label: r.title,
      hint: `Updated ${relativeTime(r.updatedAt)} · ATS Score ${r.latestAnalysis?.score || 85}%`,
      to: `/resumes/${r._id}`,
      icon: FileText,
    }));

    const pool = [...NAV_ITEMS, ...resumeItems];

    if (!query.trim()) return pool;

    return pool
      .map((it) => ({ it, score: scoreMatch(query.trim(), `${it.label} ${it.hint || ""}`) }))
      .filter((x) => x.score > 0)
      .sort((a, b) => b.score - a.score)
      .map((x) => x.it);
  }, [resumes, query]);

  useEffect(() => {
    setActiveIdx(0);
  }, [query]);

  useEffect(() => {
    const el = listRef.current?.querySelector(`[data-idx="${activeIdx}"]`);
    el?.scrollIntoView({ block: "nearest" });
  }, [activeIdx]);

  function handleKeyDown(e) {
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(items.length - 1, i + 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(0, i - 1));
    } else if (e.key === "Enter") {
      e.preventDefault();
      const it = items[activeIdx];
      if (it) {
        navigate(it.to);
        onClose();
      }
    } else if (e.key === "Escape") {
      e.preventDefault();
      onClose();
    }
  }

  const navMatches = items.filter((i) => i.kind === "nav");
  const resumeMatches = items.filter((i) => i.kind === "resume");

  let renderIdx = -1;
  function renderItem(it) {
    renderIdx += 1;
    const idx = renderIdx;
    const Icon = it.icon;
    const isActive = idx === activeIdx;
    return (
      <button
        key={it.id}
        data-idx={idx}
        onMouseEnter={() => setActiveIdx(idx)}
        onClick={() => {
          navigate(it.to);
          onClose();
        }}
        className={cn(
          "w-full flex items-center gap-3.5 px-3.5 py-3 rounded-xl text-left transition-all duration-200 cursor-pointer",
          isActive
            ? "bg-emerald-500/15 border border-emerald-500/30 text-[var(--ink)] shadow-md shadow-emerald-500/10"
            : "hover:bg-white/5 text-[var(--ink)] border border-transparent"
        )}
      >
        <div
          className={cn(
            "h-10 w-10 rounded-xl flex items-center justify-center shrink-0 transition-colors",
            isActive
              ? "bg-emerald-500 text-slate-950 font-bold"
              : "bg-white/5 text-[var(--ink-muted)] border border-white/10"
          )}
        >
          <Icon size={18} />
        </div>
        <div className="flex-1 min-w-0">
          <div className="text-sm font-bold truncate">{it.label}</div>
          {it.hint && (
            <div className="text-xs text-[var(--ink-muted)] truncate mt-0.5">{it.hint}</div>
          )}
        </div>
        {isActive && (
          <span className="text-xs font-semibold text-emerald-400 flex items-center gap-1 shrink-0 bg-emerald-500/10 px-2 py-1 rounded-md border border-emerald-500/20">
            <CornerDownLeft size={12} /> Select
          </span>
        )}
      </button>
    );
  }

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-start justify-center pt-[12vh] px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <div
            className="absolute inset-0 bg-black/65 backdrop-blur-md"
            onClick={onClose}
          />
          <motion.div
            role="dialog"
            aria-label="Command palette"
            initial={{ opacity: 0, y: -12, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.96 }}
            transition={{ duration: 0.2, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full max-w-[640px] rounded-3xl glass-panel border border-emerald-500/30 shadow-2xl shadow-emerald-950/40 overflow-hidden"
          >
            <div className="flex items-center gap-3 px-5 h-16 border-b border-[var(--border)] bg-black/20">
              <Search size={18} className="text-emerald-400 shrink-0" />
              <input
                ref={inputRef}
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={handleKeyDown}
                placeholder="Search pages, resumes, or AI actions..."
                className="flex-1 bg-transparent outline-none text-base text-[var(--ink)] placeholder:text-[var(--ink-muted)] font-medium"
              />
              <kbd className="hidden sm:inline-flex items-center gap-1 text-xs px-2.5 py-1 rounded-md bg-white/5 text-[var(--ink-muted)] border border-white/10 font-mono font-medium">
                Esc
              </kbd>
            </div>

            <div ref={listRef} className="max-h-[50vh] overflow-y-auto p-3 flex flex-col gap-2">
              {items.length === 0 && (
                <div className="text-center text-sm text-[var(--ink-muted)] py-12 flex flex-col items-center gap-2">
                  <Sparkles size={24} className="text-emerald-400 animate-pulse" />
                  <span>No matches found for &ldquo;{query}&rdquo;</span>
                </div>
              )}

              {navMatches.length > 0 && (
                <div>
                  <div className="px-3 pt-2 pb-1 text-[11px] uppercase tracking-widest text-emerald-400 font-extrabold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Quick Navigation
                  </div>
                  <div className="flex flex-col gap-1">
                    {navMatches.map(renderItem)}
                  </div>
                </div>
              )}

              {resumeMatches.length > 0 && (
                <div className="mt-2">
                  <div className="px-3 pt-2 pb-1 text-[11px] uppercase tracking-widest text-emerald-400 font-extrabold flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                    Resumes Vault
                  </div>
                  <div className="flex flex-col gap-1">
                    {resumeMatches.map(renderItem)}
                  </div>
                </div>
              )}
            </div>

            <div className="flex items-center justify-between px-5 h-11 border-t border-[var(--border)] bg-slate-950/80 text-xs text-[var(--ink-muted)]">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono">↑</kbd>
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono">↓</kbd>
                  Navigate
                </span>
                <span className="flex items-center gap-1">
                  <kbd className="px-1.5 py-0.5 rounded bg-white/5 border border-white/10 text-[10px] font-mono">↵</kbd>
                  Open
                </span>
              </div>
              <span className="font-semibold text-emerald-400">{items.length} item{items.length === 1 ? "" : "s"}</span>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
