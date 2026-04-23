export const COLORS = {
  TEAL: '#06AA87',
  LIGHT_GREY: '#E4E4E4',
  DARK_GREY: '#7B7B7B',
  STEEL_BLUE: '#91B1BD',
  OFF_WHITE: '#FEFAFB',
  MED_GREY: '#666666',
} as const;

export const BASE_W = 360;
export const BASE_H = 640;

export const PHONE_SHELL = {
  width: 305,
  height: 610,
  radius: 22,
} as const;

export const PHONE_RIM = {
  width: 293,
  height: 574,
  radius: 11,
} as const;

export const PHONE_SCREEN = {
  width: 293,
  height: 578,
  radius: 11,
} as const;

export const TEAL_DOT = {
  size: 5,
  radius: 1.5,
  startX: 96,
  startY: -110,
  landY: 325.6,
} as const;

export const CIRCLE_A = {
  initCX: 96,
  initCY: 325.6,
  initR: 5,

  phase3aTargetCX: 248,
  phase3aTargetR: 400,

  phase3bTargetCX: 174,
  phase3bTargetR: 520,
} as const;

export const CIRCLE_B = {
  initCX: -747,
  initCY: 326,
  initR: 3400,

  phase4TargetCX: 174.5,
  phase4TargetR: 24,

  phase5TargetCX: 334.5,

  phase7TargetCX: 248.525,

  phase8TargetCX: 373.525,
} as const;

export const BASKET = {
  initX: -60,
  targetX: 120.662,
  cy: 299.371,
} as const;

export const CHECK_PATH = {
  seg1Start: { x: 246.67, y: 272.37 },
  midPoint: { x: 254.25, y: 284.37 },
  seg2Start: { x: 261.74, y: 272.45 },
  tailEnd: { x: 254.25, y: 325.92 },
  strokeWidth: 5,
} as const;

export const CIRCLE_C = {
  cx: 180,
  cy: 300,
  initR: 504,
  finalR: 10,
} as const;

export const CARD = {
  width: 180,
  height: 66,
  centerX: 178,
  centerY: 299,
  radius: 4.5,
} as const;

export const PHASE_DELAYS = {
  P1_DROP: 67,
  P2_BOUNCE: 300,
  P3A_EXPLODE: 601,
  P3B_FLOOD: 1270,
  P3A_DURATION: 669,
  P3B_DURATION: 567,
  P4_BALL_ARRIVES: 1337,
  P4_DURATION: 500,
  P5_SLIDE: 1837,
  P5_DURATION: 300,
  P5_HOLD_DURATION: 1203,
  P6_BASKET: 2773,
  P6_DURATION: 117,
  P7_ENTER: 3340,
  P7_DURATION: 567,
  P8_EXIT: 3907,
  P8_DURATION: 1302,
  P8_FADE_START: 5000,
  P8_FADE_DURATION: 200,
  P9_CHECK: 4814,
  P9_DURATION: 160,
  P10_SHRINK: 4974,
  P10_DURATION: 436,
  P10_SQUEEZE_START: 5343,
  P10_SQUEEZE_DURATION: 33,
  P11_CARD: 5243,
  P11_DURATION: 167,
  P1_DURATION: 233,
  P3A_HIDE: 1837,
  CIRCLE_B_OPACITY_START: 1270,
  CIRCLE_B_OPACITY_DURATION: 33,
  TOTAL_DURATION: 5677,
} as const;

export const BRAND_WORD = 'ZUPPLY';
