import * as React from 'react';

export interface AvatarProps {
  /** The icon: a single emoji (every player picks one of 24 per game). */
  emoji: string;
  /** Player color slot 0–11; each player gets a different one. */
  color?: number;
  size?: 'sm' | 'md' | 'xl';
  /** Plays the little "honk" bounce (used when a player taps the lobby noise button). */
  honk?: boolean;
}

/** Round colored player icon. Always pair with the player's name (see PlayerChip). */
export function Avatar({ emoji, color = 0, size = 'md', honk }: AvatarProps) {
  return <span className={['cpg-avatar', `cpg-pc${color % 12}`, size !== 'md' && `cpg-avatar--${size}`, honk && 'cpg-avatar--honk'].filter(Boolean).join(' ')}>{emoji}</span>;
}
