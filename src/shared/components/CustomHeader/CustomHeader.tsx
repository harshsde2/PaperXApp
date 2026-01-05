import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { CustomHeaderProps } from './@types';
import { styles } from './styles';
import { AppIcon } from '@assets/svgs';

const formatScreenTitle = (routeName: string): string => {
  // Handle specific screen name mappings
  const screenNameMap: Record<string, string> = {
    Dashboard: 'Dashboard',
    Profile: 'My Profile',
    Login: 'Login Account',
    Signup: 'Sign Up',
    OTPVerification: 'Verify Identity',
  };

  if (screenNameMap[routeName]) {
    return screenNameMap[routeName];
  }

  // Format route name: convert camelCase to Title Case
  const title = routeName
    .replace(/([A-Z])/g, ' $1')
    .trim()
    .split(' ')
    .map(word => {
      if (word.length <= 3 && word === word.toUpperCase()) {
        return word;
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join(' ');
  
  return title;
};

const CustomHeader: React.FC<CustomHeaderProps> = ({
  route,
  navigation,
  title,
  showBackButton,
  rightButton,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const canGoBack = navigation.canGoBack();
  const shouldShowBackButton = showBackButton !== undefined ? showBackButton : canGoBack;
  const displayTitle = title || (route?.name ? formatScreenTitle(route.name) : '');

  const handleBackPress = () => {
    if (canGoBack) {
      navigation.goBack();
    }
  };

  const handleRightButtonPress = () => {
    if (rightButton?.onPress) {
      rightButton.onPress();
    }
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top }]}>
      <View style={[styles.contentWrapper, { paddingVertical: theme.spacing[2] }]}>
        {shouldShowBackButton ? (
          <TouchableOpacity
            style={styles.leftButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <AppIcon.ArrowLeft width={24} height={24} color={theme.colors.text.primary} />
          </TouchableOpacity>
        ) : (
          <View style={styles.leftButton} />
        )}

        <View style={styles.titleContainer}>
          <Text variant="h4" fontWeight="semibold" numberOfLines={1} style={styles.titleText}>
            {displayTitle}
          </Text>
        </View>

        {rightButton ? (
          <TouchableOpacity
            style={styles.rightButton}
            onPress={handleRightButtonPress}
            activeOpacity={0.7}
          >
            {rightButton.icon || <View />}
          </TouchableOpacity>
        ) : (
          <View style={styles.rightButton} />
        )}
      </View>
    </View>
  );
};

export default CustomHeader;

