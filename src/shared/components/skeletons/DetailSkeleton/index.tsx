import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '@shared/components/Skeleton';
import { useTheme } from '@theme/index';
import type { DetailSkeletonProps } from './@types';
import { createStyles } from './styles';

export const DetailSkeleton: React.FC<DetailSkeletonProps> = ({ paragraphRows = 5 }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.imageBlock}>
          <Skeleton width="100%" height={210} borderRadius={theme.borderRadius.lg} />
        </View>
        <View style={styles.lineGap}>
          <Skeleton width="70%" height={20} />
          <Skeleton width="45%" height={14} />
        </View>
        <View style={styles.paragraph}>
          {Array.from({ length: paragraphRows }).map((_, index) => (
            <Skeleton
              key={`detail-skeleton-line-${index}`}
              width={index === paragraphRows - 1 ? '60%' : '100%'}
              height={12}
            />
          ))}
        </View>
      </View>
    </View>
  );
};

export default DetailSkeleton;
