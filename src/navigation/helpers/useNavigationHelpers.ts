/**
 * useNavigationHelpers Hook
 * 
 * Custom hook that provides type-safe navigation helpers.
 * This is the recommended way to use navigation helpers in components.
 */

import { useNavigation } from '@react-navigation/native';
import { NavigationHelper, RootNavigationProp } from './navigationHelpers';

/**
 * Custom hook for type-safe navigation
 * @returns NavigationHelper instance with all navigation methods
 * 
 * @example
 * ```tsx
 * const MyComponent = () => {
 *   const nav = useNavigationHelpers();
 *   
 *   const handlePress = () => {
 *     nav.navigate(SCREENS.MAIN.PROFILE);
 *   };
 *   
 *   return <Button onPress={handlePress} />;
 * };
 * ```
 */
export const useNavigationHelpers = (): NavigationHelper => {
  const navigation = useNavigation<RootNavigationProp>();
  return new NavigationHelper(navigation);
};

