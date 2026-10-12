import * as React from 'react';
import { GameCard } from '@cedrics/party-ui';

export const Picker = () => (
  <div className="cpg-stack" style={{ maxWidth: 400, padding: 16 }}>
    <GameCard emoji="🦎" title="Chameleon" tagline="One of you has no idea what the word is." background="#06140d" accent="#b6ff3b" selected />
    <GameCard emoji="🥂" title="Gilded Takes" tagline="Answer the prompt. Vote for the wittiest." background="#0f1b2d" accent="#c9a24b" />
    <GameCard emoji="🕵️" title="Spy Poll" tagline="Guess what percent of people do it." background="#0e1a1f" accent="#f2c14e" />
  </div>
);
