import React, { memo, useEffect } from 'react';
import { View } from 'react-native';
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
import type { OrderTimelineProps } from './@types';
import { createStyles } from './styles';

const STEPS: RtdOrderStatus[] = [
  'REQUESTED',
  'ACCEPTED',
  'PAID',
  'IN_PRODUCTION',
  'DISPATCHED',
];

const STEP_LABELS: Record<string, string> = {
  REQUESTED: 'Requested',
  ACCEPTED: 'Accepted',
  PAID: 'Paid',
  IN_PRODUCTION: 'Production',
  DISPATCHED: 'Dispatched',
};

const HAPPY_ORDER: RtdOrderStatus[] = [
  'REQUESTED',
  'ACCEPTED',
  'PAID',
  'IN_PRODUCTION',
  'DISPATCHED',
  'COMPLETED',
];

function resolveIndex(status: RtdOrderStatus): number {
  const idx = HAPPY_ORDER.indexOf(status);
  if (idx >= 0) return idx;
  if (status === 'CANCELLED') return HAPPY_ORDER.indexOf('ACCEPTED') + 1;
  if (status === 'DISPUTED') return HAPPY_ORDER.indexOf('DISPATCHED') + 1;
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

export const OrderTimeline = memo<OrderTimelineProps>(
  function OrderTimeline({ currentStatus }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    const currentIdx = resolveIndex(currentStatus);
    const isCancelled = currentStatus === 'CANCELLED';
    const isDisputed = currentStatus === 'DISPUTED';

    return (
      <View style={styles.container}>
        <View style={styles.row}>
          {STEPS.map((step, idx) => {
            const isCompleted = idx < currentIdx;
            const isCurrent =
              idx === currentIdx && !isCancelled && !isDisputed;
            const isFuture = idx >= currentIdx && !isCompleted && !isCurrent;

            const isTerminalStep =
              (isCancelled && step === 'PAID') ||
              (isDisputed && step === 'DISPATCHED');

            const leftLineStyle =
              idx === 0
                ? styles.lineTransparent
                : isCompleted || isCurrent
                  ? styles.lineCompleted
                  : isTerminalStep && isCancelled
                    ? styles.lineCancelled
                    : isTerminalStep && isDisputed
                      ? styles.lineDisputed
                      : styles.lineFuture;

            const rightLineStyle =
              idx === STEPS.length - 1
                ? styles.lineTransparent
                : isCompleted && !isTerminalStep
                  ? styles.lineCompleted
                  : styles.lineFuture;

            let circleStyle = styles.circleFuture;
            let iconChar = '';
            if (isTerminalStep) {
              circleStyle = isCancelled
                ? styles.circleCancelled
                : styles.circleDisputed;
              iconChar = isCancelled ? '✕' : '⚠';
            } else if (isCompleted) {
              circleStyle = styles.circleCompleted;
              iconChar = '✓';
            } else if (isCurrent) {
              circleStyle = styles.circleCurrent;
              iconChar = '✓';
            }

            const labelStyle = isTerminalStep
              ? isCancelled
                ? { color: theme.colors.error.DEFAULT }
                : { color: theme.colors.warning.DEFAULT }
              : isCompleted
                ? styles.labelCompleted
                : isCurrent
                  ? styles.labelCurrent
                  : undefined;

            const displayLabel = isTerminalStep
              ? isCancelled
                ? 'Cancelled'
                : 'Disputed'
              : STEP_LABELS[step];

            return (
              <View key={step} style={styles.stepWrapper}>
                <View style={styles.circleRow}>
                  <View style={[styles.lineLeft, leftLineStyle]} />
                  <View>
                    {isCurrent && (
                      <PulseCircle style={styles.pulseOuter} />
                    )}
                    <View style={[styles.circle, circleStyle]}>
                      {iconChar !== '' && (
                        <Text style={styles.iconText}>{iconChar}</Text>
                      )}
                    </View>
                  </View>
                  <View style={[styles.lineRight, rightLineStyle]} />
                </View>
                <Text
                  style={[styles.label, labelStyle]}
                  numberOfLines={1}
                >
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
