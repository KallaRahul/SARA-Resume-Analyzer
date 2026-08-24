import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Menu, X, ArrowRight, Sun, Moon } from "lucide-react";
import { BrandLogo } from "@/components/layout/AILogo";
import { useTheme } from "@/context/ThemeContext";
import { cn } from "@/lib/utils";

const NAV_LINKS = [
  { label: "Features", href: "#features" },
  { label: "How It Works", href: "#how-it-works" },
  { label: "Preview", href: "#dashboard-preview" },
  { label: "Impact", href: "#benefits" },
  { label: "Testimonials", href: "#testimonials" },
];

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const { theme, toggle } = useTheme();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -16, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
      className="fixed top-4 inset-x-0 z-50 px-4 sm:px-8"
    >
      <div
        style={{ maxWidth: 1280 }}
        className={cn(
          "mx-auto rounded-2xl border transition-all duration-300",
          scrolled
            ? "glass-panel bg-[var(--surface)]/85 border-[var(--border)] backdrop-blur-xl shadow-2xl"
            : "glass-panel bg-[var(--surface)]/60 border-white/10 backdrop-blur-md"
        )}
      >
        <div className="flex items-center justify-between gap-4 px-4 sm:px-6 py-3">
          <Link to="/" className="flex items-center gap-2">
            <BrandLogo showText={true} size="md" />
          </Link>

          <nav className="hidden lg:flex items-center gap-1.5 absolute left-1/2 -translate-x-1/2">
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="px-4 py-2 rounded-xl text-xs font-bold text-[var(--ink-muted)] hover:text-emerald-400 hover:bg-emerald-500/10 transition-all uppercase tracking-wider"
              >
                {l.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <button
              onClick={toggle}
              title={`Switch to ${theme === "light" ? "dark" : "light"} mode`}
              className="h-10 w-10 rounded-xl glass-panel border border-[var(--border)] text-emerald-400 flex items-center justify-center hover:bg-emerald-500/10 transition-colors"
            >
              {theme === "light" ? <Moon size={16} /> : <Sun size={16} className="text-amber-400" />}
            </button>

            <Link
              to="/login"
              className="hidden sm:inline-flex h-10 px-5 rounded-xl text-xs font-extrabold text-[var(--ink)] hover:text-emerald-400 hover:bg-white/5 items-center transition-colors uppercase tracking-wider"
            >
              Sign In
            </Link>

            <Link
              to="/dashboard"
              className="group inline-flex items-center gap-2 h-10 px-5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 font-bold text-xs shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all btn-shine uppercase tracking-wider"
            >
              Launch App
              <ArrowRight
                size={14}
                className="group-hover:translate-x-1 transition-transform"
              />
            </Link>

            <button
              onClick={() => setOpen((o) => !o)}
              className="lg:hidden h-10 w-10 rounded-xl glass-panel flex items-center justify-center text-[var(--ink)]"
              aria-label="Toggle menu"
            >
              {open ? <X size={18} /> : <Menu size={18} />}
            </button>
          </div>
        </div>

        {/* Mobile menu */}
        {open && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            className="lg:hidden border-t border-[var(--border)] p-4 space-y-2"
          >
            {NAV_LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-bold text-[var(--ink)] hover:bg-emerald-500/10 hover:text-emerald-400"
              >
                {l.label}
              </a>
            ))}
            <div className="pt-2 border-t border-[var(--border)] flex flex-col gap-2">
              <Link
                to="/login"
                onClick={() => setOpen(false)}
                className="block px-4 py-2.5 rounded-xl text-sm font-bold text-[var(--ink)] hover:bg-white/5 text-center"
              >
                Sign In
              </Link>
            </div>
          </motion.div>
        )}
      </div>
    </motion.header>
  );
}
