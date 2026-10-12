import * as React from 'react';
import { PlayerChip } from './PlayerChip';

export interface SuspectButtonProps { name: string; emoji: string; color?: number; picked?: boolean; /** Optional clue/answer shown on the right. */ clue?: string; onPick?: () => void; }

/** Full-width vote row: tap the player you suspect (or like best). `picked` outlines the current choice. */
export function SuspectButton({ name, emoji, color, picked, clue, onPick }: SuspectButtonProps) {
  return <button type="button" className={['cpg-suspect', picked && 'cpg-suspect--picked'].filter(Boolean).join(' ')} onClick={onPick}><PlayerChip name={name} emoji={emoji} color={color} />{clue && <span className="cpg-suspect__clue">{clue}</span>}</button>;
}
