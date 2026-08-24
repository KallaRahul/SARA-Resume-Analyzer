import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold tracking-tight transition-all duration-200 backdrop-blur-md select-none",
  {
    variants: {
      tone: {
        neutral: "bg-slate-500/10 text-slate-400 border border-slate-500/20",
        accent: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 shadow-sm shadow-emerald-500/10",
        success: "bg-emerald-500/15 text-emerald-400 border border-emerald-500/30",
        warning: "bg-amber-500/15 text-amber-400 border border-amber-500/30",
        danger: "bg-rose-500/15 text-rose-400 border border-rose-500/30",
        cyan: "bg-cyan-500/15 text-cyan-400 border border-cyan-500/30",
        violet: "bg-violet-500/15 text-violet-400 border border-violet-500/30",
        ink: "bg-slate-900 text-slate-100 border border-slate-700/60",
      },
    },
    defaultVariants: { tone: "neutral" },
  }
);

export function Badge({ className, tone, dot = false, children, ...props }) {
  return (
    <span className={cn(badgeVariants({ tone }), className)} {...props}>
      {dot && (
        <span className="w-1.5 h-1.5 rounded-full bg-current animate-pulse" />
      )}
      {children}
    </span>
  );
}

export { badgeVariants };
