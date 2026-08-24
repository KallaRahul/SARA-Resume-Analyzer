import { createContext, useContext } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const TabsCtx = createContext(null);

export function Tabs({ value, onValueChange, children, className }) {
  return (
    <TabsCtx.Provider value={{ value, onValueChange }}>
      <div className={cn("", className)}>{children}</div>
    </TabsCtx.Provider>
  );
}

export function TabsList({ children, className }) {
  return (
    <div
      className={cn(
        "inline-flex items-center gap-1.5 bg-[var(--surface-2)] border border-[var(--border)] p-1.5 rounded-2xl backdrop-blur-md",
        className
      )}
    >
      {children}
    </div>
  );
}

export function TabsTrigger({ value, children, className }) {
  const ctx = useContext(TabsCtx);
  const active = ctx.value === value;
  return (
    <button
      onClick={() => ctx?.onValueChange(value)}
      className={cn(
        "relative px-4 h-9 text-xs font-semibold rounded-xl transition-all duration-200 cursor-pointer select-none",
        active ? "text-emerald-400 font-bold" : "text-[var(--ink-muted)] hover:text-[var(--ink)]",
        className
      )}
    >
      {active && (
        <motion.span
          layoutId="tab-active"
          className="absolute inset-0 rounded-xl bg-emerald-500/15 border border-emerald-500/30 shadow-md shadow-emerald-500/10"
          transition={{ type: "spring", duration: 0.35, bounce: 0.15 }}
        />
      )}
      <span className="relative z-10 flex items-center gap-1.5">{children}</span>
    </button>
  );
}

export function TabsContent({ value, children, className }) {
  const ctx = useContext(TabsCtx);
  if (ctx?.value !== value) return null;
  return (
    <motion.div
      initial={{ opacity: 0, y: 4 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.25 }}
      className={cn("", className)}
    >
      {children}
    </motion.div>
  );
}
