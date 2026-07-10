/**
 * Navigation Ref
 *
 * A global reference to the root NavigationContainer so that code running
 * OUTSIDE the React tree (e.g. a push-notification tap handler fired while the
 * app was backgrounded or quit) can navigate.
 *
 * Attach it to the root <NavigationContainer ref={navigationContainerRef}>.
 */

import { createNavigationContainerRef } from '@react-navigation/native';
import type { RootNavigationParamList } from './helpers/navigationHelpers';

export const navigationContainerRef =
  createNavigationContainerRef<RootNavigationParamList>();

/**
 * Navigate from outside a React component.
 * Safe to call before the container is ready — no-ops until it mounts.
 */
export const navigateFromRef = (
  screen: keyof RootNavigationParamList,
  params?: RootNavigationParamList[keyof RootNavigationParamList]
): boolean => {
  if (!navigationContainerRef.isReady()) {
    return false;
  }

  // The container's navigate() has complex param-list overloads that don't
  // accept a dynamic (screen, params) pair cleanly; cast to invoke it.
  const navigate = navigationContainerRef.navigate as (
    screen: string,
    params?: unknown
  ) => void;
  navigate(screen as string, params);
  return true;
};
