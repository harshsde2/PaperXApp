import React, { useMemo } from 'react';
import { useWindowDimensions, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { SCREENS } from '@navigation/constants';
import { Text } from '@shared/components/Text';
import { baseColors } from '@theme/tokens/base';
import { useAppSelector } from '@store/hooks';
import { SplashScreenNavigationProp } from './@types';
import { styles } from './styles';
import { Canvas, Group, Path, Skia } from '@shopify/react-native-skia';
import { AppIcon } from '@assets/svgs';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { View, TouchableOpacity } from 'react-native';

const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const isAuthenticated = useAppSelector((state) => state.auth.isAuthenticated);
  const { width, height } = useWindowDimensions();

  // Gradient Colors
  const gradientColors = [
    baseColors.blue50,    // Lightest blue
    '#FFFFFF',            // White
    baseColors.blue100,
    baseColors.blue200,
    baseColors.blue300,   // Slightly darker middle
    baseColors.blue200,
    baseColors.blue100,
    '#FFFFFF',
  ];

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
          {/* <AppIcon.LogoWithName width={200} height={60} color={baseColors.black} /> */}
          <Text variant="h1" style={styles.headline}>
            Logo
          </Text>
        </View>

        {/* Bottom Section */}
        <View style={styles.bottomSection}>
          <Text style={styles.headline}>
            The Future of Paper Trading
          </Text>
          
          <Text style={styles.subheadline}>
            Smart, session-based matchmaking for the paper and packaging ecosystem. Connect with verified players today.
          </Text>

          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => navigation.navigate(SCREENS.AUTH.LOGIN)}
            activeOpacity={0.8}
          >
            <Text style={styles.actionButtonText}>Let's start</Text>
            <AppIcon.ArrowRight width={20} height={20} color={baseColors.white} />
          </TouchableOpacity>
        </View>

      </View>
    </ScreenWrapper>
  );
};

export default SplashScreen;
