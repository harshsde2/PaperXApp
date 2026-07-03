import React, { memo, useEffect } from 'react';
import { View, type ViewStyle } from 'react-native';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import type { RtdOrderStatus } from '@services/api';
import type { BrandOrderTimelineProps } from './@types';
import { createStyles } from './styles';

const STEPS: RtdOrderStatus[] = ['REQUESTED', 'ACCEPTED', 'CONNECTED'];

const STEP_LABELS: Record<string, string> = {
  REQUESTED: 'Requested',
  ACCEPTED: 'Accepted',
  CONNECTED: 'Connected',
};

const HAPPY_ORDER: RtdOrderStatus[] = ['REQUESTED', 'ACCEPTED', 'CONNECTED'];

function resolveIndex(status: RtdOrderStatus): number {
  const idx = HAPPY_ORDER.indexOf(status);
  if (idx >= 0) return idx;
  if (status === 'PAID' || status === 'IN_PRODUCTION' || status === 'DISPATCHED' || status === 'COMPLETED') {
    return HAPPY_ORDER.indexOf('CONNECTED');
  }
  if (status === 'CANCELLED') return HAPPY_ORDER.indexOf('ACCEPTED') + 1;
  return 0;
}

const PulseCircle = memo(function PulseCircle({
  style,
}: {
  style: Record<string, unknown>;
}) {
  const opacity = useSharedValue(0.6);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0, { duration: 1200, easing: Easing.out(Easing.ease) }),
      -1,
      true,
    );
  }, [opacity]);

  const animatedStyle = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: 1 + (1 - opacity.value) * 0.3 }],
  }));

  return <Animated.View style={[style, animatedStyle]} />;
});

export const BrandOrderTimeline = memo<BrandOrderTimelineProps>(
  function BrandOrderTimeline({ currentStatus }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    const currentIdx = resolveIndex(currentStatus);
    const isCancelled = currentStatus === 'CANCELLED';

    return (
      <View style={styles.container}>
        <View style={styles.row}>
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent = idx === currentIdx && !isCancelled;
            const isTerminalStep = isCancelled && step === 'CONNECTED';

            const leftLineStyle =
              idx === 0
                ? styles.lineTransparent
                : isCompleted || isCurrent
                  ? styles.lineCompleted
                  : isTerminalStep
                    ? styles.lineCancelled
                    : styles.lineFuture;

            const rightLineStyle =
              idx === STEPS.length - 1
                ? styles.lineTransparent
                : isCompleted && !isTerminalStep
                  ? styles.lineCompleted
                  : styles.lineFuture;

            let circleStyle: ViewStyle = styles.circleFuture;
            let iconChar = '';
            if (isTerminalStep) {
              circleStyle = styles.circleCancelled;
              iconChar = '✕';
            } else if (isCompleted) {
              circleStyle = styles.circleCompleted;
              iconChar = '✓';
            } else if (isCurrent) {
              circleStyle = styles.circleCurrent;
              iconChar = '✓';
            }

            const labelStyle = isTerminalStep
              ? { color: theme.colors.error.DEFAULT }
              : isCompleted
                ? styles.labelCompleted
                : isCurrent
                  ? styles.labelCurrent
                  : undefined;

            const displayLabel = isTerminalStep ? 'Cancelled' : STEP_LABELS[step];

            return (
              <View key={step} style={styles.stepWrapper}>
                <View style={styles.circleRow}>
                  <View style={[styles.lineLeft, leftLineStyle]} />
                  <View>
                    {isCurrent && <PulseCircle style={styles.pulseOuter} />}
                    <View style={[styles.circle, circleStyle]}>
                      {iconChar !== '' && <Text style={styles.iconText}>{iconChar}</Text>}
                    </View>
                  </View>
                  <View style={[styles.lineRight, rightLineStyle]} />
                </View>
                <Text style={[styles.label, labelStyle]} numberOfLines={1}>
                  {displayLabel}
                </Text>
              </View>
            );
          })}
        </View>
      </View>
    );
  },
);
