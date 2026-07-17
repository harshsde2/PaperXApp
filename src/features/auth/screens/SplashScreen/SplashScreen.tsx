import React, { useCallback, useRef, useState } from 'react';
import {
  FlatList,
  ListRenderItemInfo,
  TouchableOpacity,
  View,
  ViewToken,
  useWindowDimensions,
} from 'react-native';
import type { ImageSourcePropType } from 'react-native';
import Animated, {
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';
import { useNavigation } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { SCREENS } from '@navigation/constants';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import { AppIcon } from '@assets/svgs';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { CustomButton } from '@shared/components/CustomButton';
import { appContent } from '@utils/appContent';
import { INTRO_SLIDES } from '@assets/images/intro';
import { IntroSlide } from './components/IntroSlide';
import { PaginationDot } from './components/PaginationDot';
import { SplashScreenNavigationProp } from './@types';
import { createStyles } from './styles';

/**
 * App-intro carousel landing screen. Shows the branded slide series on every
 * cold start of the auth flow (deliberately no "seen it" flag) — Next steps
 * through the slides, Skip (and the final slide's CTA) goes to Login.
 */
const SplashScreen = () => {
  const navigation = useNavigation<SplashScreenNavigationProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();

  const listRef = useRef<FlatList<ImageSourcePropType>>(null);
  const scrollX = useSharedValue(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const isLastSlide = currentIndex >= INTRO_SLIDES.length - 1;

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollX.value = event.contentOffset.x;
  });

  // Stable identity required by FlatList; tracks the settled page for the
  // button label / Skip visibility (fires for both swipes and scrollToIndex).
  const onViewableItemsChanged = useRef(
    ({ viewableItems }: { viewableItems: ViewToken[] }) => {
      const first = viewableItems[0];
      if (first?.index != null) {
        setCurrentIndex(first.index);
      }
    },
  ).current;
  const viewabilityConfig = useRef({ viewAreaCoveragePercentThreshold: 50 }).current;

  const goToLogin = useCallback(() => {
    navigation.navigate(SCREENS.AUTH.LOGIN);
  }, [navigation]);

  const handleNext = useCallback(() => {
    if (currentIndex >= INTRO_SLIDES.length - 1) {
      goToLogin();
      return;
    }
    listRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
  }, [currentIndex, goToLogin]);

  const renderItem = useCallback(
    ({ index }: ListRenderItemInfo<ImageSourcePropType>) => (
      <IntroSlide source={INTRO_SLIDES[index]} index={index} scrollX={scrollX} />
    ),
    [scrollX],
  );

  const getItemLayout = useCallback(
    (_: unknown, index: number) => ({ length: width, offset: width * index, index }),
    [width],
  );

  return (
    <ScreenWrapper
      safeArea={false}
      safeAreaEdges={[]}
      backgroundColor={theme.colors.primary[50]}
      statusBarStyle="dark-content"
    >
      <View style={styles.container}>
        {!isLastSlide && (
          <TouchableOpacity
            style={[styles.skipButton, { top: insets.top + theme.spacing[2] }]}
            onPress={goToLogin}
            activeOpacity={0.7}
            hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
          >
            <Text style={styles.skipText}>{appContent.introCarousel.skip}</Text>
          </TouchableOpacity>
        )}

        <Animated.FlatList
          ref={listRef}
          style={styles.list}
          data={INTRO_SLIDES}
          renderItem={renderItem}
          keyExtractor={(_, index) => `intro-slide-${index}`}
          horizontal
          pagingEnabled
          bounces={false}
          showsHorizontalScrollIndicator={false}
          onScroll={scrollHandler}
          scrollEventThrottle={16}
          onViewableItemsChanged={onViewableItemsChanged}
          viewabilityConfig={viewabilityConfig}
          getItemLayout={getItemLayout}
        />

        <View style={[styles.controls, { paddingBottom: insets.bottom + theme.spacing[4] }]}>
          <View style={styles.dotsRow}>
            {INTRO_SLIDES.map((_, index) => (
              <PaginationDot key={`intro-dot-${index}`} index={index} scrollX={scrollX} />
            ))}
          </View>

          <CustomButton
            title={
              isLastSlide
                ? appContent.splashScreen.actionButtonText
                : appContent.introCarousel.next
            }
            onPress={handleNext}
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
            rightIcon={
              <AppIcon.ArrowRight width={20} height={20} color={theme.colors.text.inverse} />
            }
          />
        </View>
      </View>
    </ScreenWrapper>
  );
};

export default SplashScreen;
