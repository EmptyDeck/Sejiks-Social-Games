import * as React from 'react';

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  /** Visual weight. `primary` = the one main action on a screen; `secondary` = quiet; `danger` = destructive (close room); `ghost` = dashed outline. */
  variant?: 'primary' | 'secondary' | 'danger' | 'ghost';
  /** `sm` for compact controls (tiny "All" buttons, steppers). */
  size?: 'md' | 'sm';
  /** Stretch to the full width of its container (the usual phone layout). */
  block?: boolean;
}

/** Big, thumb-friendly action button with a chunky pressed-down feel. Phones: use `block`, one `primary` per screen. */
export function Button({ variant = 'primary', size = 'md', block, className, children, type = 'button', ...rest }: ButtonProps) {
  const cls = ['cpg-btn', variant !== 'primary' && `cpg-btn--${variant}`, size === 'sm' && 'cpg-btn--sm', block && 'cpg-btn--block', className].filter(Boolean).join(' ');
  return <button type={type} className={cls} {...rest}>{children}</button>;
}
