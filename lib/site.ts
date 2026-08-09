export const site = {
  name: "Mock Interview Tool",
  shortName: "InterviewLab",
  url: "https://mock-interview-tool.pages.dev",
  description:
    "Practice realistic 5-10 question mock interviews with role-based prompts, timed rounds, structured notes, scoring rubrics, and a downloadable prep report.",
  authorName: "Mock Interview Tool",
  supportEmail: "support@example.com",
  publishedAt: "2026-08-09",
  updatedAt: "2026-08-09",
};

export const siteIds = {
  organization: `${site.url}/#organization`,
  website: `${site.url}/#website`,
  app: `${site.url}/#software`,
};

export const routes = [
  { path: "/", label: "Practice" },
  { path: "/about", label: "About" },
  { path: "/privacy", label: "Privacy" },
  { path: "/terms", label: "Terms" },
  { path: "/contact", label: "Contact" },
];
