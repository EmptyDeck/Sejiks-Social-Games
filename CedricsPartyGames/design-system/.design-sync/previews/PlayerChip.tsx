import * as React from 'react';
import { PlayerChip } from '@cedrics/party-ui';

export const Lineup = () => (
  <div className="cpg-stack" style={{ padding: 16, maxWidth: 300 }}>
    <PlayerChip name="Cedric" emoji="🦎" color={0} admin />
    <PlayerChip name="Ann" emoji="🐸" color={4} />
    <PlayerChip name="Ben" emoji="🐢" color={5} offline />
  </div>
);
