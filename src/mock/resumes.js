// Mock resumes + per-version analyses engine.
import { daysAgo, hoursAgo } from "./_helpers";

// Taxonomy of target role keyword requirements
const ROLE_TAXONOMY = [
  {
    role: "Software Tester",
    keywords: ["Selenium", "Test Automation", "JUnit", "Playwright", "Cypress", "Jira", "Regression Testing", "API Testing", "Postman", "CI/CD", "Bug Tracking", "Test Cases"],
    rewrites: [
      { original: "Tested web applications and reported bugs.", rewritten: "Engineered automated regression test suite using Selenium & Playwright — expanded test coverage 45%.", section: "experience", rationale: "Adds automation framework + test coverage metric." },
      { original: "Worked with the QA team on manual testing.", rewritten: "Led end-to-end API & UI test execution across 12 sprint cycles, catching 40+ critical defects pre-release.", section: "experience", rationale: "Highlights defect prevention + sprint scope." }
    ]
  },
  {
    role: "Software Developer",
    keywords: ["Data Structures", "Algorithms", "Git", "System Design", "Object-Oriented Programming", "REST APIs", "Unit Testing", "Microservices", "Docker", "CI/CD"],
    rewrites: [
      { original: "Worked on software modules and bug fixes.", rewritten: "Developed modular REST microservices handling 50k+ daily API requests using Node.js & Docker.", section: "experience", rationale: "Quantified throughput + named modern backend stack." },
      { original: "Wrote code for core application features.", rewritten: "Architected core business logic with OOP patterns, boosting unit test coverage to 92%.", section: "experience", rationale: "Mentions architecture + code quality metrics." }
    ]
  },
  {
    role: "Senior Frontend Engineer",
    keywords: ["React", "TypeScript", "JavaScript", "HTML5", "CSS3", "Tailwind", "Vite", "Next.js", "Web Vitals", "Accessibility"],
    rewrites: [
      { original: "Worked on dashboards for the analytics team.", rewritten: "Shipped 4 React analytics dashboards adopted by 12k+ daily users — cut load time 38%.", section: "experience", rationale: "Quantified outcome + strong verb + named scale." },
      { original: "Helped migrate the build system.", rewritten: "Led migration from Webpack to Vite, reducing build times from 92s to 11s across 14 packages.", section: "experience", rationale: "Named technologies + concrete metric + scope." }
    ]
  },
  {
    role: "Full-Stack Engineer",
    keywords: ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "GraphQL", "Tailwind", "Docker", "AWS", "CI/CD"],
    rewrites: [
      { original: "Built backend APIs and frontend pages.", rewritten: "Delivered full-stack payment module with React & Express handling $4.2M monthly transactions.", section: "experience", rationale: "Highlights full-stack delivery + business volume." }
    ]
  },
  {
    role: "Data Scientist",
    keywords: ["Python", "Pandas", "NumPy", "Scikit-Learn", "PyTorch", "TensorFlow", "SQL", "Data Visualization", "Feature Engineering", "A/B Testing"],
    rewrites: [
      { original: "Analyzed dataset and built prediction models.", rewritten: "Trained Random Forest & XGBoost models achieving 94.2% precision on customer churn prediction.", section: "experience", rationale: "Names specific algorithms + model accuracy metric." }
    ]
  },
  {
    role: "DevOps Engineer",
    keywords: ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "GitHub Actions", "Prometheus", "Grafana", "Linux", "Bash"],
    rewrites: [
      { original: "Maintained cloud servers and pipelines.", rewritten: "Automated AWS infrastructure with Terraform & Helm — reduced deployment cycle time by 65%.", section: "experience", rationale: "Infrastructure-as-code + deployment speedup." }
    ]
  },
  {
    role: "Data Analyst",
    keywords: ["SQL", "Python", "Tableau", "Power BI", "Excel", "Data Modeling", "ETL", "Statistics", "A/B Testing", "Dashboarding"],
    rewrites: [
      { original: "Created monthly data reports.", rewritten: "Built automated Power BI & SQL dashboards tracking $12M revenue pipeline across 6 business units.", section: "experience", rationale: "Adds BI tool + pipeline scale." }
    ]
  },
  {
    role: "Product Manager",
    keywords: ["Product Strategy", "Agile", "Scrum", "Roadmapping", "User Research", "KPIs", "A/B Testing", "Jira", "SQL", "Stakeholder Management"],
    rewrites: [
      { original: "Managed feature roadmap.", rewritten: "Spearheaded Q3 product roadmap execution for 2.4M MAUs, increasing activation rate by 28%.", section: "experience", rationale: "Adds metric outcome + user scale." }
    ]
  }
];

export function generateRoleAnalysis(version, targetRole = "") {
  const versionId = version?._id || `v_${Date.now()}`;
  const sections = version?.parsedSections || {};
  const resumeSkills = (sections.skills || [
    "React", "TypeScript", "Node.js", "GraphQL", "Tailwind", "Vite", "Jest", "Playwright", "AWS", "PostgreSQL"
  ]).map((s) => s.toLowerCase());

  // Match targetRole against taxonomy or extract fallback terms
  const cleanRole = targetRole.trim();
  const matchedTaxonomy = ROLE_TAXONOMY.find((t) =>
    cleanRole.toLowerCase().includes(t.role.toLowerCase()) || t.role.toLowerCase().includes(cleanRole.toLowerCase())
  );

  let expectedKeywords = matchedTaxonomy?.keywords;
  if (!expectedKeywords) {
    // Generate role keywords from title / targetRole string
    const roleWords = cleanRole.split(/\s+/).filter((w) => w.length > 2);
    expectedKeywords = Array.from(new Set([
      ...roleWords.map((w) => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()),
      "Git", "REST APIs", "Unit Testing", "CI/CD", "System Design", "Agile"
    ]));
  }

  const roleName = cleanRole || matchedTaxonomy?.role || "Software Developer";

  const present = [];
  const missing = [];

  expectedKeywords.forEach((kw) => {
    const isPresent = resumeSkills.some((s) => s.includes(kw.toLowerCase()) || kw.toLowerCase().includes(s));
    if (isPresent) present.push(kw);
    else missing.push(kw);
  });

  // Compute deterministic role affinity factor based on candidate title/stack vs targetRole
  const resumeTitleLower = (sections?.basics?.title || version?.title || "").toLowerCase();
  const targetLower = cleanRole.toLowerCase();

  let affinityFactor = 0.35;

  if (targetLower.includes("tester") || targetLower.includes("qa") || targetLower.includes("automation")) {
    if (resumeTitleLower.includes("test") || resumeTitleLower.includes("qa")) affinityFactor = 0.92;
    else if (resumeTitleLower.includes("frontend") || resumeTitleLower.includes("dev") || resumeTitleLower.includes("sde")) affinityFactor = 0.62;
    else if (resumeTitleLower.includes("data")) affinityFactor = 0.38;
    else affinityFactor = 0.28;
  } else if (targetLower.includes("frontend") || targetLower.includes("react") || targetLower.includes("ui")) {
    if (resumeTitleLower.includes("frontend") || resumeTitleLower.includes("react")) affinityFactor = 0.94;
    else if (resumeTitleLower.includes("full-stack") || resumeTitleLower.includes("dev") || resumeTitleLower.includes("sde")) affinityFactor = 0.78;
    else if (resumeTitleLower.includes("test")) affinityFactor = 0.52;
    else affinityFactor = 0.32;
  } else if (targetLower.includes("developer") || targetLower.includes("engineer") || targetLower.includes("sde")) {
    if (resumeTitleLower.includes("sde") || resumeTitleLower.includes("developer") || resumeTitleLower.includes("engineer")) affinityFactor = 0.88;
    else if (resumeTitleLower.includes("test") || resumeTitleLower.includes("qa")) affinityFactor = 0.60;
    else affinityFactor = 0.45;
  } else if (targetLower.includes("data") || targetLower.includes("scientist") || targetLower.includes("analyst")) {
    if (resumeTitleLower.includes("data") || resumeTitleLower.includes("scientist")) affinityFactor = 0.90;
    else if (resumeTitleLower.includes("developer") || resumeTitleLower.includes("sde")) affinityFactor = 0.48;
    else affinityFactor = 0.30;
  } else if (targetLower.includes("devops") || targetLower.includes("cloud") || targetLower.includes("infra")) {
    if (resumeTitleLower.includes("devops") || resumeTitleLower.includes("cloud")) affinityFactor = 0.91;
    else if (resumeTitleLower.includes("developer") || resumeTitleLower.includes("sde")) affinityFactor = 0.54;
    else affinityFactor = 0.34;
  } else if (targetLower.includes("cyber") || targetLower.includes("security")) {
    if (resumeTitleLower.includes("cyber") || resumeTitleLower.includes("security")) affinityFactor = 0.89;
    else affinityFactor = 0.24;
  } else {
    // Unique hash calculation based on cleanRole characters so custom roles get distinct scores
    let charSum = 0;
    for (let i = 0; i < cleanRole.length; i++) charSum += cleanRole.charCodeAt(i);
    affinityFactor = 0.35 + (charSum % 40) / 100;
  }

  // Combine actual keyword coverage ratio (50% weight) with role affinity factor (50% weight)
  const kwMatchRatio = expectedKeywords.length ? present.length / expectedKeywords.length : 0.4;
  const matchRatio = Math.min(0.96, Math.max(0.15, kwMatchRatio * 0.5 + affinityFactor * 0.5));

  const kwScore = Math.min(25, Math.max(2, Math.round(matchRatio * 25)));
  const fmtScore = Math.min(25, Math.max(12, Math.round(14 + matchRatio * 8)));
  const impScore = Math.min(25, Math.max(4, Math.round(6 + matchRatio * 18)));
  const clrScore = Math.min(25, Math.max(6, Math.round(8 + matchRatio * 15)));

  const atsScore = kwScore + fmtScore + impScore + clrScore;

  let summary = "";
  if (atsScore >= 78) {
    summary = `Excellent match for ${roleName}! Strong coverage of core technical requirements (${present.slice(0, 3).join(", ")}). Adding missing keywords (${missing.slice(0, 2).join(", ")}) will solidify top-tier recruiter ranking.`;
  } else if (atsScore >= 60) {
    summary = `Solid foundation for ${roleName} (${atsScore}% score). Demonstrates core competencies, but missing key role terms (${missing.slice(0, 3).join(", ")}); updating experience bullets will boost score to 80+.`;
  } else {
    summary = `Low alignment for ${roleName} (${atsScore}% ATS score). Significant keyword & technical gaps detected in ${missing.slice(0, 4).join(", ")}. Tailor skills and experience bullets to match targeted job description.`;
  }

  const issues = [
    {
      title: `Missing critical keywords for ${roleName}`,
      severity: missing.length > 4 ? "high" : "medium",
      fix: `Incorporate key role terms: ${missing.slice(0, 4).join(", ")} into your Skills or Experience section.`
    },
    {
      title: "Impact metrics needed in junior/older positions",
      severity: "medium",
      fix: "Quantify achievements using percentage improvements, user counts, or dollars saved."
    },
    {
      title: "Action verbs can be strengthened",
      severity: "low",
      fix: "Replace passive verbs ('helped', 'worked on') with outcome verbs ('engineered', 'shipped', 'spearheaded')."
    }
  ];

  const strengths = [
    {
      title: `Relevant core tech stack for ${roleName}`,
      note: present.length > 0 ? present.slice(0, 5).join(", ") : "Solid foundation"
    },
    {
      title: "Clean single-column ATS parsing format",
      note: "100% structured section compatibility"
    },
    {
      title: "Quantified metrics present in primary position",
      note: "Demonstrates measurable outcome focus"
    }
  ];

  return {
    _id: `an_${versionId}_${Date.now()}`,
    versionId,
    atsScore,
    model: "gemini-2.5-flash",
    summary,
    scoreBreakdown: {
      keywords: kwScore,
      formatting: fmtScore,
      impact: impScore,
      clarity: clrScore
    },
    issues,
    strengths,
    keywordsPresent: present,
    keywordsMissing: missing,
    bulletRewrites: matchedTaxonomy?.rewrites || ROLE_TAXONOMY[1].rewrites
  };
}

function extractSkillsFromTitle(title = "") {
  const lower = title.toLowerCase();
  if (lower.includes("test") || lower.includes("qa") || lower.includes("automation")) {
    return ["Selenium", "JUnit", "Playwright", "Cypress", "Jira", "Postman", "Test Cases", "Regression Testing", "API Testing", "Bug Tracking", "CI/CD"];
  }
  if (lower.includes("data") || lower.includes("science") || lower.includes("analyst")) {
    return ["Python", "Pandas", "NumPy", "Scikit-Learn", "PyTorch", "TensorFlow", "SQL", "Tableau", "Power BI", "Data Modeling", "ETL"];
  }
  if (lower.includes("devops") || lower.includes("cloud") || lower.includes("infra")) {
    return ["Docker", "Kubernetes", "AWS", "Terraform", "CI/CD", "GitHub Actions", "Prometheus", "Grafana", "Linux", "Bash"];
  }
  if (lower.includes("backend") || lower.includes("java") || lower.includes("python") || lower.includes("node")) {
    return ["Java", "Spring Boot", "Node.js", "Express", "PostgreSQL", "REST APIs", "Microservices", "Docker", "Redis", "Kafka"];
  }
  if (lower.includes("full-stack") || lower.includes("fullstack")) {
    return ["React", "TypeScript", "Node.js", "Express", "PostgreSQL", "GraphQL", "Tailwind", "Docker", "AWS", "CI/CD"];
  }
  if (lower.includes("cyber") || lower.includes("security")) {
    return ["Network Security", "Penetration Testing", "SIEM", "Firewalls", "Cryptography", "Identity Access", "Vulnerability Assessment", "Linux", "Python", "Compliance"];
  }
  return ["React", "TypeScript", "Node.js", "GraphQL", "Tailwind", "Vite", "Jest", "Playwright", "AWS", "PostgreSQL"];
}

function makeVersion({ id, label, score, sourceType, createdAt, title = "Senior Frontend Engineer", candidateName }) {
  let name = candidateName;
  if (!name && title) {
    const cleanTitle = title.replace(/\.pdf$/i, "").replace(/[-_]/g, " ");
    const words = cleanTitle.split(/\s+/).filter(Boolean);
    if (words.length >= 2 && !cleanTitle.toLowerCase().includes("frontend") && !cleanTitle.toLowerCase().includes("backend") && !cleanTitle.toLowerCase().includes("full-stack")) {
      name = `${words[0]} ${words[1]}`;
    }
  }
  if (!name) {
    name = "Candidate";
  }

  const skills = extractSkillsFromTitle(title);

  return {
    _id: id,
    label,
    sourceType,
    createdAt,
    score,
    rawText: "—",
    parsedSections: {
      basics: {
        name,
        title,
        email: `${name.toLowerCase().replace(/\s+/g, ".")}@example.com`,
        phone: "+1 (555) 019-2831",
        location: "San Francisco, CA",
        links: [
          { label: `github.com/${name.toLowerCase().replace(/\s+/g, "")}`, url: "#" },
          { label: `linkedin.com/in/${name.toLowerCase().replace(/\s+/g, "")}`, url: "#" },
        ],
      },
      summary:
        `Professional with 5+ years experience building applications and driving core engineering deliverables. Specialized in ${skills.slice(0, 4).join(", ")}.`,
      experience: [
        {
          role: title,
          company: "Acme Corp",
          period: "2023 — Present",
          bullets: [
            `Engineered production features adopted by 12k+ daily users using ${skills.slice(0, 2).join(" & ")}; cut latency 38%.`,
            `Led core systems migration using ${skills.slice(2, 4).join(" & ")}, reducing build and deployment cycles by 45%.`,
            "Owned team architecture standards (reusable modules, WCAG AA accessibility pass).",
          ],
        },
        {
          role: "Software Engineer",
          company: "Northwind Tech",
          period: "2020 — 2023",
          bullets: [
            "Built customer-facing web services handling $4.2M/mo in transactions.",
            "Reduced p95 page response time from 3.1s to 0.9s via code-splitting.",
          ],
        },
      ],
      education: [
        { degree: "B.S. Computer Science", school: "UC Berkeley", period: "2016 — 2020" },
      ],
      skills,
      projects: [
        {
          name: "Open Source Tooling",
          tech: skills.slice(0, 2),
          summary: "Open-source developer utility plugin. 1.2k★.",
        },
      ],
      certifications: [{ name: "AWS Solutions Architect — Associate", year: 2024 }],
      languages: ["English", "Spanish"],
      interests: ["Open source", "Photography"],
    },
  };
}

export const INITIAL_MOCK_RESUMES = [
  {
    _id: "resume_1",
    title: "Senior Frontend Engineer — Stripe",
    createdAt: daysAgo(20),
    updatedAt: hoursAgo(2),
    currentVersionId: "v_1_3",
    bestScore: 86,
    versionCount: 3,
    versions: [
      makeVersion({ id: "v_1_1", label: "V1", score: 62, sourceType: "upload", createdAt: daysAgo(20) }),
      makeVersion({ id: "v_1_2", label: "V2", score: 78, sourceType: "rewrite", createdAt: daysAgo(8) }),
      makeVersion({ id: "v_1_3", label: "V3", score: 86, sourceType: "rewrite", createdAt: hoursAgo(2) }),
    ],
  },
  {
    _id: "resume_2",
    title: "Full-Stack Engineer — Vercel",
    createdAt: daysAgo(34),
    updatedAt: daysAgo(3),
    currentVersionId: "v_2_2",
    bestScore: 74,
    versionCount: 2,
    versions: [
      makeVersion({ id: "v_2_1", label: "V1", score: 58, sourceType: "upload", createdAt: daysAgo(34) }),
      makeVersion({ id: "v_2_2", label: "V2", score: 74, sourceType: "rewrite", createdAt: daysAgo(3) }),
    ],
  },
  {
    _id: "resume_3",
    title: "React Engineer — Notion",
    createdAt: daysAgo(60),
    updatedAt: daysAgo(40),
    currentVersionId: "v_3_1",
    bestScore: 71,
    versionCount: 1,
    versions: [
      makeVersion({ id: "v_3_1", label: "V1", score: 71, sourceType: "upload", createdAt: daysAgo(60) }),
    ],
  },
];

export const mockResumes = [];
export const mockAnalyses = {};

export function getActiveUserId() {
  try {
    const raw = localStorage.getItem("arr-mock-user");
    if (!raw) return null;
    const u = JSON.parse(raw);
    return u?._id || null;
  } catch {
    return null;
  }
}

export function saveVaultToStorage() {
  const userId = getActiveUserId();
  if (!userId) return;
  try {
    localStorage.setItem(`sara_vault_${userId}`, JSON.stringify(mockResumes));
    localStorage.setItem(`sara_analyses_${userId}`, JSON.stringify(mockAnalyses));
  } catch {}
}

export function initVault() {
  const userId = getActiveUserId();
  mockResumes.length = 0;
  Object.keys(mockAnalyses).forEach((k) => delete mockAnalyses[k]);

  if (!userId) return;

  try {
    const raw = localStorage.getItem(`sara_vault_${userId}`);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed) && parsed.length > 0) {
        mockResumes.push(...parsed);
      }
    }
    const rawAnalyses = localStorage.getItem(`sara_analyses_${userId}`);
    if (rawAnalyses) {
      Object.assign(mockAnalyses, JSON.parse(rawAnalyses));
    }
  } catch {}
}

// Initialize vault from LocalStorage
initVault();

// Helper to initialize analyses for existing mock resumes
export function getOrCreateAnalysis(version, targetRole = "") {
  if (!version) return null;
  const key = `${version._id}_${targetRole.trim().toLowerCase()}`;
  if (mockAnalyses[key]) return mockAnalyses[key];

  const newAnalysis = generateRoleAnalysis(version, targetRole);
  mockAnalyses[key] = newAnalysis;
  mockAnalyses[version._id] = newAnalysis; // fallback key
  saveVaultToStorage();
  return newAnalysis;
}

export function findMockResume(id) {
  initVault();
  return mockResumes.find((r) => r._id === id);
}

export function listMockResumesShallow() {
  initVault();
  return mockResumes.map((r) => ({
    _id: r._id,
    title: r.title,
    createdAt: r.createdAt,
    updatedAt: r.updatedAt,
    versionCount: r.versionCount || r.versions?.length || 1,
    bestScore: r.bestScore || 75,
  }));
}

export function addMockResume(file, title) {
  initVault();
  const newId = `resume_${Date.now()}`;
  const vId = `v_${Date.now()}_1`;
  const resumeTitle = title || file?.name?.replace(/\.pdf$/i, "") || "Uploaded Resume";

  const newVersion = makeVersion({
    id: vId,
    label: "V1",
    score: 72,
    sourceType: "upload",
    createdAt: new Date().toISOString(),
    title: resumeTitle,
  });

  const newResume = {
    _id: newId,
    title: resumeTitle,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    currentVersionId: vId,
    bestScore: 72,
    versionCount: 1,
    versions: [newVersion],
  };

  mockResumes.unshift(newResume);
  getOrCreateAnalysis(newVersion, resumeTitle);
  saveVaultToStorage();
  return newResume;
}



