import * as React from 'react';
import { Avatar } from './Avatar';

export interface LobbyBubbleProps {
  name?: string;
  emoji: string;
  color?: number;
  admin?: boolean;
  offline?: boolean;
  /** Text shown while the player has not typed a name yet. */
  placeholder?: string;
  adminLabel?: string;
}

/** Big avatar with the name underneath, for the shared lobby screen (laptop/TV) where players appear as they join. */
export function LobbyBubble({ name, emoji, color = 0, admin, offline, placeholder = 'Typing…', adminLabel = 'ADMIN' }: LobbyBubbleProps) {
  return (
    <div className={['cpg-bubble', offline && 'cpg-bubble--off'].filter(Boolean).join(' ')}>
      <Avatar emoji={emoji} color={color} size="xl" />
      <span>{name || <i className="cpg-muted">{placeholder}</i>}</span>
      {admin && <span className="cpg-badge">{adminLabel}</span>}
    </div>
  );
}
