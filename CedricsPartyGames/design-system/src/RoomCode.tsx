import * as React from 'react';

export interface RoomCodeProps {
  /** The 4-letter room code. */
  code: string;
  /** Address players open, without protocol, e.g. party.example.net */
  url?: string;
  /** Intro lines (translate them). */
  goTo?: string; enter?: string;
  /** The QR code image/element (rendered on a white tile). */
  qr?: React.ReactNode;
}

/** The big "go to this address and enter this code" block of the shared lobby screen. */
export function RoomCode({ code, url, goTo = 'On your phone, go to', enter = 'and enter', qr }: RoomCodeProps) {
  return (
    <div className="cpg-roomcode">
      <span className="cpg-roomcode__label">{goTo}</span>
      {url && <span className="cpg-roomcode__url">{url}</span>}
      <span className="cpg-roomcode__label">{enter}</span>
      <span className="cpg-roomcode__code">{code}</span>
      {qr && <div className="cpg-roomcode__qr">{qr}</div>}
    </div>
  );
}
