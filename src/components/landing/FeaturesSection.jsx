import { motion } from "framer-motion";
import {
  Gauge,
  Sparkles,
  KeyRound,
  Layers,
  GitCompare,
  LineChart,
  FileDown,
  Zap,
} from "lucide-react";

const FEATURES = [
  {
    icon: Gauge,
    title: "ATS Score Analysis",
    desc: "Multi-point parsing algorithms identical to Workday, Greenhouse, and Lever recruiters.",
    preview: <ScoreBarsPreview />,
    span: "lg:col-span-2",
  },
  {
    icon: Sparkles,
    title: "AI Bullet Rewriter",
    desc: "Transform weak activity statements into high-impact action bullets with quantified metrics.",
    preview: <RewritePreview />,
  },
  {
    icon: KeyRound,
    title: "Keyword Gap Matcher",
    desc: "Auto-scan target job descriptions to reveal missing technical & soft keywords instantly.",
    preview: <KeywordsPreview />,
  },
  {
    icon: Layers,
    title: "Version Stack Tracker",
    desc: "Save every single resume revision with automated score snapshots.",
    preview: <VersionsPreview />,
  },
  {
    icon: GitCompare,
    title: "Side-by-Side Diffing",
    desc: "Compare V1 vs V3 line-by-line with red/green addition highlights.",
    preview: <DiffPreview />,
  },
  {
    icon: LineChart,
    title: "Analytics Dashboard",
    desc: "Track score evolution, keyword alignment radar, and total improvements over time.",
    preview: <ChartPreview />,
    span: "lg:col-span-2",
  },
  {
    icon: FileDown,
    title: "Multi-Format Export",
    desc: "Export clean ATS-optimized PDFs, Markdown, and plain text with customizable styling themes.",
    preview: <PdfPreview />,
  },
];

export function FeaturesSection() {
  return (
    <section
      id="features"
      className="relative px-4 sm:px-8 mt-24 sm:mt-36"
      style={{ maxWidth: 1280, marginLeft: "auto", marginRight: "auto" }}
    >
      <div
        aria-hidden
        className="absolute -top-20 left-1/2 -translate-x-1/2 w-[900px] h-[480px] pointer-events-none -z-10"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(16,185,129,0.15) 0%, rgba(6,182,212,0.05) 35%, transparent 70%)",
          filter: "blur(60px)",
        }}
      />

      <SectionHeader
        eyebrow="AI Intelligence Core"
        title={
          <>
            Surgical tools engineered for{" "}
            <span className="text-gradient-emerald">maximum interview callbacks.</span>
          </>
        }
        sub="Everything you need to audit, optimize, rewrite, and export world-class technical resumes."
      />

      <div className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {FEATURES.map((f, i) => (
          <motion.div
            key={f.title}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.5, delay: (i % 3) * 0.06 }}
            className={`glass-card p-6 border border-[var(--glass-border)] shadow-xl relative overflow-hidden group ${f.span || ""}`}
          >
            <div className="flex items-start gap-4">
              <div className="h-11 w-11 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300 shadow-md shadow-emerald-500/10">
                <f.icon size={20} strokeWidth={2.2} />
              </div>
              <div>
                <h3 className="font-display text-lg font-bold tracking-tight text-[var(--ink)]">
                  {f.title}
                </h3>
                <p className="text-xs text-[var(--ink-muted)] mt-1 leading-relaxed">
                  {f.desc}
                </p>
              </div>
            </div>

            <div className="mt-6">{f.preview}</div>
          </motion.div>
        ))}
      </div>
    </section>
  );
}

export function SectionHeader({ eyebrow, title, sub, center = true }) {
  return (
    <div className={center ? "text-center max-w-3xl mx-auto" : "max-w-3xl"}>
      {eyebrow && (
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 text-xs font-extrabold uppercase tracking-widest">
          {eyebrow}
        </div>
      )}
      <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-extrabold leading-[1.08] tracking-tight text-[var(--ink)] mt-4">
        {title}
      </h2>
      {sub && (
        <p className="text-sm sm:text-base text-[var(--ink-muted)] mt-4 leading-relaxed">
          {sub}
        </p>
      )}
    </div>
  );
}

/* ---------------- Sub-Previews ---------------- */

function ScoreBarsPreview() {
  const bars = [
    { label: "ATS Keywords", value: 94 },
    { label: "Formatting & Structure", value: 88 },
    { label: "Quantified Impact", value: 92 },
    { label: "Recruiter Readability", value: 85 },
  ];
  return (
    <div className="rounded-xl bg-slate-950/60 border border-white/10 p-4 backdrop-blur-md">
      <div className="flex items-end justify-between mb-3">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            ATS Compatibility Score
          </div>
          <div className="font-display tabular text-3xl font-extrabold text-white mt-0.5">
            92<span className="text-sm font-normal text-slate-400">/100</span>
          </div>
        </div>
        <div className="text-xs text-emerald-400 bg-emerald-500/15 border border-emerald-500/30 px-2.5 py-1 rounded-full font-bold tabular">
          +24 pts (Target Pass)
        </div>
      </div>
      <div className="space-y-2.5">
        {bars.map((b, i) => (
          <div key={b.label}>
            <div className="flex justify-between text-xs text-slate-300 mb-1 font-medium">
              <span>{b.label}</span>
              <span className="tabular text-emerald-400 font-bold">
                {b.value}%
              </span>
            </div>
            <div className="h-2 rounded-full bg-slate-800 overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                whileInView={{ width: `${b.value}%` }}
                viewport={{ once: true }}
                transition={{
                  duration: 0.9,
                  delay: 0.1 + i * 0.08,
                  ease: [0.16, 1, 0.3, 1],
                }}
                className="h-full rounded-full bg-gradient-to-r from-emerald-500 to-teal-400"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

function RewritePreview() {
  return (
    <div className="rounded-xl bg-slate-950/60 border border-white/10 p-4 space-y-2.5 font-sans">
      <div className="rounded-lg bg-rose-500/10 border border-rose-500/20 p-3">
        <div className="text-[10px] uppercase tracking-wider text-rose-400 font-extrabold mb-1">
          Weak Resume Bullet
        </div>
        <div className="text-xs text-slate-400 line-through">
          Worked on API performance and fixed database bugs.
        </div>
      </div>
      <div className="rounded-lg bg-emerald-500/15 border border-emerald-500/30 p-3">
        <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-extrabold mb-1 flex items-center justify-between">
          <span>AI Impact Rewrite</span>
          <span className="text-[9px] bg-emerald-500/20 px-1.5 py-0.5 rounded font-bold">98% Impact Score</span>
        </div>
        <div className="text-xs text-slate-100 font-medium">
          Architected 6 microservices in Node.js, reducing p99 API latency by 42% and sustaining 4.2M daily queries.
        </div>
      </div>
    </div>
  );
}

function KeywordsPreview() {
  const matched = ["React 19", "TypeScript", "Node.js", "System Architecture"];
  const missing = ["GraphQL", "Kubernetes"];
  return (
    <div className="rounded-xl bg-slate-950/60 border border-white/10 p-4">
      <div className="text-[10px] uppercase tracking-wider text-slate-400 font-extrabold mb-2.5">
        Target Role: Senior Staff Engineer @ OpenAI
      </div>
      <div className="flex flex-wrap gap-1.5 mb-2.5">
        {matched.map((k) => (
          <span
            key={k}
            className="px-2.5 py-1 rounded-md bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold"
          >
            ✓ {k}
          </span>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5">
        {missing.map((k) => (
          <span
            key={k}
            className="px-2.5 py-1 rounded-md bg-rose-500/15 border border-rose-500/30 text-rose-400 text-xs font-bold"
          >
            + {k} (Missing)
          </span>
        ))}
      </div>
    </div>
  );
}

function VersionsPreview() {
  const versions = [
    { label: "V1 (Initial)", score: 62 },
    { label: "V2 (Keywords Added)", score: 79 },
    { label: "V3 (AI Rewritten)", score: 94 },
  ];
  return (
    <div className="rounded-xl bg-slate-950/60 border border-white/10 p-4 flex items-center gap-2">
      {versions.map((v, i) => (
        <div
          key={v.label}
          className={`flex-1 rounded-xl p-3 text-center ${
            i === versions.length - 1
              ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-400"
              : "bg-white/5 border border-white/10 text-slate-300"
          }`}
        >
          <div className="text-[9px] uppercase tracking-wider font-extrabold">
            {v.label}
          </div>
          <div className="font-display tabular text-xl font-extrabold mt-1">
            {v.score}%
          </div>
        </div>
      ))}
    </div>
  );
}

function DiffPreview() {
  return (
    <div className="rounded-xl bg-slate-950/60 border border-white/10 p-3 space-y-1.5 font-mono text-xs">
      <div className="flex gap-2 px-2.5 py-1.5 rounded-lg bg-rose-500/10 text-rose-400">
        <span className="font-bold">−</span>
        <span className="line-through">Responsible for leading team tasks</span>
      </div>
      <div className="flex gap-2 px-2.5 py-1.5 rounded-lg bg-emerald-500/15 text-emerald-400 font-bold">
        <span>+</span>
        <span>Spearheaded 8-engineer frontend pod shipping 14 features</span>
      </div>
    </div>
  );
}

function ChartPreview() {
  const pts = [52, 64, 71, 78, 86, 94];
  const max = 100;
  const w = 320;
  const h = 90;
  const stepX = w / (pts.length - 1);
  const path = pts
    .map((p, i) => `${i === 0 ? "M" : "L"} ${i * stepX} ${h - (p / max) * h}`)
    .join(" ");
  const area = `${path} L ${w} ${h} L 0 ${h} Z`;
  return (
    <div className="rounded-xl bg-slate-950/60 border border-white/10 p-4">
      <div className="flex items-end justify-between mb-2">
        <div>
          <div className="text-[10px] uppercase tracking-wider text-slate-400 font-bold">
            ATS Score Trajectory
          </div>
          <div className="font-display tabular text-2xl font-extrabold text-white">
            94 ATS Score
          </div>
        </div>
        <div className="text-xs text-emerald-400 bg-emerald-500/15 px-2.5 py-0.5 rounded-full font-bold tabular">
          +42 pts Growth
        </div>
      </div>
      <svg viewBox={`0 0 ${w} ${h}`} className="w-full h-[90px]">
        <defs>
          <linearGradient id="featAreaGrad" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#10b981" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#10b981" stopOpacity="0" />
          </linearGradient>
        </defs>
        <path d={area} fill="url(#featAreaGrad)" />
        <path
          d={path}
          fill="none"
          stroke="#10b981"
          strokeWidth="3"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function PdfPreview() {
  return (
    <div className="rounded-xl bg-slate-950/60 border border-white/10 p-4 flex items-center justify-center">
      <div className="w-[140px] h-[150px] rounded-xl glass-panel border border-emerald-500/30 p-3 space-y-2 shadow-2xl rotate-[-2deg] hover:rotate-0 transition-transform">
        <div className="h-2 w-16 rounded-full bg-emerald-400" />
        <div className="h-1 w-20 rounded-full bg-slate-600" />
        <div className="pt-2 space-y-1.5">
          {[12, 16, 14, 18, 11].map((w, i) => (
            <div
              key={i}
              className="h-1 rounded-full bg-slate-700"
              style={{ width: `${w * 5}px` }}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
