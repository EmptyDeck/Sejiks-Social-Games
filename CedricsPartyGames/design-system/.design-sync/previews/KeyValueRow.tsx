import * as React from 'react';
import { KeyValueRow, PlayerChip } from '@cedrics/party-ui';

export const ResultSummary = () => (
  <div style={{ maxWidth: 420, padding: 16 }}>
    <KeyValueRow label="The chameleon"><PlayerChip name="Ben" emoji="🐢" color={5} /></KeyValueRow>
    <KeyValueRow label="The word">Knife</KeyValueRow>
    <KeyValueRow label="Their guess">Spear</KeyValueRow>
  </div>
);
