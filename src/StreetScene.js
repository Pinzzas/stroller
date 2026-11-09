import Phaser from 'phaser';
import * as C from './config.js';
import { clampDeltaMs, advanceScroll, tileXPositions } from './logic/scroll.js';

// Set by Vite at build time (see vite.config.js).
const BUILD_LABEL = typeof __BUILD_LABEL__ === 'string' ? __BUILD_LABEL__ : 'build dev';

export default class StreetScene extends Phaser.Scene {
  constructor() {
    super('StreetScene');
  }

  create() {
    this.scroll = 0;
    this.street = this.add.graphics(); // houses and pavement, redrawn every frame
    this.drawStroller();

    this.add
      .text(C.GAME_WIDTH - C.BUILD_LABEL_MARGIN_X, C.GAME_HEIGHT - C.BUILD_LABEL_MARGIN_Y, BUILD_LABEL, {
        fontFamily: 'sans-serif',
        fontSize: `${C.BUILD_LABEL_FONT_SIZE}px`,
        color: '#' + C.COLOR_BUILD_LABEL.toString(16).padStart(6, '0'),
      })
      .setOrigin(1, 1);
  }

  update(time, deltaMs) {
    const step = clampDeltaMs(deltaMs, C.MAX_FRAME_DELTA_MS);
    this.scroll = advanceScroll(this.scroll, C.STREET_SCROLL_SPEED, step);
    this.drawStreet();
  }

  drawStreet() {
    const g = this.street;
    g.clear();

    // Houses
    const houseTop = C.PAVEMENT_TOP_Y - C.HOUSE_HEIGHT;
    for (const houseX of tileXPositions(this.scroll, C.HOUSE_SPACING, C.GAME_WIDTH)) {
      const x = Math.round(houseX); // whole pixels so edges don't shimmer
      g.fillStyle(C.COLOR_HOUSE);
      g.fillRect(x, houseTop, C.HOUSE_WIDTH, C.HOUSE_HEIGHT);
      g.fillStyle(C.COLOR_WINDOW);
      g.fillRect(
        x + (C.HOUSE_WIDTH - C.WINDOW_SIZE) / 2,
        houseTop + C.WINDOW_TOP_OFFSET,
        C.WINDOW_SIZE,
        C.WINDOW_SIZE
      );
    }

    // Pavement: one big strip, then a seam at the start of each slab
    g.fillStyle(C.COLOR_PAVEMENT);
    g.fillRect(0, C.PAVEMENT_TOP_Y, C.GAME_WIDTH, C.GAME_HEIGHT - C.PAVEMENT_TOP_Y);
    g.fillStyle(C.COLOR_PAVEMENT_SEAM);
    for (const slabX of tileXPositions(this.scroll, C.PAVEMENT_SLAB_WIDTH, C.GAME_WIDTH)) {
      const x = Math.round(slabX);
      g.fillRect(x, C.PAVEMENT_TOP_Y, C.PAVEMENT_SEAM_WIDTH, C.GAME_HEIGHT - C.PAVEMENT_TOP_Y);
    }
  }

  drawStroller() {
    const g = this.add.graphics();
    const bodyBottom = C.STROLLER_GROUND_Y - C.STROLLER_WHEEL_SIZE;
    const bodyTop = bodyBottom - C.STROLLER_HEIGHT;

    g.fillStyle(C.COLOR_STROLLER);
    g.fillRect(C.STROLLER_X, bodyTop, C.STROLLER_WIDTH, C.STROLLER_HEIGHT); // body
    g.fillRect(C.STROLLER_X, bodyTop - C.STROLLER_HANDLE_HEIGHT, C.STROLLER_HANDLE_WIDTH, C.STROLLER_HANDLE_HEIGHT); // handle

    g.fillStyle(C.COLOR_WHEEL);
    g.fillRect(C.STROLLER_X + C.STROLLER_WHEEL_INSET, bodyBottom, C.STROLLER_WHEEL_SIZE, C.STROLLER_WHEEL_SIZE);
    g.fillRect(
      C.STROLLER_X + C.STROLLER_WIDTH - C.STROLLER_WHEEL_INSET - C.STROLLER_WHEEL_SIZE,
      bodyBottom,
      C.STROLLER_WHEEL_SIZE,
      C.STROLLER_WHEEL_SIZE
    );
  }
}
