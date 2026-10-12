import * as React from 'react';
import { OptionRow, Toggle, Stepper } from '@cedrics/party-ui';

export const AdminSetup = () => (
  <div className="cpg-stack" style={{ maxWidth: 400, padding: 16 }}>
    <OptionRow title="Voting on the phones" help="Off = just talk, the admin reveals"><Toggle on /></OptionRow>
    <OptionRow title="Chameleons" help="How many players do not know the word"><Stepper value={1} min={1} max={3} /></OptionRow>
  </div>
);
