import * as React from 'react';
import { WordGrid } from '@cedrics/party-ui';

const words = ['Spear','Rope','Slingshot','Brick','Rifle','Catapult','Chainsaw','Crossbow','Net','Spike','Trap','Pistol','Stick','Whip','Axe','Hammer','Shotgun','Shield','Knife','Bow','Mace','Grenade','Trident','Dagger','Hook','Blade','Bat','Cannon','Swordfish','Bomb','Arrow','Club','Rock','Sword','Boomerang','Gun'];
export const PhoneThreeColumns = () => <div style={{ maxWidth: 380, padding: 12 }}><WordGrid words={words.slice(0, 18)} columns={3} /></div>;
export const BigScreenSixColumns = () => <div style={{ padding: 12 }}><WordGrid words={words} columns={6} /></div>;
export const RevealedResult = () => <div style={{ padding: 12 }}><WordGrid words={words} columns={6} secretIndex={18} markedIndexes={[0]} /></div>;
export const PickAGuess = () => <div style={{ maxWidth: 380, padding: 12 }}><WordGrid words={words.slice(0, 12)} columns={3} onPick={() => {}} chosenIndex={4} /></div>;
