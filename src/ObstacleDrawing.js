import * as C from './config.js';
import { isChatting } from './logic/chat.js';

const textColor = '#' + C.COLOR_HUD_TEXT.toString(16).padStart(6, '0');
// Top of the road in a crossing (worked out from the wheel line)
const ROAD_TOP_Y = C.STROLLER_GROUND_Y + C.CROSSING_STEP_HEIGHT;

// Draws the street obstacles (placeholder shapes). It only reads the scene's state; it never changes it.
// The scene fields used: lastFlappedPigeons, msSinceFlap, lastBarkedDog, msSinceBark, chatIndex, chat.
export default class ObstacleDrawing {
  constructor(scene) {
    this.scene = scene;
    this.dogWord = scene.add
      .text(0, 0, 'WOOF!', { fontFamily: 'sans-serif', fontSize: `${C.DOG_TEXT_FONT_SIZE}px`, color: textColor })
      .setOrigin(0.5, 1)
      .setVisible(false);
    this.chatWord = scene.add
      .text(0, 0, C.NEIGHBOUR_CHAT_TEXT, { fontFamily: 'sans-serif', fontSize: `${C.HUD_FONT_SIZE}px`, color: textColor })
      .setOrigin(0.5)
      .setVisible(false);
  }

  // Call once at the start of each frame, before drawing the obstacles.
  startFrame() {
    this.dogWord.setVisible(false);
    this.chatWord.setVisible(false);
  }

  // Draw one obstacle of the given kind with its left edge at screen x.
  draw(g, kind, k, x) {
    if (kind === 'crossing') {
      this.drawCrossing(g, x);
    } else if (kind === 'pigeons') {
      this.drawPigeons(g, k, x);
    } else if (kind === 'dog') {
      this.drawFence(g, k, x);
    } else if (kind === 'neighbour') {
      this.drawNeighbour(g, k, x);
    } else {
      g.fillStyle(C.COLOR_POTHOLE);
      g.fillRect(x, C.STROLLER_GROUND_Y, C.POTHOLE_WIDTH, C.POTHOLE_DEPTH);
    }
  }

  // Three birds at the back of the pavement; after flying off they rise and leave the screen.
  drawPigeons(g, k, x) {
    const s = this.scene;
    if (k < s.lastFlappedPigeons) return; // an earlier flock that already flew off
    let rise = 0;
    if (k === s.lastFlappedPigeons) rise = (C.PIGEON_FLY_SPEED * s.msSinceFlap) / 1000;
    const bottom = C.PAVEMENT_BACK_Y - rise;
    if (bottom + C.PIGEON_BIRD_HEIGHT < 0) return; // flown off the top
    g.fillStyle(C.COLOR_PIGEON);
    const gap = (C.PIGEON_WIDTH - C.PIGEON_BIRD_WIDTH) / (C.PIGEON_COUNT - 1);
    for (let i = 0; i < C.PIGEON_COUNT; i++) {
      g.fillRect(x + i * gap, bottom - C.PIGEON_BIRD_HEIGHT, C.PIGEON_BIRD_WIDTH, C.PIGEON_BIRD_HEIGHT);
    }
  }

  // A tall green box at the back of the pavement; while chatting, a speech bubble above.
  drawNeighbour(g, k, x) {
    const s = this.scene;
    const top = C.PAVEMENT_BACK_Y - C.NEIGHBOUR_HEIGHT;
    g.fillStyle(C.COLOR_NEIGHBOUR);
    g.fillRect(x, top, C.NEIGHBOUR_WIDTH, C.NEIGHBOUR_HEIGHT);
    if (k === s.chatIndex && isChatting(s.chat)) {
      const centreX = x + C.NEIGHBOUR_WIDTH / 2;
      const bubbleTop = top - C.NEIGHBOUR_BUBBLE_GAP - C.NEIGHBOUR_BUBBLE_HEIGHT;
      g.fillStyle(C.COLOR_BUBBLE);
      g.fillRect(centreX - C.NEIGHBOUR_BUBBLE_WIDTH / 2, bubbleTop, C.NEIGHBOUR_BUBBLE_WIDTH, C.NEIGHBOUR_BUBBLE_HEIGHT);
      this.chatWord.setPosition(centreX, bubbleTop + C.NEIGHBOUR_BUBBLE_HEIGHT / 2).setVisible(true);
    }
  }

  // The fence; after a bark the dog pops up over it with WOOF! above.
  drawFence(g, k, x) {
    const s = this.scene;
    const fenceTop = C.PAVEMENT_TOP_Y - C.DOG_FENCE_HEIGHT;
    g.fillStyle(C.COLOR_FENCE);
    g.fillRect(x, fenceTop, C.DOG_FENCE_WIDTH, C.DOG_FENCE_HEIGHT);
    if (k === s.lastBarkedDog && s.msSinceBark < C.DOG_SHOW_MS) {
      const dogX = x + (C.DOG_FENCE_WIDTH - C.DOG_WIDTH) / 2;
      const dogTop = fenceTop - C.DOG_HEIGHT;
      g.fillStyle(C.COLOR_DOG);
      g.fillRect(dogX, dogTop, C.DOG_WIDTH, C.DOG_HEIGHT);
      this.dogWord.setPosition(x + C.DOG_FENCE_WIDTH / 2, dogTop).setVisible(true);
    }
  }

  // Curb-side band, road and zebra stripes, starting at screen x.
  drawCrossing(g, x) {
    g.fillStyle(C.COLOR_CURB_FACE);
    g.fillRect(x, C.PAVEMENT_TOP_Y, C.CROSSING_WIDTH, ROAD_TOP_Y - C.PAVEMENT_TOP_Y);
    g.fillStyle(C.COLOR_ROAD);
    g.fillRect(x, ROAD_TOP_Y, C.CROSSING_WIDTH, C.GAME_HEIGHT - ROAD_TOP_Y);
    g.fillStyle(C.COLOR_CROSSING_STRIPE);
    for (
      let offset = C.CROSSING_STRIPE_FIRST_OFFSET;
      offset + C.CROSSING_STRIPE_WIDTH <= C.CROSSING_WIDTH;
      offset += C.CROSSING_STRIPE_SPACING
    ) {
      g.fillRect(x + offset, ROAD_TOP_Y, C.CROSSING_STRIPE_WIDTH, C.GAME_HEIGHT - ROAD_TOP_Y);
    }
  }
}
