import * as React from 'react';
import { Dialog } from '@cedrics/party-ui';

export const ConfirmClose = () => <Dialog message="Close this room? Everyone goes back to the start." okLabel="Close room" cancelLabel="Cancel" danger />;
export const EnterPin = () => <Dialog message="Enter your PIN" okLabel="OK" input={{ password: true, placeholder: 'PIN' }} />;
