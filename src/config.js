// Every tuning number for the game lives here.

export const GAME_WIDTH = 960; // game picture width in game pixels
export const GAME_HEIGHT = 540; // game picture height in game pixels
export const MAX_FRAME_DELTA_MS = 100; // longest time step in one frame (stops jumps after tab switches)
export const PAVEMENT_TOP_Y = 420; // where the pavement starts (top edge)
export const PAVEMENT_SLAB_WIDTH = 80; // width of one pavement slab (seam to seam)
export const PAVEMENT_SEAM_WIDTH = 2; // width of the darker line between slabs
export const HOUSE_SPACING = 240; // distance from one house's left edge to the next
export const HOUSE_WIDTH = 180; // width of one house
export const HOUSE_HEIGHT = 160; // height of one house (stands on the pavement top)
export const WINDOW_SIZE = 40; // width and height of each house's window
export const STROLLER_X = 240; // left edge of the stroller body
export const STROLLER_GROUND_Y = 450; // where the bottom of the wheels touches the pavement
export const STROLLER_WIDTH = 90; // stroller body width
export const STROLLER_HEIGHT = 60; // stroller body height
export const STROLLER_WHEEL_SIZE = 18; // wheel width and height
export const STROLLER_HANDLE_WIDTH = 8; // handle width (sticks up from the body's left edge)
export const STROLLER_HANDLE_HEIGHT = 40; // handle height above the body
export const COLOR_SKY = 0xcfe8f5; // sky, also the page background
export const COLOR_HOUSE = 0xf4d6c6; // house walls
export const COLOR_WINDOW = 0xfff6d8; // house windows
export const COLOR_PAVEMENT = 0xdcd6cc; // pavement slabs
export const COLOR_PAVEMENT_SEAM = 0xbcb5aa; // lines between slabs
export const COLOR_STROLLER = 0x8e99a6; // stroller body and handle
export const COLOR_WHEEL = 0x5b6672; // wheels
export const COLOR_BUILD_LABEL = 0x7a7a7a; // build label text
export const BUILD_LABEL_FONT_SIZE = 12; // build label text size in game pixels
export const WINDOW_TOP_OFFSET = 30; // gap between the house roof and its window
export const STROLLER_WHEEL_INSET = 10; // how far each wheel sits in from the body's end
export const BUILD_LABEL_MARGIN_X = 6; // build label gap from the right edge
export const BUILD_LABEL_MARGIN_Y = 4; // build label gap from the bottom edge

// Speed
export const SPEED_SLOW = 70; // street speed at slow, pixels per second
export const SPEED_NORMAL = 120; // street speed at normal
export const SPEED_BRISK = 180; // street speed at brisk
export const SPEED_START_LEVEL = 'normal'; // speed when the walk starts

// Lift
export const LIFT_MAX_HOLD_MS = 800; // longest the front wheels stay up per press
export const LIFT_TILT_DEGREES = 12; // how far the stroller tilts back while lifted (drawing only)

// Sleep
export const SLEEP_MAX = 100; // full meter
export const SLEEP_START = 100; // sleep when the walk starts
export const SLEEP_JOLT_SMALL = 10; // sleep lost on a small jolt (pothole)
export const SLEEP_JOLT_BIG = 20; // sleep lost on a big jolt (each curb of a crossing)
export const SLEEP_RECOVERY_SLOW = 3; // refill per second at slow speed
export const SLEEP_RECOVERY_NORMAL = 1; // refill per second at normal speed
export const SLEEP_RECOVERY_BRISK = 1; // refill per second at brisk speed
export const SLEEP_RECOVERY_DELAY_MS = 3000; // quiet time after a hit before refilling starts

// Obstacles
export const OBSTACLE_FIRST_X = 1200; // street position of the first obstacle's left edge (past the screen's right edge)
export const OBSTACLE_SPACING = 900; // street distance from one obstacle to the next
export const CROSSING_CHANCE = 0.35; // chance (0 to 1) that an obstacle is a crossing; otherwise a pothole
export const POTHOLE_WIDTH = 30; // pothole width; also how far the wheel must stay lifted
export const POTHOLE_DEPTH = 10; // pothole height, downward from STROLLER_GROUND_Y (drawing only)
export const COLOR_POTHOLE = 0x4a3b33; // pothole colour (very dark brown)
export const CROSSING_WIDTH = 180; // distance from the down-curb to the up-curb
export const CROSSING_STEP_HEIGHT = 12; // how far the road is below the wheel line (drawing; stroller drop)
export const CROSSING_STRIPE_WIDTH = 20; // width of one zebra stripe
export const CROSSING_STRIPE_SPACING = 36; // left edge to left edge of neighbouring stripes
export const CROSSING_STRIPE_FIRST_OFFSET = 12; // gap from the down-curb to the first stripe
export const COLOR_ROAD = 0x5c6370; // road (dark blue-grey)
export const COLOR_CROSSING_STRIPE = 0xffffff; // zebra stripes (white)
export const COLOR_CURB_FACE = 0x9a948a; // curb-side band above the road (mid stone grey)
export const CURB_MAX_SAFE_SPEED = 70; // fastest street speed (pixels per second) that counts as slowed down at a curb

// Hit feedback
export const HIT_FLASH_MS = 300; // how long the stroller body flashes after a hit
export const COLOR_HIT_FLASH = 0xf2a7a7; // flash colour (soft pink)

// Meter and labels
export const METER_TOP_Y = 16; // top edge of the cloud box
export const METER_BAR_WIDTH = 240; // bar width when full
export const METER_BAR_HEIGHT = 18; // bar height
export const METER_PADDING = 10; // gap between cloud edge and bar/label
export const METER_LABEL_GAP = 6; // gap between bar and the Sleep N text
export const COLOR_METER_CLOUD = 0xffffff; // cloud box
export const COLOR_METER_EMPTY = 0xe6e1ee; // empty part of the bar
export const COLOR_METER_FILL = 0xb7a6e0; // full part of the bar
export const HUD_FONT_SIZE = 16; // text size of Sleep N and Speed
export const HUD_MARGIN = 16; // speed label gap from the top and left edges
export const COLOR_HUD_TEXT = 0x5a5560; // text colour for HUD labels

// Touch buttons (testing aid)
export const TOUCH_BUTTON_SIZE = 80; // width and height of Slower/Faster; height of Lift
export const TOUCH_LIFT_WIDTH = 160; // width of the Lift button
export const TOUCH_BUTTON_MARGIN = 16; // gap from left/right edge and between Slower and Faster
export const TOUCH_BUTTON_BOTTOM_MARGIN = 24; // gap from the bottom edge
export const TOUCH_BUTTON_ALPHA = 0.6; // button see-through-ness (1 = solid)
export const COLOR_TOUCH_BUTTON = 0xffffff; // button colour
export const TOUCH_FONT_SIZE = 18; // button text size

// Shush
export const SHUSH_MAX_CHARGES = 2; // shushes available before the cooldown
export const SHUSH_RESTORE = 15; // sleep restored by one Shush
export const SHUSH_COOLDOWN_MS = 30000; // wait after the last charge, before all charges come back
export const SHUSH_TEXT_MS = 1000; // how long Shhh! shows above the stroller
export const SHUSH_TEXT_FONT_SIZE = 22; // size of the Shhh! text
export const SHUSH_TEXT_GAP = 20; // gap between the top of the stroller body and the bottom of Shhh!
export const HUD_LINE_GAP = 8; // gap between the speed label and the Shush label

// Run end and restart
export const RUN_RESTART_DELAY_MS = 1000; // wait after waking before Walk again appears and works
export const TOUCH_POINTERS = 2; // touch points the game needs (one per thumb)
export const END_PANEL_WIDTH = 360; // end box width (centred on screen)
export const END_PANEL_HEIGHT = 200; // end box height (centred on screen)
export const COLOR_END_PANEL = 0xffffff; // end box colour
export const END_TITLE_FONT_SIZE = 28; // size of "The baby woke up!"
export const END_TITLE_OFFSET_Y = 40; // box top to the centre of the title
export const END_TEXT_FONT_SIZE = 18; // size of "Asleep for m:ss"
export const END_TIME_OFFSET_Y = 80; // box top to the centre of the time line
export const END_BUTTON_WIDTH = 220; // Walk again button width (centred in the box)
export const END_BUTTON_HEIGHT = 56; // Walk again button height
export const END_BUTTON_OFFSET_Y = 120; // box top to the top of the button
export const END_BUTTON_FONT_SIZE = 20; // Walk again text size
export const COLOR_END_BUTTON = 0xb7a6e0; // button colour (same lavender as the meter fill)
