import { motion } from "framer-motion";
import { Star, CheckCircle2 } from "lucide-react";
import { SectionHeader } from "./FeaturesSection";

const TESTIMONIALS = [
  {
    quote:
      "I applied to 60+ positions with 0 replies. After running my resume through SARA, fixing ATS keywords, and updating bullet metrics, I got 4 interview calls in one week!",
    name: "Priya Raman",
    role: "Senior Frontend Lead",
    company: "Stripe",
    initials: "PR",
    scoreChange: "58 → 94",
  },
  {
    quote:
      "The AI bullet rewrites sound genuinely human and metrics-driven. No generic corporate fluff — my ATS match jump-started my search at Vercel.",
    name: "Marcus Chen",
    role: "Backend Architect",
    company: "Vercel",
    initials: "MC",
    scoreChange: "64 → 96",
  },
  {
    quote:
      "As a new CS graduate, I didn't realize ATS scanners were discarding my PDF layout automatically. SARA's export template got me hired at Linear.",
    name: "Sofia Ruiz",
    role: "Software Engineer",
    company: "Linear",
    initials: "SR",
    scoreChange: "52 → 92",
  },
  {
    quote:
      "The keyword gap analysis is unreal. It tells you the exact terms missing for any specific job description before you hit submit.",
    name: "Daniel Park",
    role: "AI / ML Engineer",
    company: "Anthropic",
    initials: "DP",
    scoreChange: "61 → 95",
  },
  {
    quote:
      "The side-by-side diff tracker made it so easy to see my resume evolve. I knew exactly why my ATS score went up.",
    name: "Aisha Hassan",
    role: "Staff Product Designer",
    company: "Figma",
    initials: "AH",
    scoreChange: "68 → 93",
  },
  {
    quote:
      "Ran my resume 2 hours before applying to FAANG. Received recruiter outreach in 36 hours. Best career tool I've used.",
    name: "Jordan Blake",
    role: "Full-Stack Engineer",
    company: "Google",
    initials: "JB",
    scoreChange: "59 → 97",
  },
];

export function TestimonialsSection() {
  return (
    <section
      id="testimonials"
      className="px-4 sm:px-8 mt-28 sm:mt-36"
      style={{ maxWidth: 1280, marginLeft: "auto", marginRight: "auto" }}
    >
      <SectionHeader
        eyebrow="Candidate Proof"
        title={<>Trusted by candidates at <span className="text-gradient-emerald">world-class tech companies.</span></>}
        sub="From new grads to senior engineering leads — hear what candidates say after optimizing."
      />

      <div className="mt-14 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {TESTIMONIALS.map((t, i) => (
          <motion.div
            key={t.name}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
            className="glass-card p-6 border border-[var(--glass-border)] shadow-xl flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex gap-1 text-amber-400">
                  {Array.from({ length: 5 }).map((_, k) => (
                    <Star key={k} size={14} className="fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-[11px] font-extrabold font-mono">
                  ATS Score {t.scoreChange}
                </span>
              </div>
              <p className="text-xs text-[var(--ink)] leading-relaxed font-normal">
                "{t.quote}"
              </p>
            </div>

            <div className="flex items-center gap-3 mt-6 pt-4 border-t border-[var(--border)]">
              <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-500 text-slate-950 font-bold flex items-center justify-center text-xs shrink-0 shadow-md">
                {t.initials}
              </div>
              <div className="min-w-0 flex-1">
                <div className="text-xs font-bold text-[var(--ink)] truncate flex items-center gap-1">
                  {t.name}
                  <CheckCircle2 size={13} className="text-emerald-400 inline shrink-0" />
                </div>
                <div className="text-[11px] text-[var(--ink-muted)] truncate">
                  {t.role} @ <span className="font-bold text-[var(--ink)]">{t.company}</span>
                </div>
              </div>
            </div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}
