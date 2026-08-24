import { NavLink } from "react-router-dom";
import {
  LayoutGrid,
  FileText,
  BarChart3,
  Layers,
  History,
  Settings,
  LogOut,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAuth } from "@/context/AuthContext";
import { BrandLogo } from "./AILogo";

const NAV = [
  { to: "/dashboard", icon: LayoutGrid, label: "Dashboard" },
  { to: "/resumes", icon: FileText, label: "Resumes" },
  { to: "/insights", icon: BarChart3, label: "Insights" },
  { to: "/versions", icon: Layers, label: "Versions" },
  { to: "/history", icon: History, label: "History" },
];

const ROW_BASE =
  "relative flex items-center h-11 w-11 rounded-xl overflow-hidden " +
  "group-hover/sidebar:w-[204px] " +
  "transition-[width,background-color,color,box-shadow] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]";

const LABEL_BASE =
  "text-sm font-semibold whitespace-nowrap pr-4 " +
  "opacity-0 -translate-x-1 " +
  "transition-[opacity,transform] duration-200 ease-out " +
  "group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 group-hover/sidebar:delay-100";

function NavItem({ to, icon: Icon, label }) {
  return (
    <NavLink to={to} title={label} className="block">
      {({ isActive }) => (
        <div
          className={cn(
            ROW_BASE,
            isActive
              ? "bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-transparent text-emerald-400 border border-emerald-500/30 shadow-md shadow-emerald-500/10 font-bold"
              : "text-[var(--ink-muted)] hover:bg-emerald-500/10 hover:text-[var(--ink)]"
          )}
        >
          <span className="h-11 w-11 flex items-center justify-center shrink-0">
            <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
          </span>
          <span className={LABEL_BASE}>{label}</span>
          {isActive && (
            <span className="absolute left-0 top-2 bottom-2 w-1 bg-emerald-400 rounded-r-full shadow-lg shadow-emerald-400" />
          )}
        </div>
      )}
    </NavLink>
  );
}

function ActionRow({ icon: Icon, label, onClick, to }) {
  const inner = (isActive) => (
    <div
      className={cn(
        ROW_BASE,
        isActive
          ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30"
          : "text-[var(--ink-muted)] hover:bg-emerald-500/10 hover:text-[var(--ink)]"
      )}
    >
      <span className="h-11 w-11 flex items-center justify-center shrink-0">
        <Icon size={18} />
      </span>
      <span className={LABEL_BASE}>{label}</span>
    </div>
  );

  if (to) {
    return (
      <NavLink to={to} title={label} className="block">
        {({ isActive }) => inner(isActive)}
      </NavLink>
    );
  }

  return (
    <button onClick={onClick} title={label} className="block w-full text-left">
      {inner(false)}
    </button>
  );
}

export function Sidebar() {
  const { user, logout } = useAuth();
  const displayName = user?.name || "Candidate";
  const displayEmail = user?.email || "candidate@resumai.pro";

  return (
    <aside
      className={cn(
        "group/sidebar hidden md:flex shrink-0 h-[calc(100vh-32px)] sticky top-4 ml-4 z-40",
        "flex-col items-center justify-between py-6 rounded-3xl",
        "glass-panel border border-[var(--glass-border)] shadow-2xl overflow-hidden",
        "w-[84px] hover:w-[252px]",
        "transition-[width] duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]"
      )}
    >
      <div className="flex flex-col items-center gap-6 w-full px-4">
        {/* Brand Logo Header */}
        <div
          className={cn(
            "flex items-center h-12 w-full overflow-hidden justify-start",
            "transition-all duration-300"
          )}
        >
          <BrandLogo showText={true} size="md" />
        </div>

        {/* Quick AI Scanner Action CTA */}
        <NavLink
          to="/resumes"
          className="w-full"
          title="New Scan"
        >
          <div className="flex items-center h-11 w-11 group-hover/sidebar:w-full rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold overflow-hidden shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/40 transition-all duration-300">
            <span className="h-11 w-11 flex items-center justify-center shrink-0">
              <Sparkles size={18} className="animate-pulse" />
            </span>
            <span className="text-xs uppercase tracking-wider font-extrabold whitespace-nowrap pr-4 opacity-0 group-hover/sidebar:opacity-100 transition-opacity duration-200">
              Scan Resume
            </span>
          </div>
        </NavLink>

        {/* Main Navigation */}
        <nav className="flex flex-col items-center gap-2 w-full">
          {NAV.map((item) => (
            <NavItem key={item.to} {...item} />
          ))}
        </nav>
      </div>

      {/* Footer User Profile & Actions */}
      <div className="flex flex-col items-center gap-2 w-full px-4">
        <ActionRow icon={Settings} label="Settings" to="/settings" />
        <ActionRow icon={LogOut} label="Log out" onClick={logout} />

        <div
          className={cn(
            "flex items-center h-12 mt-2 w-full rounded-xl bg-white/5 border border-white/10 px-1 overflow-hidden",
            "transition-all duration-300"
          )}
        >
          <div className="h-9 w-9 rounded-lg bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 font-bold flex items-center justify-center text-xs shrink-0">
            {user?.name?.[0]?.toUpperCase() || "C"}
          </div>
          <div
            className={cn(
              "ml-3 min-w-0 flex-1 overflow-hidden",
              "opacity-0 -translate-x-1",
              "transition-[opacity,transform] duration-200 ease-out",
              "group-hover/sidebar:opacity-100 group-hover/sidebar:translate-x-0 group-hover/sidebar:delay-100"
            )}
          >
            <div className="text-xs font-bold text-[var(--ink)] truncate">
              {displayName}
            </div>
            <div className="text-[10px] text-emerald-400 truncate flex items-center gap-1 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping inline-block" />
              Pro Candidate
            </div>
          </div>
        </div>
      </div>
    </aside>
  );
}
