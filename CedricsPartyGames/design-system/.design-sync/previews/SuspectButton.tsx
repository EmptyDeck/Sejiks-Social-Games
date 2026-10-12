import * as React from 'react';
import { SuspectButton } from '@cedrics/party-ui';

export const VoteList = () => (
  <div className="cpg-stack" style={{ maxWidth: 380, padding: 16 }}>
    <SuspectButton name="Ann" emoji="🐸" color={4} />
    <SuspectButton name="Ben" emoji="🐢" color={5} picked />
    <SuspectButton name="Dana" emoji="🦜" color={2} clue="spicy" />
  </div>
);
