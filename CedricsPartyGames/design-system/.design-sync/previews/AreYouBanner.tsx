import * as React from 'react';
import { AreYouBanner } from '@cedrics/party-ui';

export const Default = () => <div style={{ maxWidth: 380, padding: 16 }}><AreYouBanner /></div>;
export const Korean = () => <div style={{ maxWidth: 380, padding: 16 }}><AreYouBanner question="세드릭이세요?" yesLabel="네" /></div>;
