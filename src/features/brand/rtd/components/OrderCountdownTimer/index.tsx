import React, { memo, useState, useEffect, useRef, useCallback } from 'react';
import { View } from 'react-native';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import type { OrderCountdownTimerProps } from './@types';
import { createStyles } from './styles';

const getTimeRemaining = (deadline: string) => {
  const diff = new Date(deadline).getTime() - Date.now();
  if (diff <= 0) return { minutes: 0, seconds: 0, expired: true };

  return {
    minutes: Math.floor(diff / 60000),
    seconds: Math.floor((diff % 60000) / 1000),
    expired: false,
  };
};

const pad = (n: number): string => n.toString().padStart(2, '0');

export const OrderCountdownTimer = memo<OrderCountdownTimerProps>(
  function OrderCountdownTimer({ deadline, onExpired }) {
    const theme = useTheme();
    const styles = createStyles(theme);
    const onExpiredRef = useRef(onExpired);
    onExpiredRef.current = onExpired;

    const [time, setTime] = useState(() => getTimeRemaining(deadline));

    const tick = useCallback(() => {
      const next = getTimeRemaining(deadline);
      setTime(next);
      if (next.expired) {
        onExpiredRef.current?.();
      }
      return next.expired;
    }, [deadline]);

    useEffect(() => {
      if (time.expired) return;

      const interval = setInterval(() => {
        const expired = tick();
        if (expired) clearInterval(interval);
      }, 1000);

      return () => clearInterval(interval);
    }, [tick, time.expired]);

    return (
      <View style={styles.container}>
        <View style={styles.box}>
          <Text style={styles.value}>{pad(time.minutes)}</Text>
          <Text style={styles.label}>Minutes</Text>
        </View>

        <Text style={styles.separator}>:</Text>

        <View style={styles.box}>
          <Text style={styles.value}>{pad(time.seconds)}</Text>
          <Text style={styles.label}>Seconds</Text>
        </View>
      </View>
    );
  },
);
