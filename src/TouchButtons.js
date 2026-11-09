import * as C from './config.js';

// Three plain on-screen buttons for playtesting on a phone (a testing aid, not a v1 feature).
// Calls onSlower() / onFaster() on tap. isLiftHeld() says whether Lift is being held.
export default class TouchButtons {
  constructor(scene, onSlower, onFaster) {
    this.liftPointerId = null; // which finger or mouse is holding Lift (null = nobody)
    const y = C.GAME_HEIGHT - C.TOUCH_BUTTON_BOTTOM_MARGIN - C.TOUCH_BUTTON_SIZE;
    const slowerX = C.TOUCH_BUTTON_MARGIN;
    const fasterX = slowerX + C.TOUCH_BUTTON_SIZE + C.TOUCH_BUTTON_MARGIN;
    const liftX = C.GAME_WIDTH - C.TOUCH_BUTTON_MARGIN - C.TOUCH_LIFT_WIDTH;

    scene.input.addPointer(1); // lets two fingers work at once

    const slower = this.makeButton(scene, slowerX, y, C.TOUCH_BUTTON_SIZE, 'Slower');
    slower.on('pointerdown', onSlower);
    const faster = this.makeButton(scene, fasterX, y, C.TOUCH_BUTTON_SIZE, 'Faster');
    faster.on('pointerdown', onFaster);

    const lift = this.makeButton(scene, liftX, y, C.TOUCH_LIFT_WIDTH, 'Lift (hold)');
    lift.on('pointerdown', (pointer) => {
      if (this.liftPointerId === null) this.liftPointerId = pointer.id; // first finger keeps it
    });
    // Only the finger that is holding Lift can let it go (also when released off the button).
    lift.on('pointerout', (pointer) => this.releaseIfHolding(pointer)); // sliding off counts as letting go
    scene.input.on('pointerup', (pointer) => this.releaseIfHolding(pointer));
    scene.input.on('gameout', () => this.release());
  }

  releaseIfHolding(pointer) {
    if (pointer.id === this.liftPointerId) this.liftPointerId = null;
  }

  isLiftHeld() {
    return this.liftPointerId !== null;
  }

  // Forget any held button (used when the tab or app is left).
  release() {
    this.liftPointerId = null;
  }

  makeButton(scene, x, y, width, label) {
    const box = scene.add
      .rectangle(x, y, width, C.TOUCH_BUTTON_SIZE, C.COLOR_TOUCH_BUTTON, C.TOUCH_BUTTON_ALPHA)
      .setOrigin(0, 0)
      .setInteractive();
    scene.add
      .text(x + width / 2, y + C.TOUCH_BUTTON_SIZE / 2, label, {
        fontFamily: 'sans-serif',
        fontSize: `${C.TOUCH_FONT_SIZE}px`,
        color: '#' + C.COLOR_HUD_TEXT.toString(16).padStart(6, '0'),
      })
      .setOrigin(0.5, 0.5);
    return box;
  }
}
