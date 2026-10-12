import * as React from 'react';

export interface TextFieldProps {
  /** Small label above the field. */
  label?: string;
  value?: string;
  placeholder?: string;
  /** Multi-line answer box (e.g. writing a joke). */
  multiline?: boolean;
  /** Big centered spaced letters, for the 4-letter room code or a PIN. */
  code?: boolean;
  maxLength?: number;
  type?: 'text' | 'password';
  onChange?: (value: string) => void;
  id?: string;
}

/** Text input / textarea with an optional label. Use `code` for the room code and PIN fields. */
export function TextField({ label, value, placeholder, multiline, code, maxLength, type = 'text', onChange, id }: TextFieldProps) {
  const common = {
    id, value, placeholder, maxLength,
    className: ['cpg-input', code && 'cpg-input--code'].filter(Boolean).join(' '),
    onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => onChange?.(e.target.value),
  };
  return (
    <label className="cpg-field">
      {label && <span className="cpg-field__label">{label}</span>}
      {multiline ? <textarea {...common} /> : <input {...common} type={type} autoComplete="off" />}
    </label>
  );
}
