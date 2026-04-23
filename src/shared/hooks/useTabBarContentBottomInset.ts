import { useContext } from 'react';
import { BottomTabBarHeightContext } from '@react-navigation/bottom-tabs';

/** Extra bottom space for scroll content so the last items clear the bar; scroll view still draws under the floating bar. */
export function useTabBarContentBottomInset(): number {
  return useContext(BottomTabBarHeightContext) ?? 0;
}
