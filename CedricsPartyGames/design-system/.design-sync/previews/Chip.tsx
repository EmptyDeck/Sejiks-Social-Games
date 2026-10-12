import * as React from 'react';
import { Chip } from '@cedrics/party-ui';

export const Categories = () => (
  <div className="cpg-chips" style={{ maxWidth: 380, padding: 16 }}>
    <Chip selected>Race</Chip><Chip selected>Food</Chip><Chip selected>Drinks</Chip><Chip>Crime</Chip><Chip selected>Movies</Chip><Chip>Cause of Death</Chip>
  </div>
);
export const ReadOnly = () => <div className="cpg-chips" style={{ padding: 16 }}><Chip selected disabled>Apps</Chip><Chip disabled>Hobbies</Chip></div>;
