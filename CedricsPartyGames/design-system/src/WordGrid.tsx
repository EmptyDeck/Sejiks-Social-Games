import * as React from 'react';

export interface WordGridProps {
  /** The words, in a fixed order (every player and the big screen must see the same order). */
  words: string[];
  /** Number of columns: 3 on phones, 6 on the big screen. */
  columns?: number;
  /** Index of the secret word to highlight (only after it is revealed to that viewer). */
  secretIndex?: number;
  /** Indexes to outline, e.g. words guessed by caught chameleons. */
  markedIndexes?: number[];
  /** Makes every cell tappable; receives the tapped index. */
  onPick?: (index: number) => void;
  /** The index the viewer already picked. */
  chosenIndex?: number;
  /** Highlight `secretIndex` only while a HoldCard in the same HoldBoard is being pressed (used by HoldBoard). */
  revealOnHold?: boolean;
}

/** The category's word list shown as a grid of cells (a 6×6 board of 36 words in Chameleon). Static by default; pass `onPick` to let players tap one. */
export function WordGrid({ words, columns = 3, secretIndex, markedIndexes = [], onPick, chosenIndex, revealOnHold }: WordGridProps) {
  return (
    <div className="cpg-wordgrid" style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}>
      {words.map((w, i) => {
        const cls = ['cpg-cell', secretIndex === i && (revealOnHold ? 'cpg-cell--secret-pending' : 'cpg-cell--secret'), markedIndexes.includes(i) && 'cpg-cell--marked', chosenIndex === i && 'cpg-cell--chosen'].filter(Boolean).join(' ');
        return onPick
          ? <button key={i} type="button" className={cls} onClick={() => onPick(i)}>{w}</button>
          : <div key={i} className={cls}>{w}</div>;
      })}
    </div>
  );
}
