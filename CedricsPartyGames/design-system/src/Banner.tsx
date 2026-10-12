import * as React from 'react';

export interface BannerProps { /** Leading emoji, e.g. 👉 */ icon?: string; children?: React.ReactNode; }

/** Highlighted one-line callout: "👉 Ann goes first". Use for the single most important fact on a screen. */
export function Banner({ icon, children }: BannerProps) {
  return <div className="cpg-banner">{icon && <span>{icon}</span>}<span>{children}</span></div>;
}
