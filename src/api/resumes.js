// ─────────────────────────────────────────────────────────────────────────────
// RESUMES API — backed by mocks while the backend is offline.
// TO ENABLE THE REAL BACKEND:
//   1. Uncomment each `apiClient.*` line below.
//   2. Delete the mock implementation block underneath.
//   3. Delete the `import` from "@/mock/*".
// ─────────────────────────────────────────────────────────────────────────────

// import { apiClient } from "./client";
import {
  mockResumes,
  mockAnalyses,
  findMockResume,
  listMockResumesShallow,
  addMockResume,
  getOrCreateAnalysis,
  generateRoleAnalysis,
  saveVaultToStorage,
} from "@/mock/resumes";
import { mockDelay } from "@/mock/_helpers";

export const resumesApi = {
  // list: () => apiClient.get("/resumes").then((r) => r.data),
  list: async () => {
    await mockDelay();
    return { resumes: listMockResumesShallow() };
  },

  // get: (id) => apiClient.get(`/resumes/${id}`).then((r) => r.data),
  get: async (id) => {
    await mockDelay();
    const resume = findMockResume(id);
    if (!resume) throw { status: 404, message: "Resume not found" };
    return {
      resume: {
        _id: resume._id,
        title: resume.title,
        createdAt: resume.createdAt,
        updatedAt: resume.updatedAt,
        currentVersionId: resume.currentVersionId,
      },
      versions: resume.versions,
    };
  },

  // getVersion: (id, versionId) =>
  //   apiClient.get(`/resumes/${id}/versions/${versionId}`).then((r) => r.data),
  getVersion: async (id, versionId) => {
    await mockDelay();
    const resume = findMockResume(id);
    const version = resume?.versions.find((v) => v._id === versionId);
    if (!version) throw { status: 404, message: "Version not found" };
    return { version };
  },

  // upload: (file, title) => { ... },
  upload: async (file, title) => {
    await mockDelay(800);
    const resume = addMockResume(file, title);
    return { resume };
  },

  // remove: (id) => apiClient.delete(`/resumes/${id}`).then((r) => r.data),
  remove: async () => {
    await mockDelay();
    return { ok: true };
  },

  // analyze: (id, body = {}) =>
  //   apiClient.post(`/resumes/${id}/analyze`, body).then((r) => r.data),
  analyze: async (id, { versionId, targetRole } = {}) => {
    await mockDelay(700);
    const resume = findMockResume(id);
    const version = resume?.versions.find((v) => v._id === versionId) || resume?.versions[resume?.versions.length - 1];
    const roleKey = targetRole?.trim() || resume?.title || "Software Developer";
    const analysis = generateRoleAnalysis(version, roleKey);

    if (version) {
      const cacheKey = `${version._id}_${roleKey.toLowerCase()}`;
      mockAnalyses[cacheKey] = analysis;
      mockAnalyses[version._id] = analysis;
      version.score = analysis.atsScore;
      version.targetRole = roleKey;
      if (resume) resume.bestScore = Math.max(resume.bestScore || 0, analysis.atsScore);
    }
    saveVaultToStorage();
    return { analysis };
  },

  // analyses: (id) => apiClient.get(`/resumes/${id}/analyses`).then((r) => r.data),
  analyses: async (id) => {
    await mockDelay();
    const resume = findMockResume(id);
    const analyses = (resume?.versions || [])
      .map((v) => mockAnalyses[v._id] || getOrCreateAnalysis(v))
      .filter(Boolean);
    return { analyses };
  },

  // analysisForVersion: (id, versionId, targetRole) =>
  //   apiClient.get(`/resumes/${id}/versions/${versionId}/analysis`).then((r) => r.data),
  analysisForVersion: async (id, versionId, targetRole = "") => {
    await mockDelay(150);
    const resume = findMockResume(id);
    const version = resume?.versions.find((v) => v._id === versionId);
    const roleKey = targetRole?.trim() || version?.targetRole || resume?.title || "";
    const cacheKey = `${versionId}_${roleKey.toLowerCase()}`;
    let analysis = mockAnalyses[cacheKey];
    if (!analysis && version) {
      analysis = generateRoleAnalysis(version, roleKey);
      mockAnalyses[cacheKey] = analysis;
      mockAnalyses[versionId] = analysis;
      saveVaultToStorage();
    }
    if (!analysis) throw { status: 404, message: "No analysis for this version" };
    return { analysis };
  },

  // rewrite: (id, body) =>
  //   apiClient.post(`/resumes/${id}/rewrite`, body).then((r) => r.data),
  rewrite: async (id, { rewriteIds = [] } = {}) => {
    await mockDelay(800);
    const resume = findMockResume(id);
    if (!resume) throw { status: 404, message: "Resume not found" };

    const currentVersion = resume.versions[resume.versions.length - 1];
    const prevAnalysis = mockAnalyses[currentVersion._id] || getOrCreateAnalysis(currentVersion);
    const missingKeywords = prevAnalysis?.keywordsMissing || ["Selenium", "Test Automation", "Docker", "CI/CD"];

    const currentScore = currentVersion?.score || 55;
    const boost = Math.round(14 + (rewriteIds.length || 3) * 2);
    const newScore = Math.min(88, currentScore + boost);

    const newVersionNumber = resume.versions.length + 1;
    const newVersionId = `v_${resume._id}_${newVersionNumber}`;

    const currentSections = currentVersion?.parsedSections || {};
    const updatedSections = JSON.parse(JSON.stringify(currentSections));

    // Merge missing keywords into skills array
    const existingSkills = updatedSections.skills || [];
    updatedSections.skills = Array.from(new Set([...existingSkills, ...missingKeywords.slice(0, 4)]));

    // Update summary statement with targeted role keyword optimization
    updatedSections.summary = `Accomplished professional with 5+ years experience building scalable applications. Proven track record optimizing ${missingKeywords.slice(0, 3).join(", ")} deliverables.`;

    if (updatedSections.experience?.length) {
      const rewrites = prevAnalysis?.bulletRewrites || [];
      const newBullets = rewrites.length
        ? rewrites.map((r) => r.rewritten)
        : [
            `Engineered production features adopted by 12k+ daily users using ${missingKeywords.slice(0, 2).join(" & ")}; cut latency 38%.`,
            `Led core systems migration using ${missingKeywords.slice(2, 4).join(" & ")}, reducing build and deployment cycles by 45%.`,
            "Owned team architecture standards (reusable modules, WCAG AA accessibility pass)."
          ];
      updatedSections.experience[0].bullets = newBullets;
    }

    const newVersion = {
      _id: newVersionId,
      label: `V${newVersionNumber}`,
      score: newScore,
      sourceType: "rewrite",
      createdAt: new Date().toISOString(),
      rawText: currentVersion?.rawText || "—",
      parsedSections: updatedSections
    };

    resume.versions.push(newVersion);
    resume.currentVersionId = newVersionId;
    resume.versionCount = resume.versions.length;
    resume.bestScore = Math.max(resume.bestScore || 0, newScore);

    const prevBk = prevAnalysis?.scoreBreakdown || { keywords: 12, formatting: 16, impact: 12, clarity: 14 };
    const newAnalysis = generateRoleAnalysis(newVersion, resume.title);
    newAnalysis.atsScore = newScore;
    newAnalysis.scoreBreakdown = {
      keywords: Math.min(23, prevBk.keywords + 6),
      formatting: Math.min(23, prevBk.formatting + 3),
      impact: Math.min(23, prevBk.impact + 6),
      clarity: Math.min(23, prevBk.clarity + 4)
    };
    newAnalysis.keywordsPresent = Array.from(new Set([...(prevAnalysis?.keywordsPresent || []), ...missingKeywords.slice(0, 4)]));
    newAnalysis.keywordsMissing = missingKeywords.slice(4);
    newAnalysis.summary = `Greatly improved match for ${resume.title} (${newScore}% ATS score)! Merged key role terms (${missingKeywords.slice(0, 3).join(", ")}) and high-impact metric rewrites into experience section.`;
    newAnalysis.issues = [
      {
        title: "Primary bullet impact issues resolved",
        severity: "low",
        fix: "Experience section metrics and core action verbs match targeted role standards."
      }
    ];
    mockAnalyses[newVersionId] = newAnalysis;

    saveVaultToStorage();

    return {
      version: newVersion,
      appliedCount: rewriteIds.length || 3,
    };
  },
};

