import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import { ArrowRight, ShieldCheck, Sparkles } from "lucide-react";

export function CTASection() {
  return (
    <section
      className="px-4 sm:px-8 mt-28 sm:mt-36"
      style={{ maxWidth: 1280, marginLeft: "auto", marginRight: "auto" }}
    >
      <div className="relative rounded-[40px] bg-slate-950 border border-emerald-500/30 p-8 sm:p-16 text-center shadow-2xl overflow-hidden">
        {/* Background ambient lighting */}
        <div className="bg-ambient-glow -top-24 left-1/2 -translate-x-1/2 w-[700px] h-[500px] bg-emerald-500/20" />
        <div className="absolute inset-0 bg-grid-pattern opacity-30 pointer-events-none" />

        <div className="relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6 }}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-extrabold uppercase tracking-widest"
          >
            <Sparkles size={14} className="animate-pulse" />
            Instant AI Resume Scoring Engine
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.08 }}
            className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold leading-tight text-white mt-6 max-w-3xl mx-auto"
          >
            Stop guessing what recruiters <span className="text-gradient-emerald">actually see.</span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.14 }}
            className="text-slate-300 text-base sm:text-lg mt-5 max-w-xl mx-auto leading-relaxed"
          >
            Upload your resume now. Get an instant ATS compatibility score, fixable issues, and AI bullet rewrites in seconds.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Link
              to="/dashboard"
              className="group relative inline-flex items-center gap-3 h-14 px-8 rounded-2xl font-extrabold text-base text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 shadow-xl shadow-emerald-500/30 hover:shadow-emerald-500/50 hover:scale-[1.02] active:scale-[0.98] transition-all btn-shine"
            >
              Analyze Your Resume Free
              <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
            </Link>

            <Link
              to="/login"
              className="inline-flex items-center gap-2 h-14 px-7 rounded-2xl font-bold text-sm text-slate-200 glass-panel border border-white/10 hover:border-emerald-500/40 hover:bg-emerald-500/10 transition-all"
            >
              I already have an account
            </Link>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.6, delay: 0.28 }}
            className="mt-8 inline-flex items-center gap-2 text-xs text-slate-400 font-semibold"
          >
            <ShieldCheck size={16} className="text-emerald-400" />
            No credit card required · Free ATS analysis instant output
          </motion.div>
        </div>
      </div>
    </section>
  );
}
