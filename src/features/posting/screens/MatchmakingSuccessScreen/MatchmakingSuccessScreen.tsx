/**
 * MatchmakingSuccessScreen
 * Shows success state after posting requirement with animated radar effect
 */

import React, { useCallback, useEffect, useRef } from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  Image,
  Animated,
  Easing,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useTheme } from '@theme/index';
import { ScreenWrapper } from '@shared/components/ScreenWrapper';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { SCREENS } from '@navigation/constants';
import { createStyles } from './styles';
import { MatchmakingSuccessScreenRouteProp, RequirementDetails } from './@types';

// Satellite/Radar Icon Component
const SatelliteIcon = ({ color }: { color: string }) => (
  <View style={{ alignItems: 'center', justifyContent: 'center' }}>
    <AppIcon.Satellite width={32} height={32} color={color} />
  </View>
);

const MatchmakingSuccessScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<MatchmakingSuccessScreenRouteProp>();
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();

  const { requirementDetails, creditsDeducted } = route.params || {};

  // Animation values
  const pulseAnim1 = useRef(new Animated.Value(0)).current;
  const pulseAnim2 = useRef(new Animated.Value(0)).current;
  const dotAnim = useRef(new Animated.Value(0)).current;
  const fadeInAnim = useRef(new Animated.Value(0)).current;
  const slideUpAnim = useRef(new Animated.Value(30)).current;

  useEffect(() => {
    // Pulse animation for radar rings
    const createPulseAnimation = (animValue: Animated.Value, delay: number) => {
      return Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.timing(animValue, {
            toValue: 1,
            duration: 2000,
            easing: Easing.out(Easing.ease),
            useNativeDriver: true,
          }),
          Animated.timing(animValue, {
            toValue: 0,
            duration: 0,
            useNativeDriver: true,
          }),
        ])
      );
    };

    // Dot animation (continuous rotation)
    const dotAnimation = Animated.loop(
      Animated.timing(dotAnim, {
        toValue: 1,
        duration: 3000,
        easing: Easing.linear,
        useNativeDriver: true,
      })
    );

    // Fade in animation
    const fadeInAnimation = Animated.timing(fadeInAnim, {
      toValue: 1,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    });

    // Slide up animation
    const slideUpAnimation = Animated.timing(slideUpAnim, {
      toValue: 0,
      duration: 600,
      easing: Easing.out(Easing.ease),
      useNativeDriver: true,
    });

    createPulseAnimation(pulseAnim1, 0).start();
    createPulseAnimation(pulseAnim2, 1000).start();
    dotAnimation.start();
    
    Animated.parallel([fadeInAnimation, slideUpAnimation]).start();

    return () => {
      pulseAnim1.stopAnimation();
      pulseAnim2.stopAnimation();
      dotAnim.stopAnimation();
    };
  }, []);

  const handleClose = useCallback(() => {
    navigation.navigate(SCREENS.MAIN.TABS, {
      screen: SCREENS.MAIN.DASHBOARD,
    });
  }, [navigation]);

  const handleViewActiveSession = useCallback(() => {
    // Navigate to sessions dashboard
    navigation.navigate(SCREENS.SESSIONS.DASHBOARD, {
      initialTab: 'all',
    });
  }, [navigation]);

  const handleReturnToDashboard = useCallback(() => {
    navigation.navigate(SCREENS.MAIN.TABS, {
      screen: SCREENS.MAIN.DASHBOARD,
    });
  }, [navigation]);

  // Default requirement details
  const displayDetails: RequirementDetails = requirementDetails || {
    id: '#0000',
    materialName: 'Material',
    quantity: '0kg',
    deadline: 'N/A',
  };

  // Animated styles
  const pulseStyle1 = {
    opacity: pulseAnim1.interpolate({
      inputRange: [0, 1],
      outputRange: [0.6, 0],
    }),
    transform: [
      {
        scale: pulseAnim1.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.5],
        }),
      },
    ],
  };

  const pulseStyle2 = {
    opacity: pulseAnim2.interpolate({
      inputRange: [0, 1],
      outputRange: [0.6, 0],
    }),
    transform: [
      {
        scale: pulseAnim2.interpolate({
          inputRange: [0, 1],
          outputRange: [1, 1.5],
        }),
      },
    ],
  };

  const dotRotation = dotAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const contentStyle = {
    opacity: fadeInAnim,
    transform: [{ translateY: slideUpAnim }],
  };

  return (
    <ScreenWrapper safeAreaEdges={[]} backgroundColor={theme.colors.background.primary}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={[
          styles.scrollContent,
          { paddingTop: insets.top + theme.spacing[4] },
        ]}
        showsVerticalScrollIndicator={false}
      >
        {/* Close Button */}
        <TouchableOpacity 
          style={[styles.closeButton, { top: insets.top + theme.spacing[2] }]} 
          onPress={handleClose}
        >
          <AppIcon.Close width={20} height={20} color={theme.colors.text.tertiary} />
        </TouchableOpacity>

        {/* Animation Container */}
        <Animated.View style={[styles.animationContainer, contentStyle]}>
          <View style={styles.radarContainer}>
            {/* Pulse Rings */}
            <Animated.View style={[styles.pulseRing, pulseStyle1]} />
            <Animated.View style={[styles.pulseRing, pulseStyle2]} />
            
            {/* Static Rings */}
            <View style={styles.radarOuter} />
            <View style={styles.radarMiddle} />
            <View style={styles.radarInner} />
            
            {/* Center Icon */}
            <Animated.View style={[styles.radarCenter, { transform: [{ rotate: dotRotation }] }]}>
              <SatelliteIcon color={theme.colors.primary.DEFAULT} />
            </Animated.View>

            {/* Animated Dot */}
            <Animated.View
              style={[
                styles.radarDot,
                styles.radarDot1,
                {
                  transform: [
                    { rotate: dotRotation },
                    { translateX: 70 },
                  ],
                },
              ]}
            />
          </View>

          {/* Success Text */}
          <Text style={styles.successTitle}>Your requirement is{'\n'}live</Text>
          <Text style={styles.successSubtitle}>
            We are finding the best matches for{'\n'}your industrial material needs.
          </Text>
        </Animated.View>

        {/* Requirement Card */}
        <Animated.View style={[styles.requirementSection, contentStyle]}>
          <View style={styles.requirementCard}>
            <View style={styles.requirementHeader}>
              {displayDetails.imageUrl ? (
                <Image 
                  source={{ uri: displayDetails.imageUrl }} 
                  style={styles.requirementImage} 
                />
              ) : (
                <View style={styles.requirementImagePlaceholder}>
                  <AppIcon.Market width={24} height={24} color={theme.colors.text.tertiary} />
                </View>
              )}
              <View style={styles.requirementContent}>
                <View style={styles.requirementTitleRow}>
                  <Text style={styles.requirementTitle}>
                    Requirement {displayDetails.id}
                  </Text>
                  <Text style={styles.requirementTime}>Just now</Text>
                </View>
                <Text style={styles.requirementDetails}>
                  {displayDetails.materialName} • {displayDetails.quantity} •{'\n'}
                  Needed by {displayDetails.deadline}
                </Text>
              </View>
            </View>

            {/* Status Badge */}
            <View style={styles.statusBadge}>
              <View style={styles.statusLeft}>
                <View style={styles.statusDot} />
                <Text style={styles.statusText}>Finding Matches</Text>
              </View>
              <Animated.View
                style={[
                  styles.statusIcon,
                  {
                    transform: [
                      {
                        rotate: dotAnim.interpolate({
                          inputRange: [0, 1],
                          outputRange: ['0deg', '360deg'],
                        }),
                      },
                    ],
                  },
                ]}
              >
                <AppIcon.Process width={18} height={18} color={theme.colors.primary.DEFAULT} />
              </Animated.View>
            </View>
          </View>
        </Animated.View>
      </ScrollView>

      {/* Bottom Buttons */}
      <View style={[styles.bottomContainer, { paddingBottom: insets.bottom + theme.spacing[4] }]}>
        <TouchableOpacity
          style={styles.viewSessionButton}
          onPress={handleViewActiveSession}
          activeOpacity={0.8}
        >
          <Text style={styles.viewSessionButtonText}>View Active Session</Text>
          <AppIcon.ArrowRight width={20} height={20} color="#FFFFFF" />
        </TouchableOpacity>

        <TouchableOpacity style={styles.returnButton} onPress={handleReturnToDashboard}>
          <Text style={styles.returnButtonText}>Return to Dashboard</Text>
        </TouchableOpacity>
      </View>
    </ScreenWrapper>
  );
};

export default MatchmakingSuccessScreen;
