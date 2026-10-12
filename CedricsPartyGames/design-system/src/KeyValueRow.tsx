import * as React from 'react';

export interface KeyValueRowProps { label: string; /** Value text or any element (e.g. a PlayerChip). */ children?: React.ReactNode; }

/** "Label … value" row with a dashed divider, for result summaries (The word: Knife). */
export function KeyValueRow({ label, children }: KeyValueRowProps) {
  return <div className="cpg-kv"><span className="cpg-kv__label">{label}</span><span className="cpg-kv__value">{children}</span></div>;
}
