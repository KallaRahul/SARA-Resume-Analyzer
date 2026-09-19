// Dynamic dashboard payload.
import { mockResumes, mockAnalyses } from "./resumes";

export function getDynamicDashboard() {
  if (!mockResumes.length) {
    return {
      totals: { resumes: 0, rewrites: 0, analyses: 0 },
      latestResume: null,
      scoreSeries: [],
      versionStack: [],
      kpi: {},
      activity: [],
    };
  }

  const latestResume = mockResumes[0];
  const versions = latestResume.versions || [];
  const latestVersion = versions[versions.length - 1] || versions[0];
  const firstVersion = versions[0];
  const latestAnalysis = mockAnalyses[latestVersion?._id];

  let totalResumes = mockResumes.length;
  let totalRewrites = 0;
  let totalVersions = 0;

  mockResumes.forEach((r) => {
    (r.versions || []).forEach((v) => {
      totalVersions++;
      if (v.sourceType === "rewrite") totalRewrites++;
    });
  });

  const scoreSeries = versions.map((v) => ({
    label: v.label || "V1",
    score: v.score ?? 75,
  }));

  const versionStack = versions.map((v) => ({
    id: v._id,
    label: v.label || "V1",
    title: v.sourceType === "upload" ? "Original Upload" : "AI Bullet Rewrite",
    score: v.score ?? 75,
  }));

  const presentCount = latestAnalysis?.keywordsPresent?.length || 18;
  const missingCount = latestAnalysis?.keywordsMissing?.length || 2;
  const totalKeywords = presentCount + missingCount;
  const currentScore = latestVersion?.score ?? 75;
  const initialScore = firstVersion?.score ?? 70;
  const scoreDelta = currentScore - initialScore;

  const activity = [];
  mockResumes.slice(0, 3).forEach((r) => {
    (r.versions || []).forEach((v) => {
      activity.push({
        id: `act_${v._id}`,
        type: v.sourceType || "upload",
        title: v.sourceType === "rewrite" ? `Applied rewrites to ${v.label}` : `Uploaded ${r.title}`,
        subtitle: `${r.title} · ATS score ${v.score || 75}/100`,
        label: v.label,
        at: v.createdAt || r.createdAt,
        resumeId: r._id,
      });
    });
  });

  activity.sort((a, b) => new Date(b.at || 0) - new Date(a.at || 0));

  return {
    totals: {
      resumes: totalResumes,
      rewrites: totalRewrites,
      analyses: totalVersions,
    },
    latestResume: {
      _id: latestResume._id,
      title: latestResume.title,
    },
    scoreSeries,
    versionStack,
    kpi: {
      atsScore: {
        value: currentScore,
        delta: scoreDelta,
        spark: versions.map((v) => ({ v: v.score || 75 })),
      },
      versions: {
        value: totalVersions,
        spark: versions.map((_, i) => ({ v: i + 1 })),
      },
      issuesIdentified: {
        value: latestAnalysis?.issues?.length || 2,
        delta: -4,
        spark: [{ v: 8 }, { v: 6 }, { v: 4 }, { v: latestAnalysis?.issues?.length || 2 }],
      },
      keywordsMatched: {
        value: presentCount,
        total: totalKeywords,
        delta: 6,
        spark: [{ v: 12 }, { v: 16 }, { v: presentCount }],
      },
    },
    activity: activity.slice(0, 6),
  };
}

export const mockDashboard = getDynamicDashboard();

