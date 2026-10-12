import * as React from 'react';
import { RankRow } from '@cedrics/party-ui';

export const Scoreboard = () => (
  <div className="cpg-stack" style={{ maxWidth: 400, padding: 16 }}>
    <RankRow position={1} name="Ann" emoji="🐸" color={4} score={450} gain={150} extra="3 votes" />
    <RankRow position={2} name="Cedric" emoji="🦎" color={0} score={300} gain={100} />
    <RankRow position={3} name="Ben" emoji="🐢" color={5} score={100} />
  </div>
);
