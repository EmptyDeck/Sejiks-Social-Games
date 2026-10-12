import * as React from 'react';
import { Button } from './Button';

export interface StepperProps { value: number; min?: number; max?: number; onChange?: (value: number) => void; }

/** − 1 + control for a small whole number, e.g. how many chameleons. */
export function Stepper({ value, min = 0, max = 99, onChange }: StepperProps) {
  return (
    <div className="cpg-stepper">
      <Button variant="secondary" size="sm" disabled={value <= min} onClick={() => onChange?.(value - 1)}>−</Button>
      <b className="cpg-stepper__n">{value}</b>
      <Button variant="secondary" size="sm" disabled={value >= max} onClick={() => onChange?.(value + 1)}>+</Button>
    </div>
  );
}
