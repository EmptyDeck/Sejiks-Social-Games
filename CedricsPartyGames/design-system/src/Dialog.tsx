import * as React from 'react';
import { Button } from './Button';

export interface DialogProps {
  message: string;
  okLabel?: string;
  cancelLabel?: string;
  /** Show a PIN/text input (centered, spaced letters). */
  input?: { value?: string; placeholder?: string; password?: boolean };
  /** Use the danger style for the confirm button (closing a room). */
  danger?: boolean;
  onOk?: () => void;
  onCancel?: () => void;
}

/**
 * Themed confirmation / PIN dialog. NEVER use the browser's alert(), confirm() or prompt() in these games: they are
 * ugly and unthemed. Render this inside a full-screen dimmed layer instead.
 */
export function Dialog({ message, okLabel = 'OK', cancelLabel = 'Cancel', input, danger, onOk, onCancel }: DialogProps) {
  return (
    <div className="cpg-dialog-scrim">
      <div className="cpg-dialog" role="dialog" aria-modal="true">
        <p className="cpg-dialog__msg">{message}</p>
        {input && <input className="cpg-input" defaultValue={input.value} placeholder={input.placeholder} type={input.password ? 'password' : 'text'} />}
        <div className="cpg-dialog__btns">
          <Button variant="secondary" onClick={onCancel}>{cancelLabel}</Button>
          <Button variant={danger ? 'danger' : 'primary'} onClick={onOk}>{okLabel}</Button>
        </div>
      </div>
    </div>
  );
}
