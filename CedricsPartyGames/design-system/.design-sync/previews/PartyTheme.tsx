import * as React from 'react';
import { PartyTheme, Screen, Button, Card, Banner } from '@cedrics/party-ui';

const Sample = () => (
  <Screen variant="phone">
    <h2>Another round?</h2>
    <Card><b>Every color, font and curve comes from the theme.</b></Card>
    <Banner icon="👉">Ann goes first</Banner>
    <Button block>Deal the word</Button>
  </Screen>
);
export const CartoonParty = () => <PartyTheme theme="cartoon-party"><Sample /></PartyTheme>;
export const OldMoney = () => <PartyTheme theme="old-money"><Sample /></PartyTheme>;
export const NeonJungle = () => <PartyTheme theme="neon-jungle"><Sample /></PartyTheme>;
export const Hackers = () => <PartyTheme theme="hackers"><Sample /></PartyTheme>;
export const Arcade80s = () => <PartyTheme theme="arcade-80s"><Sample /></PartyTheme>;
export const CandyPop = () => <PartyTheme theme="candy-pop"><Sample /></PartyTheme>;
