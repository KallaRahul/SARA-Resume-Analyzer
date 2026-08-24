import { motion } from "framer-motion";
import { Upload, Cpu, FileDown, ArrowRight, Check, Sparkles } from "lucide-react";
import { SectionHeader } from "./FeaturesSection";

function UploadVisual() {
  return (
    <div className="relative rounded-2xl bg-slate-950/60 border border-white/10 p-4">
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <div className="h-11 w-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center">
            <Upload size={18} />
          </div>
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="text-xs font-bold text-white truncate">
            senior_engineer_resume.pdf
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5 tabular-nums">
            412 KB · parsing structure & ATS criteria...
          </div>
        </div>
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
          Live
        </div>
      </div>
      <div className="mt-3 h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
        <motion.div
          animate={{ x: ["-100%", "100%"] }}
          transition={{ duration: 1.6, repeat: Infinity, ease: "linear" }}
          className="h-full w-1/2 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-400"
        />
      </div>
    </div>
  );
}

function AnalyzeVisual() {
  const items = [
    { label: "Parsing sections & experience", done: true },
    { label: "Matching target job keywords", done: true },
    { label: "Generating AI bullet rewrites...", done: false },
  ];
  return (
    <div className="relative rounded-2xl bg-slate-950/60 border border-white/10 p-4">
      <div className="flex items-center gap-2 mb-3">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
          className="h-4 w-4 rounded-full border-2 border-emerald-400 border-r-transparent"
        />
        <div className="text-xs font-bold text-white">
          AI Analysis in Progress
        </div>
        <div className="ml-auto inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-slate-800 text-slate-300 text-[10px] font-bold">
          12 / 12 Rules
        </div>
      </div>
      <div className="space-y-1.5">
        {items.map((item, i) => (
          <motion.div
            key={item.label}
            initial={{ opacity: 0, x: -6 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.4, delay: 0.2 + i * 0.1 }}
            className="flex items-center gap-2"
          >
            <div
              className={`h-4 w-4 rounded-full flex items-center justify-center ${
                item.done
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "border border-slate-700"
              }`}
            >
              {item.done && <Check size={10} strokeWidth={3} />}
            </div>
            <div className="text-xs text-slate-300">
              {item.label}
            </div>
          </motion.div>
        ))}
      </div>
      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
        <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
          Predicted ATS Score
        </div>
        <div className="inline-flex items-center gap-1 text-xs font-extrabold text-emerald-400 tabular-nums">
          <Sparkles size={12} />
          94 / 100
        </div>
      </div>
    </div>
  );
}

function DownloadVisual() {
  return (
    <div className="relative rounded-2xl bg-slate-950/60 border border-white/10 p-4">
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <div className="h-12 w-10 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex flex-col gap-1 p-1.5">
            <div className="h-[2px] w-3/4 rounded bg-emerald-400" />
            <div className="h-[2px] w-full rounded bg-slate-400" />
            <div className="h-[2px] w-5/6 rounded bg-slate-400" />
          </div>
        </div>
        <div className="flex-1 min-w-0 text-left">
          <div className="text-xs font-bold text-white truncate">
            resume_v3_ats_optimized.pdf
          </div>
          <div className="text-[10px] text-slate-400 mt-0.5">
            100% Greenhouse & Lever Compliant
          </div>
        </div>
        <button className="h-9 w-9 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 text-slate-950 flex items-center justify-center shrink-0 shadow-lg shadow-emerald-500/20">
          <FileDown size={16} />
        </button>
      </div>
      <div className="mt-3 pt-3 border-t border-white/10 flex items-center justify-between">
        <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] font-bold">
          Score Boosted 94%
        </div>
        <div className="text-[10px] text-slate-400">
          Ready to submit
        </div>
      </div>
    </div>
  );
}

const STEPS = [
  {
    n: "01",
    icon: Upload,
    title: "Upload Your Resume",
    desc: "Drag & drop your PDF or DOCX file. Our engine parses sections, skills, and metrics in seconds.",
    Visual: UploadVisual,
  },
  {
    n: "02",
    icon: Cpu,
    title: "AI Audit & Scoring",
    desc: "AI evaluates formatting, keyword match density, and rewrites bullets with quantified outcomes.",
    Visual: AnalyzeVisual,
  },
  {
    n: "03",
    icon: FileDown,
    title: "Export & Apply",
    desc: "Download an ATS-perfect PDF or TXT version and start landing 3x more recruiters in your inbox.",
    Visual: DownloadVisual,
  },
];

export function HowItWorks() {
  return (
    <section
      id="how-it-works"
      className="relative px-4 sm:px-8 mt-28 sm:mt-36"
      style={{ maxWidth: 1280, marginLeft: "auto", marginRight: "auto" }}
    >
      <SectionHeader
        eyebrow="Workflow Engine"
        title={<>From raw resume to <span className="text-gradient-emerald">interview-ready</span> in 3 steps.</>}
        sub="No complex setups. No prompt engineering. Upload, analyze, and land your dream job."
      />

      <div className="mt-16 relative grid grid-cols-1 lg:grid-cols-3 gap-6">
        {STEPS.map((s, i) => {
          const Icon = s.icon;
          const Visual = s.Visual;
          return (
            <motion.div
              key={s.n}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                duration: 0.65,
                delay: i * 0.12,
                ease: [0.16, 1, 0.3, 1],
              }}
              className="group relative"
            >
              <div className="glass-card p-8 border border-[var(--glass-border)] shadow-xl relative overflow-hidden flex flex-col justify-between min-h-[440px]">
                {/* Step pill */}
                <div className="flex items-center justify-between">
                  <span className="px-3 py-1 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-xs font-extrabold uppercase tracking-widest">
                    Step {s.n}
                  </span>
                  <span className="font-display text-4xl font-extrabold text-slate-700/40">
                    #{s.n}
                  </span>
                </div>

                <div className="mt-6">
                  <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-emerald-500 to-teal-500 text-slate-950 font-bold flex items-center justify-center shadow-lg shadow-emerald-500/20 mb-5">
                    <Icon size={24} />
                  </div>
                  <h3 className="font-display text-2xl font-bold tracking-tight text-[var(--ink)]">
                    {s.title}
                  </h3>
                  <p className="text-xs text-[var(--ink-muted)] mt-2 leading-relaxed">
                    {s.desc}
                  </p>
                </div>

                <div className="mt-6">
                  <Visual />
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
