/**
 * Color Palettes - Theme variant exports
 */

import type { BaseColorPalette, ThemePaletteId } from './types';
import { basePalette } from './base';
import { slatePalette } from './slate';
import { indigoPalette } from './indigo';
import { forestPalette } from './forest';
import { navyPalette } from './navy';
import { violetPalette } from './violet';

export type { BaseColorPalette, ThemePaletteId } from './types';
export { basePalette } from './base';
export { slatePalette } from './slate';
export { indigoPalette } from './indigo';
export { forestPalette } from './forest';
export { navyPalette } from './navy';
export { violetPalette } from './violet';

export const themePalettes: Record<ThemePaletteId, BaseColorPalette> = {
  base: basePalette,
  slate: slatePalette,
  indigo: indigoPalette,
  forest: forestPalette,
  navy: navyPalette,
  violet: violetPalette,
};
