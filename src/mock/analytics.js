// Dynamic cross-resume analytics payloads (Insights / Versions / History pages).
import { mockResumes } from "./resumes";

export function getDynamicAllVersions() {
  const versions = [];
  let uploads = 0;
  let rewrites = 0;

  mockResumes.forEach((r) => {
    (r.versions || []).forEach((v) => {
      const type = v.sourceType || "upload";
      if (type === "upload") uploads++;
      if (type === "rewrite") rewrites++;

      versions.push({
        id: v._id,
        label: v.label || "V1",
        resumeId: r._id,
        resumeTitle: r.title,
        sourceType: type,
        score: v.score ?? r.bestScore ?? 75,
        createdAt: v.createdAt || r.createdAt,
      });
    });
  });

  if (!versions.length) {
    // Populate sample candidate resume versions for demo visibility
    const sampleItems = [
      { id: "v_sample_3", label: "V3", resumeId: "res_sample_1", resumeTitle: "Rahul Kalla — Amazon SDE Resume.pdf", sourceType: "rewrite", score: 86, createdAt: "2026-08-26T10:30:00.000Z" },
      { id: "v_sample_2", label: "V2", resumeId: "res_sample_1", resumeTitle: "Rahul Kalla — Amazon SDE Resume.pdf", sourceType: "rewrite", score: 74, createdAt: "2026-08-25T14:20:00.000Z" },
      { id: "v_sample_1", label: "V1", resumeId: "res_sample_1", resumeTitle: "Rahul Kalla — Amazon SDE Resume.pdf", sourceType: "upload", score: 58, createdAt: "2026-08-24T09:15:00.000Z" },
      { id: "v_sample_4", label: "V1", resumeId: "res_sample_2", resumeTitle: "Ananya Sharma — Senior Frontend.pdf", sourceType: "upload", score: 79, createdAt: "2026-08-23T16:45:00.000Z" },
    ];
    versions.push(...sampleItems);
    uploads = 2;
    rewrites = 2;
  }

  // Sort by createdAt descending
  versions.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));

  return {
    totals: {
      all: versions.length,
      uploads,
      rewrites,
    },
    versions,
  };
}

export function getDynamicHistoryEvents() {
  const events = [];
  let uploadCount = 0;
  let analyzeCount = 0;
  let rewriteCount = 0;

  mockResumes.forEach((r) => {
    (r.versions || []).forEach((v) => {
      const isUpload = (v.sourceType || "upload") === "upload";
      if (isUpload) {
        uploadCount++;
        events.push({
          id: `ev_up_${v._id}`,
          type: "upload",
          title: `Uploaded ${r.title}`,
          subtitle: `Parsed sections ready`,
          label: "Upload",
          at: v.createdAt || r.createdAt,
          resumeId: r._id,
        });
      } else {
        rewriteCount++;
        events.push({
          id: `ev_rw_${v._id}`,
          type: "rewrite",
          title: `Applied rewrites — created ${v.label}`,
          subtitle: r.title,
          label: "Rewrite",
          at: v.createdAt || r.createdAt,
          resumeId: r._id,
        });
      }

      if (v.score != null) {
        analyzeCount++;
        events.push({
          id: `ev_an_${v._id}`,
          type: "analyze",
          title: `Analyzed ${v.label} of ${r.title}`,
          subtitle: `ATS score ${v.score} / 100`,
          label: "Analysis",
          at: v.createdAt || r.createdAt,
          resumeId: r._id,
        });
      }
    });
  });

  if (!events.length) {
    const sampleEvents = [
      { id: "ev_s3", type: "rewrite", title: "Applied bullet rewrites — created V3", subtitle: "Rahul Kalla — Amazon SDE Resume.pdf", label: "Rewrite", at: "2026-08-26T10:30:00.000Z", resumeId: "res_sample_1" },
      { id: "ev_s2", type: "analyze", title: "Analyzed V2 of Rahul Kalla — Amazon SDE Resume.pdf", subtitle: "ATS score 74 / 100", label: "Analysis", at: "2026-08-25T14:20:00.000Z", resumeId: "res_sample_1" },
      { id: "ev_s1", type: "upload", title: "Uploaded Rahul Kalla — Amazon SDE Resume.pdf", subtitle: "Parsed sections ready as V1", label: "Upload", at: "2026-08-24T09:15:00.000Z", resumeId: "res_sample_1" },
      { id: "ev_s4", type: "upload", title: "Uploaded Ananya Sharma — Senior Frontend.pdf", subtitle: "Parsed sections ready as V1", label: "Upload", at: "2026-08-23T16:45:00.000Z", resumeId: "res_sample_2" },
      { id: "ev_s5", type: "analyze", title: "Analyzed V1 of Ananya Sharma — Senior Frontend.pdf", subtitle: "ATS score 79 / 100", label: "Analysis", at: "2026-08-23T16:50:00.000Z", resumeId: "res_sample_2" },
    ];
    events.push(...sampleEvents);
    uploadCount = 2;
    analyzeCount = 2;
    rewriteCount = 1;
  }

  events.sort((a, b) => new Date(b.at || 0) - new Date(a.at || 0));

  return {
    totals: {
      all: events.length,
      upload: uploadCount,
      analyze: analyzeCount,
      rewrite: rewriteCount,
    },
    events,
  };
}

export function getDynamicInsights() {
  const allV = getDynamicAllVersions().versions;
  if (!allV.length) {
    return { empty: true };
  }

  const scores = allV.map((v) => v.score).filter((s) => s != null);
  const avg = scores.length ? Math.round(scores.reduce((a, b) => a + b, 0) / scores.length) : 75;
  const best = scores.length ? Math.max(...scores) : 86;
  const bestV = allV.find((v) => v.score === best) || allV[0];

  const scoreTrend = allV.slice().reverse().map((v) => ({
    score: v.score || 75,
    at: v.createdAt,
    resumeTitle: `${v.resumeTitle} (${v.label})`,
  }));

  const resumePerformance = mockResumes.map((r) => {
    const rVers = r.versions || [];
    const rScores = rVers.map((v) => v.score).filter((s) => s != null);
    const latestScore = rScores.length ? rScores[rScores.length - 1] : 75;
    const peakScore = rScores.length ? Math.max(...rScores) : 75;
    const initialScore = rScores.length ? rScores[0] : 75;
    const improvement = peakScore - initialScore;

    return {
      resumeId: r._id,
      title: r.title,
      latestScore,
      bestScore: peakScore,
      improvement,
      analysesCount: rVers.length,
    };
  });

  return {
    averageScore: avg,
    bestScore: {
      value: best,
      resumeId: bestV?.resumeId || "resume_1",
      resumeTitle: bestV?.resumeTitle || "Resume",
    },
    totalAnalyses: allV.length,
    scoreTrend,
    topIssues: [
      { title: "Missing critical keywords for target role", severity: "high", count: 5 },
      { title: "Impact metrics needed in junior positions", severity: "medium", count: 3 },
      { title: "Action verbs can be strengthened", severity: "low", count: 2 },
    ],
    topMissingKeywords: [
      { keyword: "Selenium", count: 4 },
      { keyword: "Docker", count: 3 },
      { keyword: "Kubernetes", count: 2 },
    ],
    resumePerformance,
  };
}

export const mockInsights = getDynamicInsights();
export const mockAllVersions = getDynamicAllVersions();
export const mockHistory = getDynamicHistoryEvents();

