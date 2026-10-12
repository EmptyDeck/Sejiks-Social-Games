import * as React from 'react';
import { RoomCode } from '@cedrics/party-ui';

const FakeQr = () => (
  <svg width="180" height="180" viewBox="0 0 9 9" shapeRendering="crispEdges">
    <rect width="9" height="9" fill="#fff" />
    {[[0,0],[1,0],[2,0],[0,1],[2,1],[0,2],[1,2],[2,2],[6,0],[7,0],[8,0],[6,1],[8,1],[6,2],[7,2],[8,2],[0,6],[1,6],[2,6],[0,7],[2,7],[0,8],[1,8],[2,8],[4,4],[5,3],[3,5],[4,6],[6,5],[7,6],[5,7],[4,1],[4,2]].map(([x, y], i) => <rect key={i} x={x} y={y} width="1" height="1" fill="#000" />)}
  </svg>
);
export const SharedLobby = () => <div style={{ padding: 24 }}><RoomCode code="VNDJ" url="node.example.ts.net" qr={<FakeQr />} /></div>;
