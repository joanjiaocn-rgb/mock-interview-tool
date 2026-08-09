"use client";

import Script from "next/script";
import { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import { analyticsEnabled, ga4MeasurementId, trackPageView } from "@/lib/analytics";

export function GoogleAnalytics() {
  const pathname = usePathname();
  const [scriptReady, setScriptReady] = useState(false);
  const lastSentPageRef = useRef("");

  useEffect(() => {
    if (!analyticsEnabled || !scriptReady || lastSentPageRef.current === pathname) {
      return;
    }

    lastSentPageRef.current = pathname;
    trackPageView(pathname);
  }, [pathname, scriptReady]);

  if (!analyticsEnabled) {
    return null;
  }

  return (
    <>
      <Script src={`https://www.googletagmanager.com/gtag/js?id=${ga4MeasurementId}`} strategy="afterInteractive" onReady={() => setScriptReady(true)} />
      <Script id="ga4-init" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){window.dataLayer.push(arguments);}
          window.gtag = window.gtag || gtag;
          gtag('js', new Date());
          gtag('config', '${ga4MeasurementId}', { send_page_view: false });
        `}
      </Script>
    </>
  );
}
