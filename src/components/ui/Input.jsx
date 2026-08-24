import { forwardRef } from "react";
import { cn } from "@/lib/utils";

export const Input = forwardRef(({ className, type = "text", ...props }, ref) => (
  <input
    ref={ref}
    type={type}
    className={cn(
      "h-11 w-full rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 text-sm text-[var(--ink)] placeholder:text-[var(--ink-muted)] outline-none transition-all duration-200 focus:border-emerald-500/50 focus:ring-4 focus:ring-emerald-500/10 disabled:opacity-50 shadow-sm",
      className
    )}
    {...props}
  />
));
Input.displayName = "Input";

export const SearchInput = forwardRef(
  ({ className, leftIcon, rightSlot, ...props }, ref) => (
    <div
      className={cn(
        "group flex items-center gap-3 h-11 rounded-xl bg-[var(--surface)] border border-[var(--border)] pl-4 pr-2 shadow-sm transition-all duration-200 focus-within:border-emerald-500/50 focus-within:ring-4 focus-within:ring-emerald-500/10",
        className
      )}
    >
      {leftIcon && (
        <span className="text-[var(--ink-muted)] shrink-0 transition-colors group-focus-within:text-emerald-400">{leftIcon}</span>
      )}
      <input
        ref={ref}
        type="text"
        className="flex-1 bg-transparent text-sm text-[var(--ink)] placeholder:text-[var(--ink-muted)] outline-none"
        {...props}
      />
      {rightSlot}
    </div>
  )
);
SearchInput.displayName = "SearchInput";
