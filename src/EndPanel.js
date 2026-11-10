import * as C from './config.js';

const textColor = '#' + C.COLOR_HUD_TEXT.toString(16).padStart(6, '0');

// The "baby woke up" box. show() draws the box and texts; showButton() adds Walk again.
// Everything it creates is destroyed by Phaser when the scene restarts.
export default class EndPanel {
  constructor(scene, onRestart) {
    this.scene = scene;
    this.onRestart = onRestart;
    this.hasButton = false;
  }

  show(timeText) {
    const scene = this.scene;
    const left = (C.GAME_WIDTH - C.END_PANEL_WIDTH) / 2;
    const top = (C.GAME_HEIGHT - C.END_PANEL_HEIGHT) / 2;
    this.left = left;
    this.top = top;
    scene.add.rectangle(left, top, C.END_PANEL_WIDTH, C.END_PANEL_HEIGHT, C.COLOR_END_PANEL).setOrigin(0, 0);
    this.addText(C.GAME_WIDTH / 2, top + C.END_TITLE_OFFSET_Y, 'The baby woke up!', C.END_TITLE_FONT_SIZE);
    this.addText(C.GAME_WIDTH / 2, top + C.END_TIME_OFFSET_Y, timeText, C.END_TEXT_FONT_SIZE);
  }

  showButton() {
    if (this.hasButton) return;
    this.hasButton = true;
    const x = (C.GAME_WIDTH - C.END_BUTTON_WIDTH) / 2;
    const y = this.top + C.END_BUTTON_OFFSET_Y;
    this.scene.add
      .rectangle(x, y, C.END_BUTTON_WIDTH, C.END_BUTTON_HEIGHT, C.COLOR_END_BUTTON)
      .setOrigin(0, 0)
      .setInteractive()
      .on('pointerdown', this.onRestart);
    this.addText(C.GAME_WIDTH / 2, y + C.END_BUTTON_HEIGHT / 2, 'Walk again', C.END_BUTTON_FONT_SIZE);
  }

  addText(x, y, text, fontSize) {
    this.scene.add
      .text(x, y, text, { fontFamily: 'sans-serif', fontSize: `${fontSize}px`, color: textColor })
      .setOrigin(0.5, 0.5);
  }
}
