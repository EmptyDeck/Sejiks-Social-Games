import * as React from 'react';
import { HoldCard } from '@cedrics/party-ui';

export const InsiderBeforeHolding = () => <div style={{ maxWidth: 360, padding: 16 }}><HoldCard role="insider" word="Knife" /></div>;
export const InsiderHolding = () => <div style={{ maxWidth: 360, padding: 16 }}><HoldCard role="insider" word="Knife" revealed /></div>;
export const ChameleonHolding = () => <div style={{ maxWidth: 360, padding: 16 }}><HoldCard role="chameleon" revealed /></div>;
