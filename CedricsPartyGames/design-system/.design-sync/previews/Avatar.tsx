import * as React from 'react';
import { Avatar } from '@cedrics/party-ui';

export const Colors = () => (
  <div className="cpg-row" style={{ padding: 16 }}>
    {['🦎','🐸','🐢','🦜','🐙','🦋','🐞','🦔'].map((e, i) => <Avatar key={i} emoji={e} color={i} />)}
  </div>
);
export const Sizes = () => (
  <div className="cpg-row" style={{ padding: 16, alignItems: 'flex-end' }}>
    <Avatar emoji="🦎" color={3} size="sm" /><Avatar emoji="🦎" color={3} /><Avatar emoji="🦎" color={3} size="xl" />
  </div>
);
