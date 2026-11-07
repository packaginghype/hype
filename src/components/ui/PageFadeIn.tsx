"use client";

import { useEffect, useRef, useState } from "react";

/**
 * PageFadeIn — wraps real page content so it fades in smoothly
 * instead of snapping from skeleton → blank → content.
 *
 * Usage: wrap the top-level return in each page.tsx:
 *   return <PageFadeIn>…real content…</PageFadeIn>
 */
export function PageFadeIn({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // rAF ensures the DOM is painted before we trigger the transition,
    // preventing the skeleton → blank → content flash.
    const id = requestAnimationFrame(() => setVisible(true));
    return () => cancelAnimationFrame(id);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        opacity: visible ? 1 : 0,
        transition: "opacity 180ms ease-in",
        willChange: "opacity",
      }}
    >
      {children}
    </div>
  );
}
