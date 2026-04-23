import { createContext, useContext } from 'react';

/** Measured height of the floating glass dashboard header (safe area + row). Scroll content uses this as paddingTop. */
export const DashboardHeaderHeightContext = createContext<number>(100);

export function useDashboardHeaderHeight(): number {
  return useContext(DashboardHeaderHeightContext);
}
