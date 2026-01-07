/**
 * Navigation Helpers
 * 
 * Type-safe navigation utility functions for React Navigation.
 * Provides common navigation operations with proper TypeScript support.
 */

import { NavigationProp, CommonActions, StackActions } from '@react-navigation/native';
import { AuthStackParamList } from '../AuthStackNavigator';
import { MainStackParamList } from '../MainNavigator';

// Combined navigation param list for type safety
export type RootNavigationParamList = AuthStackParamList & MainStackParamList;

// Navigation prop type
export type RootNavigationProp = NavigationProp<RootNavigationParamList>;

/**
 * Navigation Helper Class
 * Provides type-safe navigation methods
 */
export class NavigationHelper {
  private navigation: RootNavigationProp;

  constructor(navigation: RootNavigationProp) {
    this.navigation = navigation;
  }

  /**
   * Navigate to a screen
   * @param screenName - Name of the screen to navigate to
   * @param params - Optional parameters to pass to the screen
   */
  navigate<RouteName extends keyof RootNavigationParamList>(
    screenName: RouteName,
    params?: RootNavigationParamList[RouteName] extends undefined
      ? undefined
      : RootNavigationParamList[RouteName]
  ): void {
    if (params === undefined) {
      this.navigation.navigate(screenName as any);
    } else {
      this.navigation.navigate(screenName as any, params as any);
    }
  }

  /**
   * Push a new screen onto the stack
   * @param screenName - Name of the screen to push
   * @param params - Optional parameters to pass to the screen
   */
  push<RouteName extends keyof RootNavigationParamList>(
    screenName: RouteName,
    params?: RootNavigationParamList[RouteName] extends undefined
      ? undefined
      : RootNavigationParamList[RouteName]
  ): void {
    if (params === undefined) {
      this.navigation.dispatch(StackActions.push(screenName as any));
    } else {
      this.navigation.dispatch(StackActions.push(screenName as any, params as any));
    }
  }

  /**
   * Replace the current screen with a new one
   * @param screenName - Name of the screen to replace with
   * @param params - Optional parameters to pass to the screen
   */
  replace<RouteName extends keyof RootNavigationParamList>(
    screenName: RouteName,
    params?: RootNavigationParamList[RouteName] extends undefined
      ? undefined
      : RootNavigationParamList[RouteName]
  ): void {
    if (params === undefined) {
      this.navigation.dispatch(StackActions.replace(screenName as any));
    } else {
      this.navigation.dispatch(StackActions.replace(screenName as any, params as any));
    }
  }

  /**
   * Reset the navigation state to a new state
   * @param routes - Array of routes to set as the new navigation state
   */
  reset(routes: Array<{ name: keyof RootNavigationParamList; params?: any }>): void {
    const resetState = CommonActions.reset({
      index: routes.length - 1,
      routes: routes.map((route) => ({
        name: route.name as string,
        params: route.params,
      })) as any,
    });
    this.navigation.dispatch(resetState);
  }

  /**
   * Reset navigation to a single screen
   * @param screenName - Name of the screen to reset to
   * @param params - Optional parameters to pass to the screen
   */
  resetTo<RouteName extends keyof RootNavigationParamList>(
    screenName: RouteName,
    params?: RootNavigationParamList[RouteName] extends undefined
      ? undefined
      : RootNavigationParamList[RouteName]
  ): void {
    this.reset([{ name: screenName, params: params as any }]);
  }

  /**
   * Go back to the previous screen
   */
  goBack(): void {
    if (this.navigation.canGoBack()) {
      this.navigation.goBack();
    }
  }

  /**
   * Check if navigation can go back
   * @returns true if navigation can go back, false otherwise
   */
  canGoBack(): boolean {
    return this.navigation.canGoBack();
  }

  /**
   * Pop a specific number of screens from the stack
   * @param count - Number of screens to pop (default: 1)
   */
  pop(count: number = 1): void {
    this.navigation.dispatch(StackActions.pop(count));
  }

  /**
   * Pop to top of the stack
   */
  popToTop(): void {
    this.navigation.dispatch(StackActions.popToTop());
  }

  /**
   * Get current route name
   * @returns Current route name or undefined
   */
  getCurrentRouteName(): string | undefined {
    const state = this.navigation.getState();
    const route = state.routes[state.index];
    return route?.name;
  }

  /**
   * Get current route params
   * @returns Current route params or undefined
   */
  getCurrentRouteParams<T = any>(): T | undefined {
    const state = this.navigation.getState();
    const route = state.routes[state.index];
    return route?.params as T | undefined;
  }
}

/**
 * Create a navigation helper instance
 * @param navigation - Navigation prop from useNavigation hook
 * @returns NavigationHelper instance
 */
export const createNavigationHelper = (navigation: RootNavigationProp): NavigationHelper => {
  return new NavigationHelper(navigation);
};

