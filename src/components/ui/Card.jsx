import { forwardRef } from "react";
import { cva } from "class-variance-authority";
import { cn } from "@/lib/utils";

const cardVariants = cva(
  "glass-panel transition-all duration-300 relative overflow-hidden",
  {
    variants: {
      variant: {
        default: "glass-card",
        interactive: "glass-card-interactive cursor-pointer",
        accent:
          "bg-gradient-to-br from-emerald-950/90 via-slate-900/90 to-teal-950/90 text-white border border-emerald-500/30 shadow-2xl shadow-emerald-500/10 hover:border-emerald-500/50",
        hero:
          "bg-gradient-to-br from-slate-900/95 via-emerald-950/80 to-slate-950/95 border border-emerald-500/30 shadow-2xl shadow-emerald-900/20 backdrop-blur-2xl",
        flat: "bg-[var(--surface-2)] border border-[var(--border)] rounded-2xl",
        glow: "bg-[var(--glass-bg)] border border-emerald-500/40 shadow-xl shadow-emerald-500/10 hover:shadow-emerald-500/20",
      },
      radius: {
        md: "rounded-2xl",
        lg: "rounded-3xl",
        xl: "rounded-[1.75rem]",
      },
      padding: {
        none: "",
        sm: "p-4",
        md: "p-6",
        lg: "p-8",
      },
    },
    defaultVariants: { variant: "default", radius: "md", padding: "md" },
  }
);

export const Card = forwardRef(
  ({ className, variant, radius, padding, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(cardVariants({ variant, radius, padding }), className)}
      {...props}
    />
  )
);
Card.displayName = "Card";

export const CardHeader = ({ className, ...props }) => (
  <div className={cn("flex items-start justify-between gap-3 mb-4", className)} {...props} />
);

export const CardTitle = ({ className, ...props }) => (
  <h3
    className={cn(
      "text-base font-bold text-[var(--ink)] tracking-tight font-display",
      className
    )}
    {...props}
  />
);

export const CardDescription = ({ className, ...props }) => (
  <p className={cn("text-xs text-[var(--ink-muted)] leading-relaxed mt-0.5", className)} {...props} />
);

export const CardContent = ({ className, ...props }) => (
  <div className={cn("", className)} {...props} />
);

export const CardFooter = ({ className, ...props }) => (
  <div className={cn("mt-4 pt-4 border-t border-[var(--border)] flex items-center justify-between", className)} {...props} />
);
