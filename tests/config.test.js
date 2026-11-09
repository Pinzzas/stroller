import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as config from '../src/config.js';

const expected = {
  GAME_WIDTH: 960, GAME_HEIGHT: 540, SPEED_NORMAL: 120, MAX_FRAME_DELTA_MS: 100,
  PAVEMENT_TOP_Y: 420, PAVEMENT_SLAB_WIDTH: 80, PAVEMENT_SEAM_WIDTH: 2,
  HOUSE_SPACING: 240, HOUSE_WIDTH: 180, HOUSE_HEIGHT: 160, WINDOW_SIZE: 40,
  STROLLER_X: 240, STROLLER_GROUND_Y: 450, STROLLER_WIDTH: 90, STROLLER_HEIGHT: 60,
  STROLLER_WHEEL_SIZE: 18, STROLLER_HANDLE_WIDTH: 8, STROLLER_HANDLE_HEIGHT: 40,
  COLOR_SKY: 0xcfe8f5, COLOR_HOUSE: 0xf4d6c6, COLOR_WINDOW: 0xfff6d8,
  COLOR_PAVEMENT: 0xdcd6cc, COLOR_PAVEMENT_SEAM: 0xbcb5aa, COLOR_STROLLER: 0x8e99a6,
  COLOR_WHEEL: 0x5b6672, COLOR_BUILD_LABEL: 0x7a7a7a, BUILD_LABEL_FONT_SIZE: 12,
};

test('AC9 config exports every tuning value with the exact value', () => {
  for (const [name, value] of Object.entries(expected)) {
    assert.ok(name in config, `missing export ${name}`);
    assert.equal(config[name], value, `${name} has wrong value`);
  }
});
