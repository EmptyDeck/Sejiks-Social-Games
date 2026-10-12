import * as React from 'react';
import { Screen, Button, Card } from '@cedrics/party-ui';

export const PhoneColumn = () => (
  <Screen variant="phone">
    <h2>Choose the habitats</h2>
    <p className="cpg-muted">You are the admin: pick the categories, then begin.</p>
    <Card>Race · Food · Drinks · Games</Card>
    <Button block>Deal the word</Button>
  </Screen>
);
export const CenteredHost = () => (
  <div style={{ height: 260 }}>
    <Screen variant="host" center>
      <h1>Look at your phones</h1>
      <p className="cpg-muted">3 of 5 have checked their secret</p>
    </Screen>
  </div>
);
