import * as React from 'react';

export interface ToastProps { children?: React.ReactNode; }

/** Small transient message pill ("Wrong PIN."). Position it yourself (fixed, bottom center). */
export function Toast({ children }: ToastProps) {
  return <span className="cpg-toast" role="status">{children}</span>;
}
