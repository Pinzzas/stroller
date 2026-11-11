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
export const LIFT_MAX_HOLD_MS = 700; // longest the front wheels stay up per press
export const LIFT_TILT_DEGREES = 12; // how far the stroller tilts back while lifted (drawing only)

// Sleep
export const SLEEP_MAX = 100; // full meter
export const SLEEP_START = 100; // sleep when the walk starts
export const SLEEP_JOLT_SMALL = 10; // sleep lost on a small jolt (pothole)
export const SLEEP_JOLT_BIG = 20; // sleep lost on a big jolt (each curb of a crossing)
export const SLEEP_RECOVERY_SLOW = 0.75; // refill per second at slow speed
export const SLEEP_RECOVERY_NORMAL = 0.25; // refill per second at normal speed
export const SLEEP_RECOVERY_BRISK = 0.25; // refill per second at brisk speed
export const SLEEP_RECOVERY_DELAY_MS = 5000; // quiet time after a hit before refilling starts

// Obstacles
export const OBSTACLE_FIRST_X = 1200; // street position of the first obstacle's left edge (past the screen's right edge)
export const CROSSING_CHANCE = 0.25; // chance (0 to 1) that an obstacle is a crossing
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
export const SHUSH_RESTORE = 10; // sleep restored by one Shush
export const SHUSH_COOLDOWN_MS = 45000; // wait after the last charge, before all charges come back
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

// Obstacle mix (potholes are whatever is left over)
export const PIGEON_CHANCE = 0.15; // chance an obstacle is pigeons
export const DOG_CHANCE = 0.15; // chance an obstacle is a dog
export const NEIGHBOUR_CHANCE = 0.15; // chance an obstacle is a neighbour

// Noise damage
export const SLEEP_NOISE_SMALL = 10; // sleep lost on a small noise (pigeons fly off)
export const SLEEP_NOISE_LOUD = 25; // sleep lost on a loud noise (dog barks)

// Pigeons
export const PIGEON_WIDTH = 90; // length of the flock; the wheel must stay slow along it
export const PIGEON_MAX_SAFE_SPEED = 70; // fastest speed that keeps them calm (only slow)
export const PIGEON_COUNT = 3; // birds in a flock (drawing only)
export const PIGEON_BIRD_WIDTH = 16; // one bird's width (drawing only)
export const PIGEON_BIRD_HEIGHT = 12; // one bird's height (drawing only)
export const PIGEON_FLY_SPEED = 150; // how fast a startled flock rises, pixels per second (drawing only)
export const COLOR_PIGEON = 0x9aa3b8; // soft blue-grey
export const PAVEMENT_BACK_Y = 432; // where pigeons stand (back of the pavement, behind the stroller)

// Dog and warning icon
export const DOG_FENCE_WIDTH = 240; // fence length; the wheel must stay brisk along it
export const DOG_FENCE_HEIGHT = 40; // fence height, standing on the pavement top (drawing only)
export const DOG_MIN_SAFE_SPEED = 180; // slowest speed that passes before the dog notices (only brisk)
export const DOG_WIDTH = 40; // dog box width when it pops up (drawing only)
export const DOG_HEIGHT = 30; // dog box height (drawing only)
export const DOG_SHOW_MS = 1500; // how long the dog and WOOF! show after a bark
export const DOG_TEXT_FONT_SIZE = 22; // size of WOOF!
export const COLOR_FENCE = 0xd8b48a; // wooden fence (warm tan)
export const COLOR_DOG = 0xa47551; // dog (soft brown)
export const HEARD_WARNING_DISTANCE = 1000; // street distance ahead of the front wheel at which the icon appears
export const WARNING_ICON_WIDTH = 72; // icon box width
export const WARNING_ICON_HEIGHT = 36; // icon box height
export const WARNING_ICON_Y = 200; // icon box top (sky, above the roofs)
export const COLOR_WARNING_ICON = 0xffd98a; // soft amber
export const DOG_WARNING_TEXT = 'woof?'; // word in the icon

// Neighbour
export const NEIGHBOUR_MIN_SAFE_SPEED = 180; // slowest speed that gets you past with a wave (only brisk)
export const NEIGHBOUR_CHAT_MS = 5000; // how long you are stopped
export const NEIGHBOUR_DRAIN_PER_SEC = 3; // sleep lost per second of chat (15 in total)
export const NEIGHBOUR_WIDTH = 30; // neighbour box width
export const NEIGHBOUR_HEIGHT = 100; // neighbour box height
export const COLOR_NEIGHBOUR = 0x9fcfa6; // soft green
export const NEIGHBOUR_BUBBLE_WIDTH = 260; // speech bubble width
export const NEIGHBOUR_BUBBLE_HEIGHT = 40; // speech bubble height
export const NEIGHBOUR_BUBBLE_GAP = 10; // gap between the neighbour's head and the bubble
export const COLOR_BUBBLE = 0xffffff; // speech bubble (white)
export const NEIGHBOUR_CHAT_TEXT = 'Ooh, is the baby asleep? So...'; // bubble text

// Sleep stages (Light, Deep, Dreamy)
export const SLEEP_STAGE_MS = 60000; // time asleep per stage
export const SLEEP_STAGE_NAMES = ['Light', 'Deep', 'Dreamy']; // stage names (text)
export const SLEEP_STAGE_DAMAGE_CUT = 0.2; // damage cut per stage (Deep x0.8, Dreamy x0.6)
export const OBSTACLE_GAP_LIGHT = 700; // street distance from one obstacle to the next in Light
export const OBSTACLE_GAP_DEEP = 500; // gap in Deep
export const OBSTACLE_GAP_DREAMY = 400; // gap in Dreamy
export const OBSTACLE_PLAN_AHEAD = 1400; // how far ahead of the front wheel the street is planned
