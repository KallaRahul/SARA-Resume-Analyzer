import { useCallback, useEffect, useState } from "react";
import { Outlet, useLocation } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";
import { Sidebar } from "./Sidebar";
import { Topbar } from "./Topbar";
import { CommandPalette } from "./CommandPalette";

export function AppShell() {
  const location = useLocation();
  const [paletteOpen, setPaletteOpen] = useState(false);

  const openPalette = useCallback(() => setPaletteOpen(true), []);
  const closePalette = useCallback(() => setPaletteOpen(false), []);

  useEffect(() => {
    window.scrollTo({ top: 0, left: 0, behavior: "instant" });
  }, [location.pathname]);

  useEffect(() => {
    function onKey(e) {
      const isK = e.key === "k" || e.key === "K";
      if (isK && (e.metaKey || e.ctrlKey)) {
        e.preventDefault();
        setPaletteOpen((v) => !v);
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  useEffect(() => {
    setPaletteOpen(false);
  }, [location.pathname]);

  return (
    <div className="min-h-screen flex bg-[var(--bg)] relative overflow-x-hidden">
      {/* Background ambient lighting blobs */}
      <div className="bg-ambient-glow top-0 right-[15%] w-[600px] h-[600px] bg-emerald-500/10 pointer-events-none" />
      <div className="bg-ambient-glow bottom-[20%] left-[10%] w-[500px] h-[500px] bg-cyan-500/10 pointer-events-none" />
      <div className="absolute inset-0 bg-grid-pattern opacity-40 pointer-events-none z-0" />

      <div className="relative z-10 flex w-full">
        <Sidebar />
        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 max-w-[1600px] mx-auto w-full min-w-0">
          <Topbar onOpenPalette={openPalette} />
          <AnimatePresence mode="wait">
            <motion.div
              key={location.pathname}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
            >
              <Outlet />
            </motion.div>
          </AnimatePresence>
        </main>
      </div>

      <CommandPalette open={paletteOpen} onClose={closePalette} />
    </div>
  );
}
