import React, { useMemo } from 'react';
import { useWindowDimensions, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '@navigation/constants';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import { useAppSelector } from '@store/hooks';
import { SplashScreenNavigationProp } from './@types';
import { createStyles } from './styles';
import { Canvas, Group, Path, Skia } from '@shopify/react-native-skia';
import { AppIcon } from '@assets/svgs';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { View } from 'react-native';
import { CustomButton } from '@shared/components/CustomButton';
import { appContent } from '@utils/appContent';

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { width, height } = useWindowDimensions();

  const gradientColors = useMemo(
    () => [
      theme.colors.primary[50],
      theme.colors.white,
      theme.colors.primary[100],
      theme.colors.primary[200],
      theme.colors.primary[300],
      theme.colors.primary[200],
      theme.colors.primary[100],
      theme.colors.white,
    ],
    [theme.colors]
  );

  const GridBackground = useMemo(() => {
    const gridSize = 40;
    const path = Skia.Path.Make();
    
    // Vertical lines
    for (let i = 0; i <= width; i += gridSize) {
      path.moveTo(i, 0);
      path.lineTo(i, height);
    }

    // Horizontal lines
    for (let i = 0; i <= height; i += gridSize) {
      path.moveTo(0, i);
      path.lineTo(width, i);
    }

    return (
      <Canvas style={StyleSheet.absoluteFill}>
        <Group opacity={0.3}>
          <Path 
            path={path} 
            color="white" 
            style="stroke" 
            strokeWidth={1} 
          />
        </Group>
      </Canvas>
    );
  }, [width, height]);

  return (
    <ScreenWrapper
      safeArea={false} 
      safeAreaEdges={[]}
      gradient="linear"
      gradientColors={gradientColors}
      gradientStart={{ x: 1, y: 0 }} // Top Right
      gradientEnd={{ x: 0, y: 1 }}   // Bottom Left
      backgroundElement={GridBackground}
      statusBarStyle="dark-content"
    >
      <View style={[styles.contentContainer, { paddingTop: 60, paddingBottom: 40 }]}>
        
        {/* Header / Logo */}
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
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
