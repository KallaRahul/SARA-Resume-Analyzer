import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 font-medium whitespace-nowrap transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--accent)]/50 focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] disabled:opacity-50 disabled:pointer-events-none select-none cursor-pointer active:scale-[0.97]",
  {
    variants: {
      variant: {
        primary:
          "bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-semibold shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 btn-shine",
        accent:
          "bg-gradient-to-r from-emerald-500 via-teal-500 to-cyan-500 hover:from-emerald-400 hover:to-cyan-400 text-slate-950 font-semibold shadow-xl shadow-emerald-500/25 hover:shadow-emerald-500/40 btn-shine",
        dark:
          "bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700/80 shadow-md",
        glass:
          "glass-panel text-[var(--ink)] hover:bg-emerald-500/10 hover:border-emerald-500/40 shadow-sm",
        outline:
          "bg-transparent border border-[var(--border)] text-[var(--ink)] hover:border-emerald-500/40 hover:bg-emerald-500/5 hover:text-emerald-500",
        ghost:
          "bg-transparent text-[var(--ink-muted)] hover:text-[var(--ink)] hover:bg-white/5",
        soft:
          "bg-emerald-500/10 text-emerald-500 hover:bg-emerald-500/20 font-medium",
        danger:
          "bg-rose-500/10 text-rose-500 hover:bg-rose-500/20 border border-rose-500/20",
      },
      size: {
        sm: "h-8 px-3 text-xs rounded-xl",
        md: "h-10 px-4 text-sm rounded-xl",
        lg: "h-12 px-6 text-base rounded-2xl font-semibold",
        xl: "h-14 px-8 text-lg rounded-2xl font-bold tracking-wide",
        icon: "h-10 w-10 rounded-xl",
        iconSm: "h-8 w-8 rounded-lg",
      },
    },
    defaultVariants: { variant: "accent", size: "md" },
  }
);

export const Button = forwardRef(
  ({ className, variant, size, ...props }, ref) => (
    <button
      ref={ref}
      className={cn(buttonVariants({ variant, size }), className)}
      {...props}
    />
  )
);
Button.displayName = "Button";

export { buttonVariants };
