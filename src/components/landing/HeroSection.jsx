import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, Play, Sparkles, ShieldCheck, CheckCircle2, Star } from "lucide-react";
import { HeroDashboardPreview } from "./HeroDashboardPreview";

export function HeroSection() {
  return (
    <section className="relative w-full overflow-hidden pt-36 sm:pt-40 pb-20 lg:pb-32 bg-slate-950 text-white rounded-b-[40px] sm:rounded-b-[60px] border-b border-emerald-500/20 shadow-2xl">
      {/* Background ambient lighting */}
      <div className="bg-ambient-glow -top-24 left-1/2 -translate-x-1/2 w-[900px] h-[600px] bg-emerald-500/15" />
      <div className="bg-ambient-glow top-[20%] right-[-10%] w-[500px] h-[500px] bg-cyan-500/10" />
      <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

      <div
        className="relative z-10 grid grid-cols-1 lg:grid-cols-[1.1fr_1fr] gap-12 lg:gap-12 items-center px-6 sm:px-10 lg:px-16"
        style={{ maxWidth: 1360, marginLeft: "auto", marginRight: "auto" }}
      >
        {/* Left Copy Column */}
        <div>
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 backdrop-blur-xl shadow-lg shadow-emerald-500/10"
          >
            <Sparkles size={14} className="text-emerald-400 animate-spin" style={{ animationDuration: "5s" }} />
            <span className="text-xs uppercase tracking-widest text-emerald-300 font-extrabold">
              AI ATS Scoring Engine 2.0
            </span>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08 }}
            className="font-display text-[44px] sm:text-[64px] lg:text-[76px] font-extrabold leading-[1.02] tracking-tight mt-6"
          >
            Outsmart the ATS.
            <br />
            <span className="text-gradient-emerald">Land 3x More</span>{" "}
            <span className="text-slate-100">Interviews.</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16 }}
            className="text-slate-300 text-base sm:text-lg lg:text-xl mt-6 max-w-[560px] leading-relaxed font-normal"
          >
            Upload your resume to get instant recruiter-level feedback, deep ATS keyword matching, and AI-engineered bullet rewrites that highlight your true impact.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24 }}
            className="flex flex-wrap items-center gap-4 mt-9"
          >
            <Link
              to="/dashboard"
              className="group relative inline-flex items-center gap-3 h-14 px-8 rounded-2xl font-extrabold text-base text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all btn-shine"
            >
              Analyze Your Resume Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <a
              href="#how-it-works"
              className="inline-flex items-center gap-2.5 h-14 px-6 rounded-2xl font-bold text-sm text-slate-200 glass-panel border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all"
            >
              <Play size={14} className="text-emerald-400 fill-emerald-400" />
              Watch Live Demo
            </a>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.35 }}
            className="flex flex-wrap items-center gap-x-6 gap-y-2 mt-9 text-xs text-slate-400 font-medium"
          >
            <span className="inline-flex items-center gap-2 text-slate-300 font-semibold">
              <ShieldCheck size={16} className="text-emerald-400" />
              No Credit Card Required
            </span>
            <span className="inline-flex items-center gap-2">
              <CheckCircle2 size={16} className="text-emerald-400" />
              Instant Score Report
            </span>
            <span className="inline-flex items-center gap-2 text-amber-400 font-bold">
              <Star size={16} className="fill-amber-400 text-amber-400" />
              4.9/5 Candidate Rating
            </span>
          </motion.div>
        </div>

        {/* Right Interactive Hero Preview Card */}
        <div className="relative">
          <HeroDashboardPreview />
        </div>
      </div>
    </section>
  );
}
