import React from 'react';
import { View, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { CustomHeaderProps } from './@types';
import { styles } from './styles';
import { AppIcon } from '@assets/svgs';
import { SCREENS } from '@navigation/constants';

const formatScreenTitle = (routeName: string): string => {


  // Handle specific screen name mappings
  const screenNameMap: Record<string, string> = {
    Dashboard: 'Dashboard',
    Profile: 'My Profile',
    Login: 'Login Account',
    Signup: 'Sign Up',
    OTPVerification: 'Verify Identity',
    MillBrandDetails: 'Mills Associated Details',
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
  titleStyle,
  titleContainerStyle,
  leftButtonStyle,
}) => {
  const theme = useTheme();
  const insets = useSafeAreaInsets();
  const canGoBack = navigation.canGoBack();
  const shouldShowBackButton = showBackButton !== undefined ? showBackButton : canGoBack;

  let mainName = route?.name as string;
  if(route?.name === SCREENS.MAIN.POST_TO_BUY) {
    const intent = route?.params?.intent;
    if(intent === 'buy') {
      mainName = 'Post to Buy';
    } else if(intent === 'sell') {
      mainName = 'Post to Sell';
    }
  }

  const displayTitle = title || (mainName ? formatScreenTitle(mainName) : '');

  


  const isDark = route?.name?.toLowerCase().includes('creditpacks');


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
    <View style={[styles.container, { paddingTop: insets.top, backgroundColor:isDark ? '#000' : '#fff', borderBottomColor:isDark ? 'rgba(255, 215, 0, 0.2)' : '#E5E5E5'}]}>
      <View style={[styles.contentWrapper, { paddingVertical: theme.spacing[2] }]}>
        {shouldShowBackButton ? (
          <TouchableOpacity
            style={styles.leftButton}
            onPress={handleBackPress}
            activeOpacity={0.7}
          >
            <AppIcon.ArrowLeft width={24} height={24} color={isDark ? '#fff' : '#000'} />
          </TouchableOpacity>
        ) : (
          <View style={[styles.leftButton, leftButtonStyle]} />
        )}

        <View style={[styles.titleContainer, titleContainerStyle]}>
          <Text variant="h4" fontWeight="semibold"  numberOfLines={1} style={[styles.titleText, titleStyle, { color: isDark ? '#fff' : '#000' }]}>
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

