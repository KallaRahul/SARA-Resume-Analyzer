import { useEffect, useMemo, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Sparkles, ArrowLeft, Loader2, FileText, Download, CheckCircle2 } from "lucide-react";
import { PageHeader } from "@/components/layout/PageHeader";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Badge } from "@/components/ui/Badge";
import { Skeleton } from "@/components/ui/Skeleton";
import { EmptyState } from "@/components/ui/EmptyState";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import { AtsGauge } from "@/components/dashboard/AtsGauge";
import { ScoreBreakdown } from "@/components/analysis/ScoreBreakdown";
import { IssuesList } from "@/components/analysis/IssuesList";
import { StrengthsList } from "@/components/analysis/StrengthsList";
import { KeywordChips } from "@/components/analysis/KeywordChips";
import { BulletRewrites } from "@/components/analysis/BulletRewrites";
import { VersionSwitcher } from "@/components/resume/VersionSwitcher";
import { relativeTime } from "@/lib/utils";
import {
  useResume,
  useAnalysisForVersion,
  useAnalyzeResume,
  useApplyRewrites,
} from "@/hooks/useResumes";

const SUGGESTED_ROLES = [
  "Software Tester",
  "Software Developer",
  "Software Engineer",
  "Senior Frontend Engineer",
  "Senior Backend Engineer",
  "Full-Stack Engineer",
  "DevOps Engineer",
  "Data Scientist",
  "Data Analyst",
  "Product Manager",
  "Cloud Solutions Architect",
  "Mobile App Developer",
  "Cybersecurity Engineer",
  "Software Quality Assurance (QA) Lead",
  "Database Administrator (DBA)",
  "AI / Machine Learning Engineer",
  "UI/UX Product Designer",
  "Embedded Systems Developer"
];

export default function ResumeDetail() {
  const { id } = useParams();
  const nav = useNavigate();

  const { data, isLoading, error } = useResume(id);
  const resume = data?.resume;
  const versions = data?.versions || [];

  const [activeVersionId, setActiveVersionId] = useState(null);

  // Reset active version when resume ID changes
  useEffect(() => {
    setActiveVersionId(null);
  }, [id]);

  useEffect(() => {
    if (!activeVersionId && versions.length) {
      setActiveVersionId(resume?.currentVersionId || versions[versions.length - 1]._id);
    }
  }, [versions, resume, activeVersionId]);

  const [targetRole, setTargetRole] = useState("");
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [tab, setTab] = useState("score");

  const activeVersion = useMemo(
    () => versions.find((v) => v._id === activeVersionId),
    [versions, activeVersionId]
  );

  const analysisQuery = useAnalysisForVersion(id, activeVersionId, targetRole);
  const analysis = analysisQuery.data;

  const analyze = useAnalyzeResume(id);
  const applyRewrites = useApplyRewrites(id);

  const filteredSuggestions = useMemo(() => {
    const query = targetRole.trim().toLowerCase();
    if (!query) return SUGGESTED_ROLES;
    return SUGGESTED_ROLES.filter((role) =>
      role.toLowerCase().includes(query)
    );
  }, [targetRole]);

  async function runAnalyze(roleOverride) {
    const roleToScan = typeof roleOverride === "string" ? roleOverride : targetRole;
    try {
      await analyze.mutateAsync({
        versionId: activeVersionId,
        targetRole: roleToScan.trim() || undefined,
      });
      await analysisQuery.refetch();
    } catch {}
  }

  async function runApplyRewrites(rewriteIds) {
    if (!analysis?._id) return;
    try {
      const res = await applyRewrites.mutateAsync({
        analysisId: analysis._id,
        rewriteIds: rewriteIds.length ? rewriteIds : undefined,
      });
      if (res?.version?._id) {
        const newVersionId = res.version._id;
        setActiveVersionId(newVersionId);
        setTab("score");
        try {
          await analyze.mutateAsync({
            versionId: newVersionId,
            targetRole: targetRole.trim() || undefined,
          });
        } catch {}
      }
    } catch {}
  }

  if (isLoading) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-12 w-1/3 rounded-2xl" />
        <Skeleton className="h-[400px] rounded-3xl" />
      </div>
    );
  }

  if (error) {
    return (
      <EmptyState
        icon={FileText}
        title="Resume file not found"
        description={error.message}
        action={
          <Button variant="outline" onClick={() => nav("/resumes")}>
            Return to Resumes Vault
          </Button>
        }
      />
    );
  }

  return (
    <div className="space-y-6">
      <PageHeader
        title={resume?.title || "Resume Detail"}
        description={
          resume
            ? `Last modified ${relativeTime(resume.updatedAt)} · ${versions.length} version${
                versions.length > 1 ? "s" : ""
              } saved`
            : ""
        }
        actions={
          <div className="flex items-center gap-3">
            <Button variant="ghost" onClick={() => nav("/resumes")}>
              <ArrowLeft size={16} /> Resumes Vault
            </Button>
            <Button
              variant="accent"
              onClick={() => nav(`/resumes/${id}/export`)}
            >
              <Download size={16} /> Export PDF & Formats
            </Button>
          </div>
        }
      />

      <Card className="glass-card p-6 border border-[var(--glass-border)] shadow-xl relative z-30 overflow-visible">
        <div className="flex flex-col md:flex-row items-start md:items-center gap-4 justify-between">
          <div className="space-y-2">
            <CardTitle className="text-lg font-bold font-display flex items-center gap-2">
              <Sparkles size={18} className="text-emerald-400" />
              AI Analysis Launcher
            </CardTitle>
            <CardDescription>
              Execute multi-point ATS audit with Gemini 2.0 AI Engine
            </CardDescription>
            <VersionSwitcher
              versions={versions}
              activeId={activeVersionId}
              onChange={setActiveVersionId}
            />
          </div>

          <div className="flex items-center gap-3 w-full md:w-auto min-w-[280px] max-w-[560px] relative z-40">
            <div className="relative flex-1 min-w-0">
              <Input
                placeholder="Target Role / JD (e.g. Software Tester, Software Developer)"
                value={targetRole}
                onChange={(e) => {
                  setTargetRole(e.target.value);
                  setShowSuggestions(true);
                }}
                onFocus={() => setShowSuggestions(true)}
                onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
                className="h-11 w-full"
              />
              {showSuggestions && filteredSuggestions.length > 0 && (
                <div className="absolute left-0 right-0 top-full mt-1.5 z-[999] rounded-2xl bg-slate-950/98 border border-emerald-500/40 shadow-2xl backdrop-blur-2xl max-h-60 overflow-y-auto p-1.5 space-y-1">
                  <div className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider text-emerald-400">
                    Matching Job Role Suggestions
                  </div>
                  {filteredSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      onMouseDown={(e) => {
                        e.preventDefault();
                        setTargetRole(suggestion);
                        setShowSuggestions(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-xl text-xs font-semibold text-[var(--ink)] hover:bg-emerald-500/20 hover:text-emerald-300 transition-colors flex items-center justify-between group"
                    >
                      <span>{suggestion}</span>
                      <span className="text-[10px] text-emerald-400 font-mono font-bold opacity-0 group-hover:opacity-100 transition-opacity">
                        Select →
                      </span>
                    </button>
                  ))}
                </div>
              )}
            </div>
            <Button
              variant="accent"
              size="lg"
              onClick={() => runAnalyze()}
              disabled={analyze.isPending || !activeVersionId}
              className="shrink-0 font-bold"
            >
              {analyze.isPending ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Analyzing...
                </>
              ) : (
                <>
                  <Sparkles size={16} /> Run Scan
                </>
              )}
            </Button>
          </div>
        </div>
        {analyze.error && (
          <div className="mt-4 text-xs font-semibold text-rose-400 bg-rose-500/15 border border-rose-500/30 rounded-xl p-3">
            {analyze.error.message}
          </div>
        )}
      </Card>

      {!analysis && !analysisQuery.isLoading && (
        <EmptyState
          icon={Sparkles}
          title="No AI Analysis Generated Yet"
          description="Click 'Run Scan' above to compute ATS match, bullet rewrites, and keyword gaps."
        />
      )}

      {analysisQuery.isLoading && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">
          <Skeleton className="h-[280px] rounded-3xl" />
          <Skeleton className="h-[280px] rounded-3xl lg:col-span-2" />
        </div>
      )}

      {analysis && (
        <>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
            <div className="lg:col-span-4">
              <AtsGauge score={analysis.atsScore} delta={0} />
            </div>
            <div className="lg:col-span-5">
              <ScoreBreakdown breakdown={analysis.scoreBreakdown} />
            </div>
            <div className="lg:col-span-3">
              <Card className="glass-card h-full p-6 border border-[var(--glass-border)] shadow-xl flex flex-col justify-between">
                <div>
                  <CardHeader className="p-0 mb-3">
                    <CardTitle className="text-base font-bold font-display flex items-center gap-2">
                      <CheckCircle2 size={16} className="text-emerald-400" />
                      AI Recruiter Verdict
                    </CardTitle>
                    <Badge tone="accent" className="font-mono text-[10px] uppercase font-bold mt-1">
                      {analysis.model || "Gemini-Pro Engine"}
                    </Badge>
                  </CardHeader>
                  <p className="text-xs text-[var(--ink)] leading-relaxed font-medium">
                    {analysis.summary}
                  </p>
                </div>
              </Card>
            </div>
          </div>

          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="mb-4">
              <TabsTrigger value="score">Critical Issues</TabsTrigger>
              <TabsTrigger value="strengths">Key Strengths</TabsTrigger>
              <TabsTrigger value="keywords">Keyword Gaps</TabsTrigger>
              <TabsTrigger value="rewrites">Impact Rewrites</TabsTrigger>
            </TabsList>

            <div className="mt-4">
              <TabsContent value="score">
                <IssuesList issues={analysis.issues} />
              </TabsContent>
              <TabsContent value="strengths">
                <StrengthsList strengths={analysis.strengths} />
              </TabsContent>
              <TabsContent value="keywords">
                <KeywordChips
                  present={analysis.keywordsPresent}
                  missing={analysis.keywordsMissing}
                />
              </TabsContent>
              <TabsContent value="rewrites">
                <BulletRewrites
                  rewrites={analysis.bulletRewrites}
                  onApply={runApplyRewrites}
                  isApplying={applyRewrites.isPending}
                  error={applyRewrites.error?.message}
                />
              </TabsContent>
            </div>
          </Tabs>
        </>
      )}

      {activeVersion && (
        <Card className="glass-card p-6 border border-[var(--glass-border)] shadow-xl">
          <CardHeader>
            <div>
              <CardTitle className="text-base font-bold font-display">
                Extracted Document Sections ({activeVersion.label})
              </CardTitle>
              <CardDescription className="mt-1">
                Parsed content structure extracted from your document
              </CardDescription>
            </div>
          </CardHeader>
          <ParsedSectionsPreview version={activeVersion} />
        </Card>
      )}
    </div>
  );
}

function PreviewLabel({ children }) {
  return (
    <div className="text-[10px] uppercase tracking-wider text-emerald-400 font-extrabold mb-2">
      {children}
    </div>
  );
}

function ParsedSectionsPreview({ version }) {
  const s = version.parsedSections || {};
  const b = s.basics || {};

  return (
    <div className="space-y-5 text-sm">
      {(b.name || b.title || b.email) && (
        <div className="pb-4 border-b border-[var(--border)]">
          {b.name && (
            <div className="font-display text-xl font-bold tracking-tight text-[var(--ink)]">
              {b.name}
            </div>
          )}
          {b.title && (
            <div className="text-emerald-400 font-semibold text-sm mt-0.5">{b.title}</div>
          )}
          <div className="text-xs text-[var(--ink-muted)] mt-1.5 flex flex-wrap gap-x-4 gap-y-1 font-mono">
            {b.email && <span>📧 {b.email}</span>}
            {b.phone && <span>📞 {b.phone}</span>}
            {b.location && <span>📍 {b.location}</span>}
          </div>
        </div>
      )}

      {s.summary && (
        <div>
          <PreviewLabel>Summary Statement</PreviewLabel>
          <p className="text-[var(--ink)] text-xs leading-relaxed font-normal">{s.summary}</p>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {s.experience?.length > 0 && (
          <div>
            <PreviewLabel>Experience ({s.experience.length})</PreviewLabel>
            <ul className="space-y-2 text-xs">
              {s.experience.slice(0, 5).map((e, i) => (
                <li key={i} className="p-2 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-[var(--ink)] font-bold">{e.role}</span>
                  {e.company && (
                    <span className="text-emerald-400 font-medium"> @ {e.company}</span>
                  )}
                  {e.period && (
                    <span className="ml-2 text-[10px] text-[var(--ink-muted)] font-mono">
                      ({e.period})
                    </span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
        {s.education?.length > 0 && (
          <div>
            <PreviewLabel>Education ({s.education.length})</PreviewLabel>
            <ul className="space-y-2 text-xs">
              {s.education.map((e, i) => (
                <li key={i} className="p-2 rounded-lg bg-white/5 border border-white/5">
                  <span className="text-[var(--ink)] font-bold">{e.degree}</span>
                  {e.school && (
                    <span className="text-[var(--ink-muted)]"> • {e.school}</span>
                  )}
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {s.skills?.length > 0 && (
        <div>
          <PreviewLabel>Skills ({s.skills.length})</PreviewLabel>
          <div className="flex flex-wrap gap-1.5">
            {s.skills.slice(0, 24).map((sk, i) => (
              <Badge key={i} tone="accent" className="text-xs font-mono">{sk}</Badge>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
