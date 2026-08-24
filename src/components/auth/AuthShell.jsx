import { motion } from "framer-motion";
import { Sparkles } from "lucide-react";
import { BrandCardMarquee } from "./BrandCardMarquee";

export function AuthShell({ children, headline, subhead }) {
  return (
    <div className="min-h-screen flex bg-[var(--bg)] p-3 sm:p-5 gap-0 lg:gap-6 relative overflow-hidden">
      {/* Left Form View */}
      <div className="flex-1 flex items-center justify-center px-6 sm:px-12 py-10 z-10">
        <div className="w-full max-w-[420px]">{children}</div>
      </div>

      {/* Right Brand Panel */}
      <BrandPanel headline={headline} subhead={subhead} />
    </div>
  );
}

function BrandPanel({ headline, subhead }) {
  return (
    <div className="hidden lg:block flex-1 relative rounded-[36px] overflow-hidden isolate border border-emerald-500/20 shadow-2xl bg-slate-950">
      {/* Radiant Emerald Mesh Background */}
      <div className="absolute inset-0 bg-slate-950" />
      <div className="bg-ambient-glow top-0 right-0 w-[600px] h-[600px] bg-emerald-500/25" />
      <div className="bg-ambient-glow bottom-0 left-0 w-[500px] h-[500px] bg-teal-500/20" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      {/* Content Overlay */}
      <div className="relative z-10 h-full flex flex-col justify-between p-12 xl:p-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold uppercase tracking-widest backdrop-blur-md">
            <Sparkles size={14} className="animate-pulse" />
            AI Resume Intelligence Engine
          </div>

          <h2 className="font-display text-4xl xl:text-5xl font-extrabold leading-tight text-white mt-8 max-w-lg">
            {headline}
          </h2>

          <p className="text-slate-300 text-base xl:text-lg mt-6 max-w-md leading-relaxed font-medium">
            {subhead}
          </p>
        </motion.div>

        <div className="pt-8">
          <BrandCardMarquee />
        </div>
      </div>
    </div>
  );
}

export function AuthField({
  label,
  type = "text",
  value,
  onChange,
  placeholder,
  extra,
  autoComplete,
  required = true,
  minLength,
  icon: Icon,
}) {
  return (
    <div>
      <div className="flex items-center justify-between mb-1.5">
        <label className="text-xs font-bold text-[var(--ink)]">{label}</label>
        {extra}
      </div>
      <div className="relative">
        <input
          type={type}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          required={required}
          minLength={minLength}
          className={`peer w-full h-12 ${
            Icon ? "pl-11 pr-4" : "px-4"
          } rounded-2xl border border-[var(--border)] bg-slate-900/60 text-sm text-[var(--ink)] placeholder:text-[var(--ink-muted)]/60 outline-none transition-all duration-200 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 font-medium`}
        />
        {Icon && (
          <div className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-[var(--ink-muted)] peer-focus:text-emerald-400 transition-colors">
            <Icon size={18} strokeWidth={2} />
          </div>
        )}
      </div>
    </div>
  );
}

export function AuthPrimaryButton({ children, disabled, ...props }) {
  return (
    <motion.button
      whileTap={{ scale: 0.98 }}
      disabled={disabled}
      className="relative w-full h-13 rounded-2xl text-slate-950 font-extrabold text-sm flex items-center justify-center gap-2 overflow-hidden bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-[1.01] transition-all disabled:opacity-60 disabled:cursor-not-allowed btn-shine"
      {...props}
    >
      <span className="relative z-10 inline-flex items-center gap-2">
        {children}
      </span>
    </motion.button>
  );
}

export function AuthErrorBanner({ children }) {
  if (!children) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="text-xs font-semibold text-rose-400 bg-rose-500/15 border border-rose-500/30 rounded-2xl px-4 py-3 leading-snug"
    >
      {children}
    </motion.div>
  );
}
