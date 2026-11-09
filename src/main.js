import Phaser from 'phaser';
import { GAME_WIDTH, GAME_HEIGHT, COLOR_SKY } from './config.js';
import StreetScene from './StreetScene.js';

new Phaser.Game({
  type: Phaser.AUTO,
  parent: 'game',
  width: GAME_WIDTH,
  height: GAME_HEIGHT,
  backgroundColor: COLOR_SKY,
  roundPixels: true, // stops edges shimmering while scrolling
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
  },
  scene: [StreetScene],
});
