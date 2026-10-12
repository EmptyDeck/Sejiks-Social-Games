import * as React from 'react';
import { HoldCard, HoldCardProps } from './HoldCard';
import { WordGrid } from './WordGrid';

export interface HoldBoardProps extends Omit<HoldCardProps, 'word'> {
  /** The category's words, same order for every player. */
  words: string[];
  /** Index of the secret word (insiders only; omit for the chameleon). While an insider holds the card, that cell lights up. */
  secretIndex?: number;
  /** Grid columns (3 on phones). */
  columns?: number;
}

/**
 * The core Chameleon play screen block: a HoldCard on top of the shared word grid. Insiders see their word highlighted
 * in the grid while they hold; the chameleon's grid never lights up. Everyone sees the same grid, so nobody has a
 * reason to look at their phone more than anyone else.
 */
export function HoldBoard({ words, secretIndex, columns = 3, ...card }: HoldBoardProps) {
  return (
    <div className="cpg-wrap cpg-stack">
      <HoldCard {...card} word={secretIndex !== undefined ? words[secretIndex] : undefined} />
      <WordGrid words={words} columns={columns} secretIndex={secretIndex} revealOnHold />
    </div>
  );
}
