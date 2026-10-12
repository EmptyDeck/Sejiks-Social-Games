import * as React from 'react';
import { Button } from '@cedrics/party-ui';

export const Variants = () => (
  <div className="cpg-stack" style={{ maxWidth: 340, padding: 16 }}>
    <Button block>Deal the word</Button>
    <Button block variant="secondary">Change options</Button>
    <Button block variant="danger">Close room</Button>
    <Button block variant="ghost">Skip</Button>
  </div>
);
export const Small = () => (
  <div className="cpg-row" style={{ padding: 16 }}>
    <Button size="sm" variant="secondary">All</Button>
    <Button size="sm">Next</Button>
  </div>
);
export const Disabled = () => (
  <div style={{ maxWidth: 340, padding: 16 }}><Button block disabled>Everyone's in — start</Button></div>
);
