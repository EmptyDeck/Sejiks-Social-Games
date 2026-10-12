import * as React from 'react';

export interface ScreenProps extends React.HTMLAttributes<HTMLDivElement> {
  /** `phone` = one narrow column (max 480px). `host` = the shared laptop/TV display: full width, larger type, must never scroll. */
  variant?: 'phone' | 'host';
  /** Center content vertically and horizontally. */
  center?: boolean;
}

/** Page-level layout container. Phone screens may scroll; the host screen must always fit the window without scrolling. */
export function Screen({ variant = 'phone', center, className, children, ...rest }: ScreenProps) {
  return <div {...rest} className={['cpg-screen', `cpg-screen--${variant}`, center && 'cpg-screen--center', className].filter(Boolean).join(' ')}>{children}</div>;
}
