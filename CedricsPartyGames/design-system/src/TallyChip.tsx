import * as React from 'react';
import { PlayerChip } from './PlayerChip';

export interface TallyChipProps { name: string; emoji: string; color?: number; count: number; /** Marks this player (e.g. the chameleon) with an outline and a 🦎. */ mark?: boolean; }

/** Compact "player + vote count" pill. Many fit on one screen, so it scales to large groups. */
export function TallyChip({ name, emoji, color, count, mark }: TallyChipProps) {
  return <span className={['cpg-tally', mark && 'cpg-tally--mark'].filter(Boolean).join(' ')}><PlayerChip name={name} emoji={emoji} color={color} /><b>{count}</b>{mark && <span>🦎</span>}</span>;
}
