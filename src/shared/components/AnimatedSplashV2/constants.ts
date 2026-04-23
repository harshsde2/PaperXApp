/** ms — BootSplash.hide delay (same pattern as v1) */
export const BOOT_SPLASH_HIDE_DELAY = 200;

/** Intro dot start offset from screen left / top (px) */
export const INTRO_DOT_LEFT = 40;
export const INTRO_DOT_TOP = 140;

/** Horizontal offset for “rest” position vs true center (Lottie sits slightly left) */
export const INTRO_DOT_CENTER_BIAS_X = -10;

/** ms — Module 1 leg 1: drop to center (with overshoot settle) */
export const MODULE1_DROP_MS = 380;
/** ms — Module 1 leg 2: slide to right edge while dot grows */
export const MODULE1_SLIDE_MS = 340;

/** Drop: first segment eases toward overshoot; remainder settles to center Y */
export const MODULE1_DROP_OVERSHOOT_PX = 18;
export const MODULE1_DROP_OVERSHOOT_SPLIT = 0.52;

/** Dot scale during slide (1 → max at edge); handoff to radial */
export const DOT_SCALE_AT_REST = 1;
/** ~1/6 screen height feel on tall phones (computed cap in component) */
export const DOT_SCALE_AT_EDGE_MAX = 4;
export const DOT_SCALE_AT_EDGE_MIN = 2.8;

/** Start radial growth this many ms before slide end (continuous bloom) */
export const RADIAL_OVERLAP_MS = 150;

/** Fade intro dot while radial expands (ms) */
export const DOT_FADE_INTO_RADIAL_MS = 130;

/**
 * End `dotX` (left of dot box) so circle clips into right bezel (~frame 21).
 * left = width - INTRO_DOT_SIZE * dotScaleAtEdge * INTRO_DOT_EDGE_INSET_RATIO
 */
export const INTRO_DOT_EDGE_INSET_RATIO = 0.7;

/** Initial radial radius ≈ dot visual radius at handoff (px) */
export const RADIAL_INITIAL_R_MIN = 10;

/** Dev: splash shows only Module 1 + radial bridge, then ends */
export const SPLASH_V2_MODULE1_ONLY = __DEV__ && false;

/** ms — radial disk growth from right edge */
export const RADIAL_EXPAND_DURATION = 820;
/** ms — shrinking white “hole” → cursor dot */
export const HOLE_TO_DOT_DURATION = 420;
/** ms — pause after hole before letters */
export const CURSOR_SETTLE_DURATION = 200;

/** ms — stagger between letter starts */
export const LETTER_STEP_DURATION = 260;
/** ms — logo mark emphasis */
export const LOGO_REVEAL_DURATION = 480;
/** ms — full-screen primary shell → badge */
export const END_CARD_DURATION = 720;
/** ms — overlay fade then callback */
export const OUTRO_FADE_DURATION = 360;

/** ms — fade hole layer out just before letters */
export const HOLE_FADE_BEFORE_LETTERS_MS = 140;

export const INTRO_DOT_SIZE = 14;
export const BRAND_WORD = 'Zupply';
export const LOGO_MARK_SIZE = 52;

/** Final badge size after collapse (px) */
export const BADGE_WIDTH = 288;
export const BADGE_HEIGHT = 108;
