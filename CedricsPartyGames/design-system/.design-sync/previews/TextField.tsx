import * as React from 'react';
import { TextField } from '@cedrics/party-ui';

export const Name = () => <div style={{ maxWidth: 340, padding: 16 }}><TextField label="Your name" value="Cedric" maxLength={14} /></div>;
export const RoomCode = () => <div style={{ maxWidth: 340, padding: 16 }}><TextField code maxLength={4} value="ABCD" /></div>;
export const Answer = () => <div style={{ maxWidth: 340, padding: 16 }}><TextField label="Your answer" multiline placeholder="Be witty…" /></div>;
