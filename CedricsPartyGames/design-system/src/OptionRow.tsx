import * as React from 'react';

export interface OptionRowProps {
  title: string;
  /** One short line explaining the option. */
  help?: string;
  /** The control on the right: a Toggle, a Stepper, a count. */
  children?: React.ReactNode;
}

/** A labelled setting row for the admin's setup screen. */
export function OptionRow({ title, help, children }: OptionRowProps) {
  return (
    <div className="cpg-option">
      <div><div className="cpg-option__title">{title}</div>{help && <div className="cpg-option__help">{help}</div>}</div>
      {children}
    </div>
  );
}
