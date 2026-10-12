import * as React from 'react';
import { TallyChip } from '@cedrics/party-ui';

export const VoteTally = () => (
  <div className="cpg-row" style={{ padding: 16, maxWidth: 420 }}>
    <TallyChip name="Ann" emoji="🐸" color={4} count={1} />
    <TallyChip name="Ben" emoji="🐢" color={5} count={3} mark />
    <TallyChip name="Cedric" emoji="🦎" color={0} count={0} />
    <TallyChip name="Dana" emoji="🦜" color={2} count={2} />
  </div>
);
