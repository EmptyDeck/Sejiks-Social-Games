import * as React from 'react';
import { LobbyBubble } from '@cedrics/party-ui';

export const Joining = () => (
  <div className="cpg-row" style={{ padding: 24, gap: 28 }}>
    <LobbyBubble name="Cedric" emoji="🦎" color={0} admin />
    <LobbyBubble name="Ann" emoji="🐸" color={4} />
    <LobbyBubble name="Ben" emoji="🐢" color={5} offline />
    <LobbyBubble emoji="🦜" color={2} />
  </div>
);
