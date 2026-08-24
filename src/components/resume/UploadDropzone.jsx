import { useState } from "react";
import { useDropzone } from "react-dropzone";
import { motion } from "framer-motion";
import { UploadCloud, FileText, X, Loader2, Sparkles, CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useUploadResume } from "@/hooks/useResumes";

const MAX_BYTES = 10 * 1024 * 1024;

function formatBytes(n) {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(1)} KB`;
  return `${(n / 1024 / 1024).toFixed(1)} MB`;
}

export function UploadDropzone({ onUploaded, compact = false }) {
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState("");
  const [err, setErr] = useState("");
  const upload = useUploadResume();

  const { getRootProps, getInputProps, isDragActive, isDragReject } = useDropzone({
    accept: { "application/pdf": [".pdf"] },
    maxFiles: 1,
    maxSize: MAX_BYTES,
    multiple: false,
    onDropAccepted: (files) => {
      setErr("");
      setFile(files[0]);
      if (!title) setTitle(files[0].name.replace(/\.pdf$/i, ""));
    },
    onDropRejected: (rejections) => {
      const reason = rejections?.[0]?.errors?.[0]?.message || "File rejected (PDF only, max 10MB)";
      setErr(reason);
    },
  });

  async function submit() {
    if (!file) return;
    setErr("");
    try {
      const data = await upload.mutateAsync({ file, title: title || file.name.replace(/\.pdf$/i, "") });
      setFile(null);
      setTitle("");
      onUploaded?.(data.resume);
    } catch (e) {
      setErr(e.message || "Upload failed. Please try again.");
    }
  }

  function handleDemoLoad() {
    const demoBlob = new Blob(["Demo Resume PDF Content"], { type: "application/pdf" });
    const demoFile = new File([demoBlob], "Senior_Software_Engineer_Resume.pdf", { type: "application/pdf" });
    setFile(demoFile);
    setTitle("Senior Software Engineer Resume");
  }

  function reset() {
    setFile(null);
    setTitle("");
    setErr("");
  }

  return (
    <div className="space-y-4">
      {!file && (
        <div
          {...getRootProps()}
          className={cn(
            "rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-300 outline-none relative overflow-hidden glass-panel",
            compact ? "p-6" : "p-10 sm:p-14",
            isDragActive
              ? "border-emerald-400 bg-emerald-500/15 shadow-2xl shadow-emerald-500/20 scale-[1.01]"
              : "border-[var(--border)] bg-[var(--surface-2)]/60 hover:border-emerald-500/40 hover:bg-emerald-500/5",
            isDragReject && "border-rose-500 bg-rose-500/15"
          )}
        >
          <input {...getInputProps()} />
          <div className="flex flex-col items-center text-center">
            <motion.div
              animate={isDragActive ? { y: -8, scale: 1.1 } : { y: 0 }}
              className={cn(
                "rounded-2xl flex items-center justify-center mb-4 transition-all duration-300 shadow-xl",
                compact ? "h-12 w-12" : "h-16 w-16",
                isDragActive
                  ? "bg-emerald-400 text-slate-950 shadow-emerald-400/40"
                  : "bg-emerald-500/15 border border-emerald-500/30 text-emerald-400"
              )}
            >
              <UploadCloud size={compact ? 22 : 28} />
            </motion.div>
            
            <div className={cn("font-display font-bold tracking-tight text-[var(--ink)]", compact ? "text-base" : "text-xl sm:text-2xl")}>
              {isDragActive ? "Drop PDF Resume Here" : "Drag & Drop Your Resume PDF"}
            </div>

            <p className="text-xs text-[var(--ink-muted)] mt-1.5 max-w-sm">
              Instant ATS parsing, bullet rewrites, and formatting check · PDF format · Max 10MB
            </p>

            <div className="mt-5 flex items-center gap-3">
              <span className="text-xs font-semibold px-4 py-2 rounded-xl bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                Browse Files
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleDemoLoad();
                }}
                className="text-xs font-bold text-[var(--ink-muted)] hover:text-emerald-400 underline underline-offset-4 transition-colors flex items-center gap-1"
              >
                <Sparkles size={12} />
                Try Preset Sample
              </button>
            </div>
          </div>
        </div>
      )}

      {file && (
        <div className="rounded-2xl border border-emerald-500/30 bg-emerald-500/10 p-4 flex items-center gap-3 backdrop-blur-md">
          <div className="h-11 w-11 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center shrink-0">
            <FileText size={20} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-sm font-bold text-[var(--ink)] truncate">{file.name}</div>
            <div className="text-xs text-emerald-400 font-mono flex items-center gap-2 mt-0.5">
              <span>{formatBytes(file.size)}</span>
              <span>•</span>
              <span className="flex items-center gap-1">
                <CheckCircle2 size={12} /> PDF Validated
              </span>
            </div>
          </div>
          <button
            onClick={reset}
            className="h-8 w-8 rounded-xl hover:bg-rose-500/20 text-slate-400 hover:text-rose-400 flex items-center justify-center transition-colors"
            disabled={upload.isPending}
          >
            <X size={16} />
          </button>
        </div>
      )}

      {file && (
        <div className="space-y-3">
          <Input
            placeholder="Target Resume Title / Role (e.g. Senior Frontend Engineer)"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="h-12 text-sm"
          />
          <Button
            onClick={submit}
            variant="accent"
            size="lg"
            disabled={upload.isPending}
            className="w-full h-12 font-bold text-sm"
          >
            {upload.isPending ? (
              <>
                <Loader2 size={16} className="animate-spin" />
                Executing AI ATS Scan & Bullet Rewrites...
              </>
            ) : (
              <>
                <Sparkles size={16} />
                Run AI Resume Scan & Optimization
              </>
            )}
          </Button>
        </div>
      )}

      {err && (
        <div className="text-xs font-semibold text-rose-400 bg-rose-500/15 border border-rose-500/30 rounded-xl px-4 py-3">
          {err}
        </div>
      )}
    </div>
  );
}
