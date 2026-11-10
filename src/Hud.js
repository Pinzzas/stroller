import * as C from './config.js';
import { meterFillWidth, meterLabel } from './logic/sleep.js';

const textColor = '#' + C.COLOR_HUD_TEXT.toString(16).padStart(6, '0');

// The sleep meter (top centre) and the speed label (top left).
export default class Hud {
  constructor(scene) {
    this.graphics = scene.add.graphics();
    const style = { fontFamily: 'sans-serif', fontSize: `${C.HUD_FONT_SIZE}px`, color: textColor };
    this.speedText = scene.add.text(C.HUD_MARGIN, C.HUD_MARGIN, '', style);
    this.shushText = scene.add.text(C.HUD_MARGIN, C.HUD_MARGIN + C.HUD_FONT_SIZE + C.HUD_LINE_GAP, '', style);
    this.sleepText = scene.add.text(C.GAME_WIDTH / 2, 0, '', style).setOrigin(0.5, 0);
  }

  draw(sleep, speedLevel, shushLabelText) {
    const barX = (C.GAME_WIDTH - C.METER_BAR_WIDTH) / 2;
    const barY = C.METER_TOP_Y + C.METER_PADDING;
    const textY = barY + C.METER_BAR_HEIGHT + C.METER_LABEL_GAP;
    const cloudWidth = C.METER_BAR_WIDTH + 2 * C.METER_PADDING;
    const cloudHeight = textY + C.HUD_FONT_SIZE + C.METER_PADDING - C.METER_TOP_Y;

    const g = this.graphics;
    g.clear();
    g.fillStyle(C.COLOR_METER_CLOUD);
    g.fillRect(barX - C.METER_PADDING, C.METER_TOP_Y, cloudWidth, cloudHeight);
    g.fillStyle(C.COLOR_METER_EMPTY);
    g.fillRect(barX, barY, C.METER_BAR_WIDTH, C.METER_BAR_HEIGHT);
    g.fillStyle(C.COLOR_METER_FILL);
    g.fillRect(barX, barY, meterFillWidth(sleep, C.SLEEP_MAX, C.METER_BAR_WIDTH), C.METER_BAR_HEIGHT);

    this.sleepText.setPosition(C.GAME_WIDTH / 2, textY).setText(meterLabel(sleep));
    this.speedText.setText('Speed: ' + speedLevel);
    this.shushText.setText(shushLabelText);
  }
}
