import { test } from 'node:test';
import assert from 'node:assert/strict';
import * as config from '../src/config.js';

const expected = {
  SPEED_SLOW: 70, SPEED_NORMAL: 120, SPEED_BRISK: 180, SPEED_START_LEVEL: 'normal',
  LIFT_MAX_HOLD_MS: 800, LIFT_TILT_DEGREES: 12,
  SLEEP_MAX: 100, SLEEP_START: 100, SLEEP_JOLT_SMALL: 10, SLEEP_RECOVERY_SLOW: 3,
  SLEEP_RECOVERY_NORMAL: 1, SLEEP_RECOVERY_BRISK: 1, SLEEP_RECOVERY_DELAY_MS: 3000,
  TEST_BUMP_FIRST_X: 1200, TEST_BUMP_SPACING: 1080, TEST_BUMP_WIDTH: 40, TEST_BUMP_HEIGHT: 12,
  COLOR_TEST_BUMP: 0x8a8178,
  HIT_FLASH_MS: 300, COLOR_HIT_FLASH: 0xf2a7a7,
  METER_TOP_Y: 16, METER_BAR_WIDTH: 240, METER_BAR_HEIGHT: 18, METER_PADDING: 10,
  METER_LABEL_GAP: 6, COLOR_METER_CLOUD: 0xffffff, COLOR_METER_EMPTY: 0xe6e1ee,
  COLOR_METER_FILL: 0xb7a6e0, HUD_FONT_SIZE: 16, HUD_MARGIN: 16, COLOR_HUD_TEXT: 0x5a5560,
  TOUCH_BUTTON_SIZE: 80, TOUCH_LIFT_WIDTH: 160, TOUCH_BUTTON_MARGIN: 16,
  TOUCH_BUTTON_BOTTOM_MARGIN: 24, TOUCH_BUTTON_ALPHA: 0.6, COLOR_TOUCH_BUTTON: 0xffffff,
  TOUCH_FONT_SIZE: 18,
};

test('W2 AC20 config exports every new tuning value with the exact value', () => {
  for (const [name, value] of Object.entries(expected)) {
    assert.ok(name in config, `missing export ${name}`);
    assert.equal(config[name], value, `${name} has wrong value`);
  }
});

test('W2 AC20 STREET_SCROLL_SPEED is gone', () => {
  assert.ok(!('STREET_SCROLL_SPEED' in config));
});
