import * as React from 'react';
import { HoldBoard } from '@cedrics/party-ui';

const words = ['Spear','Rope','Slingshot','Brick','Rifle','Catapult','Chainsaw','Crossbow','Net','Spike','Trap','Pistol','Stick','Whip','Axe','Hammer','Shotgun','Shield','Knife','Bow','Mace','Grenade','Trident','Dagger','Hook','Blade','Bat','Cannon','Swordfish','Bomb','Arrow','Club','Rock','Sword','Boomerang','Gun'];
export const InsiderHolding = () => <div style={{ maxWidth: 380, padding: 12 }}><HoldBoard role="insider" words={words.slice(0, 18)} secretIndex={12} revealed /></div>;
export const ChameleonView = () => <div style={{ maxWidth: 380, padding: 12 }}><HoldBoard role="chameleon" words={words.slice(0, 18)} /></div>;
