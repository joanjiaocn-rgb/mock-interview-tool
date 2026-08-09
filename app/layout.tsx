import type { Metadata } from "next";
import { BriefcaseBusiness, Mail, ShieldCheck } from "lucide-react";
import "./globals.css";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { routes, site, siteIds } from "@/lib/site";

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Mock Interview Tool | Practice Interviews With Timed Feedback",
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  alternates: {
    canonical: site.url,
  },
  openGraph: {
    title: "Mock Interview Tool | Practice Interviews With Timed Feedback",
    description: site.description,
    url: site.url,
    type: "website",
    locale: "en_US",
    siteName: site.shortName,
  },
  twitter: {
    card: "summary_large_image",
    title: "Mock Interview Tool | Practice Interviews With Timed Feedback",
    description: site.description,
  },
};

const organizationSchema = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "Organization",
      "@id": siteIds.organization,
      name: site.name,
      url: site.url,
      email: site.supportEmail,
    },
    {
      "@type": "WebSite",
      "@id": siteIds.website,
      url: site.url,
      name: site.name,
      description: site.description,
      publisher: { "@id": siteIds.organization },
      inLanguage: "en-US",
    },
    {
      "@type": "SoftwareApplication",
      "@id": siteIds.app,
      name: site.name,
      applicationCategory: "EducationalApplication",
      operatingSystem: "Web",
      url: site.url,
      offers: {
        "@type": "Offer",
        price: "0",
        priceCurrency: "USD",
      },
    },
  ],
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <GoogleAnalytics />
        <div className="page-shell">
          <header className="site-header">
            <a className="brand" href="/" aria-label={`${site.name} home`}>
              <span className="brand-mark" aria-hidden="true">
                <BriefcaseBusiness size={20} />
              </span>
              <span>{site.shortName}</span>
            </a>
            <nav className="nav-links" aria-label="Main navigation">
              <a href="/#studio">Studio</a>
              <a href="/#rubric">Rubric</a>
              <a href="/#pricing">Pricing</a>
              <a href="/#faq">FAQ</a>
            </nav>
          </header>
          {children}
          <footer className="footer">
            <div className="footer-inner">
              <div className="footer-brand">
                <ShieldCheck size={18} aria-hidden="true" />
                <span>Private browser-first interview practice.</span>
              </div>
              <nav className="footer-links" aria-label="Footer navigation">
                {routes.slice(1).map((route) => (
                  <a key={route.path} href={route.path}>
                    {route.label}
                  </a>
                ))}
                <a href={`mailto:${site.supportEmail}`}>
                  <Mail size={15} aria-hidden="true" />
                  Support
                </a>
              </nav>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
