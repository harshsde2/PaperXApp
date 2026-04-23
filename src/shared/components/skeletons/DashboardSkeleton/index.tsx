import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@theme/index';
import { Skeleton } from '@shared/components/Skeleton';
import type { DashboardSkeletonProps } from './@types';
import { createStyles } from './styles';

export const DashboardSkeleton: React.FC<DashboardSkeletonProps> = ({ cardCount = 3 }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.headerRow}>
        <View style={styles.greetingBlock}>
          <Skeleton height={18} width="50%" />
          <Skeleton height={14} width="72%" />
        </View>
        <Skeleton height={42} width={42} borderRadius={21} />
      </View>

      <View style={styles.cardsColumn}>
        {Array.from({ length: cardCount }).map((_, index) => (
          <View key={`dashboard-skeleton-card-${index}`}>
            <Skeleton height={116} width="100%" borderRadius={theme.borderRadius.xl} />
            <View style={styles.spacer} />
          </View>
        ))}
      </View>

      <View style={styles.metricsRow}>
        <View style={styles.metricCard}>
          <Skeleton height={16} width="60%" />
          <Skeleton height={24} width="40%" />
        </View>
        <View style={styles.metricCard}>
          <Skeleton height={16} width="60%" />
          <Skeleton height={24} width="40%" />
        </View>
      </View>
    </View>
  );
};

export default DashboardSkeleton;
