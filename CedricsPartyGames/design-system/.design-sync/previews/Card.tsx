import * as React from 'react';
import { Card } from '@cedrics/party-ui';

export const Plain = () => <div style={{ maxWidth: 360, padding: 16 }}><Card>“The butler was in the wine cellar all along.”</Card></div>;
export const Winner = () => <div style={{ maxWidth: 360, padding: 16 }}><Card accent><b>“The butler did it”</b><div className="cpg-muted cpg-small">3 votes · +300</div></Card></div>;
