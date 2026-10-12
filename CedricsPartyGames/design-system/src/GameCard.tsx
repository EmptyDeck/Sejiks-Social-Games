import * as React from 'react';

export interface GameCardProps {
  emoji: string;
  title: string;
  tagline?: string;
  /** Card background (the game's own theme colour). */
  background?: string;
  /** Title/outline colour (the game's accent). */
  accent?: string;
  selected?: boolean;
  onPick?: () => void;
}

/** One game in the admin's game picker. Each card previews its game's own colours. */
export function GameCard({ emoji, title, tagline, background, accent, selected, onPick }: GameCardProps) {
  const style = { ['--cpg-gc-bg' as string]: background, ['--cpg-gc-accent' as string]: accent } as React.CSSProperties;
  return (
    <button type="button" onClick={onPick} style={style} className={['cpg-gamecard', selected && 'cpg-gamecard--selected'].filter(Boolean).join(' ')}>
      <span className="cpg-gamecard__emoji">{emoji}</span>
      <span><b className="cpg-gamecard__title">{title}</b>{tagline && <small className="cpg-gamecard__tag">{tagline}</small>}</span>
    </button>
  );
}
