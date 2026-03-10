/**
 * Theme Context and Provider
 *
 * Provides theme values and palette switching with MMKV persistence.
 */

import React, { createContext, useCallback, useEffect, useMemo, useState } from 'react';
import type { ThemePaletteId } from '../tokens/palettes/types';
import { buildTheme } from '../config';
import { storageService } from '@services/storage/storageService';
import type { Theme, ThemeMode } from '../types';

const VALID_PALETTE_IDS: ThemePaletteId[] = ['base', 'slate', 'indigo', 'forest', 'navy', 'violet'];

function isValidPaletteId(value: string | undefined): value is ThemePaletteId {
  return value != null && VALID_PALETTE_IDS.includes(value as ThemePaletteId);
}

export interface ThemeContextValue {
  theme: Theme;
  mode: ThemeMode;
  paletteId: ThemePaletteId;
  setPalette: (paletteId: ThemePaletteId) => void;
  setMode: (mode: ThemeMode) => void;
  toggleMode: () => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

export interface ThemeProviderProps {
  children: React.ReactNode;
}

export function ThemeProvider({ children }: ThemeProviderProps) {
  const [mode, setModeState] = useState<ThemeMode>('light');
  const [paletteId, setPaletteIdState] = useState<ThemePaletteId>(() => {
    const stored = storageService.getThemePalette();
    return isValidPaletteId(stored) ? stored : 'base';
  });

  useEffect(() => {
    const stored = storageService.getThemePalette();
    if (isValidPaletteId(stored) && stored !== paletteId) {
      setPaletteIdState(stored);
    }
  }, []);

  const setPalette = useCallback((id: ThemePaletteId) => {
    setPaletteIdState(id);
    storageService.setThemePalette(id);
  }, []);

  const setMode = useCallback((m: ThemeMode) => {
    setModeState(m);
  }, []);

  const toggleMode = useCallback(() => {
    setModeState((prev) => (prev === 'light' ? 'dark' : 'light'));
  }, []);

  const theme = useMemo(() => buildTheme(mode, paletteId), [mode, paletteId]);

  const value = useMemo<ThemeContextValue>(
    () => ({
      theme,
      mode,
      paletteId,
      setPalette,
      setMode,
      toggleMode,
    }),
    [theme, mode, paletteId, setPalette, setMode, toggleMode]
  );

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>;
}

export { ThemeContext };
