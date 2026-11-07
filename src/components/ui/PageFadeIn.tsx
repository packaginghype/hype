import React from "react";

/**
 * PageFadeIn — wraps page content with a CSS fade-in animation
 * to eliminate jarring snaps between skeleton and real content.
 */
export function PageFadeIn({ children }: { children: React.ReactNode }) {
  return <div className="page-fade-in">{children}</div>;
}
