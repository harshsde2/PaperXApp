/**
 * ElapsedTimer Component
 * Displays time elapsed since session was posted, counting UP from 0 toward 24h (or backend end time).
 */

import React, { useState, useEffect, useMemo } from 'react';
import { View } from 'react-native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import type { ElapsedTime } from './@types';
import { ElapsedTimerProps } from './@types';
import { createStyles } from './styles';

const MS_PER_HOUR = 60 * 60 * 1000;
const MS_PER_MINUTE = 60 * 1000;
const MS_PER_SECOND = 1000;
const DEFAULT_DURATION_MS = 24 * MS_PER_HOUR;

const calculateElapsed = (
  startDate: Date,
  endDate: Date | null
): ElapsedTime => {
  const now = Date.now();
  const start = startDate.getTime();
  const elapsedMs = Math.max(0, now - start);

  const maxMs = endDate
    ? Math.max(0, endDate.getTime() - start)
    : DEFAULT_DURATION_MS;
  const cappedMs = Math.min(elapsedMs, maxMs);

  const totalSeconds = Math.floor(cappedMs / MS_PER_SECOND);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return { hours, minutes, seconds };
};

const padNumber = (num: number): string => num.toString().padStart(2, '0');

export const ElapsedTimer: React.FC<ElapsedTimerProps> = ({
  startDate,
  endDate,
  compact = false,
  showLabel = true,
  label = 'Time since post',
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const start = useMemo(
    () => (typeof startDate === 'string' ? new Date(startDate) : startDate),
    [startDate]
  );
  const end = useMemo(() => {
    if (endDate == null) return new Date(start.getTime() + DEFAULT_DURATION_MS);
    return typeof endDate === 'string' ? new Date(endDate) : endDate;
  }, [endDate, start]);

  const [elapsed, setElapsed] = useState<ElapsedTime>(() =>
    calculateElapsed(start, end)
  );

  useEffect(() => {
    const timer = setInterval(() => {
      setElapsed(calculateElapsed(start, end));
    }, 1000);
    return () => clearInterval(timer);
  }, [start, end]);

  if (compact) {
    return (
      <View style={styles.compactContainer}>
        <Text style={styles.compactText}>
          {padNumber(elapsed.hours)}:{padNumber(elapsed.minutes)}:
          {padNumber(elapsed.seconds)}
        </Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      {showLabel && <Text style={styles.label}>{label}</Text>}
      <View style={styles.timeRow}>
        <View style={styles.timeSegment}>
          <Text style={styles.timeValue}>{padNumber(elapsed.hours)}</Text>
        </View>
        <Text style={styles.timeSeparator}>:</Text>
        <View style={styles.timeSegment}>
          <Text style={styles.timeValue}>{padNumber(elapsed.minutes)}</Text>
        </View>
        <Text style={styles.timeSeparator}>:</Text>
        <View style={styles.timeSegment}>
          <Text style={styles.timeValue}>{padNumber(elapsed.seconds)}</Text>
        </View>
      </View>
    </View>
  );
};

export default ElapsedTimer;
