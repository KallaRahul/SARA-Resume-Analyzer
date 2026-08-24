import { Search, Sun, Moon, Sparkles } from "lucide-react";
import { IconButton } from "@/components/ui/IconButton";
import { useTheme } from "@/context/ThemeContext";
import { useAuth } from "@/context/AuthContext";
import { NotificationsPopover } from "./NotificationsPopover";

export function Topbar({ onOpenPalette }) {
  const { theme, toggle } = useTheme();
  const { user } = useAuth();
  const firstName = user?.name?.split(" ")[0] || "Candidate";

  const isMac =
    typeof navigator !== "undefined" && /Mac|iPhone|iPad/i.test(navigator.platform);

  return (
    <header className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 mb-8 pt-2">
      <div>
        <div className="flex items-center gap-2">
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-extrabold uppercase tracking-wider bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 flex items-center gap-1">
            <Sparkles size={12} className="animate-spin" style={{ animationDuration: "6s" }} />
            AI Resume Intelligence Engine
          </span>
        </div>
        <h1 className="font-display text-2xl sm:text-3xl font-extrabold leading-tight text-[var(--ink)] mt-1.5 flex items-center gap-2">
          Welcome back, <span className="text-gradient-emerald">{firstName}</span> 👋
        </h1>
        <p className="text-xs sm:text-sm text-[var(--ink-muted)] mt-0.5">
          Optimize your ATS compliance score and land top tech interviews 3x faster.
        </p>
      </div>

      <div className="flex items-center gap-3 shrink-0 w-full sm:w-auto">
        <button
          type="button"
          onClick={onOpenPalette}
          className="flex-1 sm:flex-none flex items-center gap-3 h-11 w-full sm:w-[320px] lg:w-[380px] rounded-xl glass-panel px-4 shadow-sm hover:border-emerald-500/40 hover:shadow-emerald-500/10 transition-all text-left group cursor-pointer"
        >
          <Search size={16} className="text-[var(--ink-muted)] group-hover:text-emerald-400 transition-colors shrink-0" />
          <span className="flex-1 text-xs sm:text-sm text-[var(--ink-muted)] group-hover:text-[var(--ink)] truncate transition-colors">
            Search resumes, skills, rewrites...
          </span>
          <kbd className="inline-flex items-center gap-0.5 text-[10px] px-2 h-6 rounded-md bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-mono font-bold">
            {isMac ? "⌘" : "Ctrl"} K
          </kbd>
        </button>

        <IconButton
          onClick={toggle}
          title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
          className="rounded-xl border border-[var(--border)] bg-[var(--surface)] text-emerald-400 hover:bg-emerald-500/10 hover:border-emerald-500/30"
        >
          {theme === "light" ? <Moon size={18} /> : <Sun size={18} className="text-amber-400" />}
        </IconButton>

        <NotificationsPopover />
      </div>
    </header>
  );
}
