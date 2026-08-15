export const site = {
  name: "Interview English Coach",
  shortName: "EnglishCoach",
  url: "https://mock-interview.space",
  description:
    "Free English interview prep for non-native speakers. Paste a JD and resume to get likely questions, STAR outlines, and answer drafts.",
  keywords: ["English interview practice", "behavioral interview prep", "STAR interview answer builder", "Chinese speakers"],
  authorName: "Interview English Coach",
  supportEmail: "support@example.com",
  publishedAt: "2026-08-09",
  updatedAt: "2026-08-13",
};

export const siteIds = {
  organization: `${site.url}/#organization`,
  website: `${site.url}/#website`,
  app: `${site.url}/#software`,
};

export const routes = [
  { path: "/", label: "Home" },
  { path: "/how-to", label: "How to use" },
  { path: "/practice", label: "Practice" },
  { path: "/answer-builder", label: "Answer Builder" },
  { path: "/examples", label: "Examples" },
  { path: "/pricing", label: "Pricing" },
  { path: "/about", label: "About" },
  { path: "/privacy", label: "Privacy" },
  { path: "/terms", label: "Terms" },
  { path: "/contact", label: "Contact" },
];
