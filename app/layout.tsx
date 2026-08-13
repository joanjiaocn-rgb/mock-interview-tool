import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { ArrowRight, Mail, ShieldCheck } from "lucide-react";
import "./globals.css";
import { GoogleAnalytics } from "@/components/GoogleAnalytics";
import { routes, site, siteIds } from "@/lib/site";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-sans",
});

export const metadata: Metadata = {
  metadataBase: new URL(site.url),
  title: {
    default: "Interview English Coach | Free English Interview Prep",
    template: `%s | ${site.shortName}`,
  },
  description: site.description,
  alternates: {
    canonical: site.url,
  },
  openGraph: {
    title: "Interview English Coach | Free English Interview Prep",
    description: site.description,
    url: site.url,
    type: "website",
    locale: "en_US",
    siteName: site.shortName,
  },
  twitter: {
    card: "summary_large_image",
    title: "Interview English Coach | Free English Interview Prep",
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
      <body className={inter.variable}>
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }} />
        <GoogleAnalytics />
        <div className="page-shell">
          <header className="site-header">
            <a className="brand" href="/" aria-label={`${site.name} home`}>
              <span className="brand-mark" aria-hidden="true">EC</span>
              <span>{site.shortName}</span>
            </a>
            <nav className="nav-links" aria-label="Main navigation">
              <a href="/answer-builder">Builder</a>
              <a href="/how-to">How to use</a>
              <a href="/practice">Practice</a>
              <a href="/examples">Examples</a>
              <a href="/pricing">Free</a>
            </nav>
            <div className="header-actions">
              <a className="button secondary header-link" href="/how-to">
                Learn the flow
              </a>
              <a className="button primary header-link" href="/practice">
                Start free
                <ArrowRight size={16} aria-hidden="true" />
              </a>
            </div>
          </header>
          {children}
          <footer className="footer">
            <div className="footer-inner">
              <div className="footer-brand">
                <ShieldCheck size={18} aria-hidden="true" />
                <span>Free English interview prep for non-native speakers.</span>
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
