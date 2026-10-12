import * as React from 'react';
import { Avatar } from './Avatar';

export interface PlayerChipProps {
  name: string;
  emoji: string;
  color?: number;
  /** Shows the ADMIN badge for the player who controls the game. */
  admin?: boolean;
  /** Dim a player whose phone disconnected. */
  offline?: boolean;
  /** Text for the badge (translate it). Defaults to ADMIN. */
  adminLabel?: string;
}

/** Inline "avatar + name" used in lists, results, vote rows. */
export function PlayerChip({ name, emoji, color = 0, admin, offline, adminLabel = 'ADMIN' }: PlayerChipProps) {
  return (
    <span className={['cpg-who', offline && 'cpg-who--off'].filter(Boolean).join(' ')}>
      <Avatar emoji={emoji} color={color} />
      <b>{name}</b>
      {admin && <span className="cpg-badge">{adminLabel}</span>}
    </span>
  );
}
