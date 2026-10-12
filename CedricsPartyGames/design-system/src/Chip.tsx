import * as React from 'react';

export interface ChipProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Selected/on state: shows a check mark and the accent color. */
  selected?: boolean;
}

/** Toggleable pill, e.g. a content category the admin switches on or off. Put several inside `<div className="cpg-chips">`. */
export function Chip({ selected, className, children, type = 'button', ...rest }: ChipProps) {
  return <button type={type} {...rest} className={['cpg-chip', selected && 'cpg-chip--on', className].filter(Boolean).join(' ')}>{selected ? '✔ ' : ''}{children}</button>;
}
