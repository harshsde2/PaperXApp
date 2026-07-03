import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '@navigation/constants';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import { SplashScreenNavigationProp } from './@types';
import { createStyles } from './styles';
import { AppIcon } from '@assets/svgs';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { View } from 'react-native';
import { CustomButton } from '@shared/components/CustomButton';
import { appContent } from '@utils/appContent';
import { ImageSlideshowBackground } from '@shared/components/ImageSlideshowBackground';
import { SPLASH_IMAGES } from '@assets/images/splash';

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <ScreenWrapper
      safeArea={false}
      safeAreaEdges={[]}
      backgroundColor="transparent"
      backgroundElement={<ImageSlideshowBackground images={SPLASH_IMAGES} />}
      statusBarStyle="light-content"
    >
      <View style={styles.contentContainer}>
        {/* Header / Logo */}
        <View style={styles.logoWrap}>
          <AppIcon.ZupplyLogo width={220} height={220} />
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Text style={styles.headline}>
            {appContent.splashScreen.headline}
          </Text>

          <Text style={styles.subheadline}>
            {appContent.splashScreen.subheadline}
          </Text>

          <CustomButton
            title={appContent.splashScreen.actionButtonText}
            onPress={() => navigation.navigate(SCREENS.AUTH.LOGIN)}
            variant="gradient"
            fullWidth
            size="lg"
            gradientColors={[
              theme.colors.primary[400],
              theme.colors.primary[600],
              theme.colors.primary.DEFAULT,
            ]}
            gradientStart={{ x: 0, y: 0 }}
            gradientEnd={{ x: 1, y: 1 }}
            rightIcon={<AppIcon.ArrowRight width={20} height={20} color={theme.colors.text.inverse} />}
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SplashScreen;
