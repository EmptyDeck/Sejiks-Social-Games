import * as React from 'react';
import { Button } from './Button';

export interface ToggleProps { on: boolean; onToggle?: () => void; onLabel?: string; offLabel?: string; }

/** ON/OFF switch button (accent color when on). */
export function Toggle({ on, onToggle, onLabel = 'ON', offLabel = 'OFF' }: ToggleProps) {
  return <Button variant="secondary" className={['cpg-toggle', on && 'cpg-toggle--on'].filter(Boolean).join(' ')} onClick={onToggle}>{on ? onLabel : offLabel}</Button>;
}
