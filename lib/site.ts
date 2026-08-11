export const site = {
  name: "Interview English Coach",
  shortName: "EnglishCoach",
  url: "https://mock-interview-tool.pages.dev",
  description:
    "Free English behavioral interview prep for non-native speakers. Paste a job description and resume to generate likely questions, Chinese strategy, STAR outlines, English answer drafts, and a cheat sheet.",
  authorName: "Interview English Coach",
  supportEmail: "support@example.com",
  publishedAt: "2026-08-09",
  updatedAt: "2026-08-11",
};

export const siteIds = {
  organization: `${site.url}/#organization`,
  website: `${site.url}/#website`,
  app: `${site.url}/#software`,
};

export const routes = [
  { path: "/", label: "Home" },
  { path: "/practice", label: "Practice" },
  { path: "/answer-builder", label: "Answer Builder" },
  { path: "/examples", label: "Examples" },
  { path: "/pricing", label: "Pricing" },
  { path: "/about", label: "About" },
  { path: "/privacy", label: "Privacy" },
  { path: "/terms", label: "Terms" },
  { path: "/contact", label: "Contact" },
];
