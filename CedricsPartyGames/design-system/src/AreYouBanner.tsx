import * as React from 'react';
import { Button } from './Button';

export interface AreYouBannerProps { question?: string; yesLabel?: string; onYes?: () => void; }

/** The "Are you Cedric?" strip at the top of every phone lobby; tapping Yes opens the PIN dialog that makes that phone the admin. */
export function AreYouBanner({ question = 'Are you Cedric?', yesLabel = 'Yes', onYes }: AreYouBannerProps) {
  return <div className="cpg-areyou"><span>{question}</span><Button variant="secondary" size="sm" onClick={onYes}>{yesLabel}</Button></div>;
}
