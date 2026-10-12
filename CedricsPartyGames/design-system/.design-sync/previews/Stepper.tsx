import * as React from 'react';
import { Stepper } from '@cedrics/party-ui';

export const Values = () => <div className="cpg-row" style={{ padding: 16, gap: 28 }}><Stepper value={1} min={1} max={3} /><Stepper value={3} min={1} max={3} /></div>;
