/**
 * CountdownTimer Component
 * Displays countdown to session bidding end time
 */

import React, { useState, useEffect, useCallback } from 'react';
import { View } from 'react-native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { CountdownTime } from '../../@types';
import { CountdownTimerProps } from './@types';
import { createStyles } from './styles';

const calculateTimeLeft = (targetDate: Date): CountdownTime => {
  const now = new Date().getTime();
  const target = targetDate.getTime();
  const difference = target - now;

  if (difference <= 0) {
    return { days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  return {
    days: Math.floor(difference / (1000 * 60 * 60 * 24)),
    hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
    minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
    seconds: Math.floor((difference % (1000 * 60)) / 1000),
  };
};

const padNumber = (num: number): string => {
  return num.toString().padStart(2, '0');
};

export const CountdownTimer: React.FC<CountdownTimerProps> = ({
  targetDate,
  onExpire,
  compact = false,
  showLabel = true,
  label = 'Session Ends In',
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const target = typeof targetDate === 'string' ? new Date(targetDate) : targetDate;
  const [timeLeft, setTimeLeft] = useState<CountdownTime>(calculateTimeLeft(target));

  useEffect(() => {
    const timer = setInterval(() => {
      const newTimeLeft = calculateTimeLeft(target);
      setTimeLeft(newTimeLeft);

      if (
        newTimeLeft.days === 0 &&
        newTimeLeft.hours === 0 &&
        newTimeLeft.minutes === 0 &&
        newTimeLeft.seconds === 0
      ) {
        clearInterval(timer);
        onExpire?.();
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [target, onExpire]);

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Text style={styles.compactText}>
          {timeLeft.days > 0 && `${timeLeft.days}d `}
          {padNumber(timeLeft.hours)}:{padNumber(timeLeft.minutes)}:{padNumber(timeLeft.seconds)}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showLabel && <Text style={styles.label}>{label}</Text>}
      <View style={styles.timerRow}>
        <View style={styles.timerBlock}>
          <Text style={styles.timerValue}>{padNumber(timeLeft.days)}</Text>
          <Text style={styles.timerUnit}>Days</Text>
        </View>
        <View style={styles.timerBlock}>
          <Text style={styles.timerValue}>{padNumber(timeLeft.hours)}</Text>
          <Text style={styles.timerUnit}>Hours</Text>
        </View>
        <View style={styles.timerBlock}>
          <Text style={styles.timerValue}>{padNumber(timeLeft.minutes)}</Text>
          <Text style={styles.timerUnit}>Mins</Text>
        </View>
        <View style={styles.timerBlock}>
          <Text style={styles.timerValue}>{padNumber(timeLeft.seconds)}</Text>
          <Text style={styles.timerUnit}>Secs</Text>
        </View>
      </View>
    </View>
  );
};

export default CountdownTimer;
