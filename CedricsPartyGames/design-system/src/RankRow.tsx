import * as React from 'react';
import { PlayerChip } from './PlayerChip';

export interface RankRowProps {
  position: number;
  name: string;
  emoji: string;
  color?: number;
  /** Total score. */
  score: number | string;
  /** Points just gained, shown as +N. */
  gain?: number;
  /** Small gray text, e.g. "2 votes". */
  extra?: string;
}

/** One line of a scoreboard / vote tally. The first position is highlighted automatically. */
export function RankRow({ position, name, emoji, color, score, gain, extra }: RankRowProps) {
  return (
    <div className={['cpg-rank', position === 1 && 'cpg-rank--first'].filter(Boolean).join(' ')}>
      <b className="cpg-rank__pos">{position}</b>
      <PlayerChip name={name} emoji={emoji} color={color} />
      <span className="cpg-rank__grow" />
      {extra && <span className="cpg-rank__extra">{extra}</span>}
      {gain ? <b className="cpg-rank__gain">+{gain}</b> : null}
      <b className="cpg-rank__score">{score}</b>
    </div>
  );
}
