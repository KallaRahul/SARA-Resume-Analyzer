import { motion } from "framer-motion";
import {
  PhoneCall,
  ShieldCheck,
  Zap,
  Search,
  Sparkles,
  TrendingUp,
  Award,
} from "lucide-react";
import { SectionHeader } from "./FeaturesSection";

const BENEFITS = [
  {
    icon: PhoneCall,
    title: "3.4× Higher Callback Rate",
    metric: "+85%",
    desc: "Candidates using SARA report receiving recruiter screening calls within 48 hours.",
  },
  {
    icon: ShieldCheck,
    title: "100% ATS Compliant Parsing",
    metric: "99.2%",
    desc: "Guaranteed error-free layout parsing across Workday, Greenhouse, Lever, and Taleo.",
  },
  {
    icon: Sparkles,
    title: "Quantified Impact Bullets",
    metric: "AI 2.0",
    desc: "Bullets transformed from passive duty descriptions to metric-backed outcome statements.",
  },
  {
    icon: Zap,
    title: "Instant Job Description Matching",
    metric: "< 60s",
    desc: "Match your resume against any job posting in under 60 seconds and fill critical keyword gaps.",
  },
  {
    icon: TrendingUp,
    title: "Proven Salary Boost",
    metric: "+$32k",
    desc: "Higher ATS rank puts candidates into tier-1 interview pipelines with top market offers.",
  },
];

export function BenefitsSection() {
  return (
    <section
      id="benefits"
      className="px-4 sm:px-8 mt-28 sm:mt-36"
      style={{ maxWidth: 1280, marginLeft: "auto", marginRight: "auto" }}
    >
      <SectionHeader
        eyebrow="Proven Impact"
        title={<>The goal isn't just a better resume. <span className="text-gradient-emerald">It's a top-tier job offer.</span></>}
        sub="Quantified outcomes reported by candidates after using SARA for their target roles."
      />

      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-6">
        {BENEFITS.map((b, i) => (
          <motion.div
            key={b.title}
            initial={{ opacity: 0, y: 18 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: i * 0.06 }}
            className={`glass-card p-7 border border-[var(--glass-border)] shadow-xl relative overflow-hidden group flex flex-col justify-between ${
              i === 0 ? "lg:col-span-3" : i === 1 ? "lg:col-span-3" : "lg:col-span-2"
            }`}
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="h-11 w-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
                  <b.icon size={20} strokeWidth={2.2} />
                </div>
                <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 text-xs font-extrabold border border-emerald-500/30 font-mono">
                  {b.metric}
                </span>
              </div>
              <h3 className="font-display text-xl font-extrabold tracking-tight text-[var(--ink)]">
                {b.title}
              </h3>
              <p className="text-xs text-[var(--ink-muted)] mt-2 leading-relaxed">
                {b.desc}
              </p>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
