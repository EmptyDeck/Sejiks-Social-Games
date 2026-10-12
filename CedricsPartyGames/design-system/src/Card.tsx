import * as React from 'react';

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /** Highlight the card with the accent color (e.g. the winning answer). */
  accent?: boolean;
}

/** Translucent rounded panel for grouping content: an answer, a result, a setting. */
export function Card({ accent, className, children, ...rest }: CardProps) {
  return <div {...rest} className={['cpg-card', accent && 'cpg-card--accent', className].filter(Boolean).join(' ')}>{children}</div>;
}
