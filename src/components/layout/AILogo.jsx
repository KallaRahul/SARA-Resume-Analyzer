import { motion } from "framer-motion";

const AILogo = ({ size = "md" }) => {
  const isSm = size === "sm";
  const containerSize = isSm ? "h-9 w-9" : "h-11 w-11";
  const innerSize = isSm ? "h-[30px] w-[30px]" : "h-[36px] w-[36px]";
  const sparkSize = isSm ? "h-[14px] w-[14px]" : "h-[18px] w-[18px]";

  return (
    <div
      className={`relative ${containerSize} flex items-center justify-center shrink-0`}
      aria-label="SARA (Smart AI Resume Analyzer)"
    >
      {/* Outer ambient glow */}
      <motion.div
        className="absolute -inset-1 rounded-2xl"
        style={{
          background:
            "radial-gradient(circle, rgba(16, 185, 129, 0.6) 0%, transparent 70%)",
          filter: "blur(12px)",
        }}
        animate={{ opacity: [0.5, 0.95, 0.5], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
      />

      {/* Rotating conic gradient ring */}
      <div className="absolute inset-0 rounded-2xl overflow-hidden p-[1px]">
        <motion.div
          className="absolute -inset-1/2"
          style={{
            background:
              "conic-gradient(from 0deg, #10b981, #06b6d4, #3b82f6, #10b981)",
          }}
          animate={{ rotate: 360 }}
          transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
        />
      </div>

      {/* Inner card frame */}
      <div className={`relative ${innerSize} rounded-xl bg-slate-950 flex items-center justify-center overflow-hidden border border-white/10 shadow-inner`}>
        {/* Soft radial backdrop */}
        <motion.div
          className="absolute inset-0"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(16, 185, 129, 0.3) 0%, transparent 75%)",
          }}
          animate={{ opacity: [0.6, 1, 0.6] }}
          transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Shimmering Sparkle Diamond */}
        <motion.div
          className={`relative ${sparkSize} rounded-md`}
          style={{
            background:
              "linear-gradient(135deg, #34d399 0%, #059669 50%, #06b6d4 100%)",
            backgroundSize: "200% 200%",
            rotate: 45,
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"],
            scale: [1, 1.12, 1],
            rotate: [45, 60, 45],
          }}
          transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
        />

        {/* Sparkle highlights */}
        <motion.div
          className="absolute h-[3px] w-[3px] rounded-full bg-white"
          style={{ boxShadow: "0 0 8px rgba(255,255,255,0.9)" }}
          animate={{
            opacity: [0, 1, 0],
            top: ["25%", "40%", "65%"],
            left: ["35%", "55%", "40%"],
          }}
          transition={{ duration: 2.2, repeat: Infinity, ease: "easeInOut" }}
        />
      </div>
    </div>
  );
};

export function BrandLogo({ showText = true, size = "md" }) {
  return (
    <div className="flex items-center gap-3">
      <AILogo size={size} />
      {showText && (
        <div className="flex flex-col">
          <span className="font-display font-extrabold text-lg tracking-tight text-[var(--ink)] flex items-center gap-1.5 leading-none">
            SARA
            <span className="px-1.5 py-0.5 rounded text-[10px] font-mono font-extrabold bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 uppercase tracking-widest">
              AI
            </span>
          </span>
          <span className="text-[10px] font-bold text-emerald-400 tracking-wider uppercase mt-1 font-mono">
            Smart AI Resume Analyzer
          </span>
        </div>
      )}
    </div>
  );
}

export default AILogo;
