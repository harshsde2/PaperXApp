import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '@shared/components/Skeleton';
import { useTheme } from '@theme/index';
import type { ListItemSkeletonProps } from './@types';
import { createStyles } from './styles';

export const ListItemSkeleton: React.FC<ListItemSkeletonProps> = ({ count = 6 }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      {Array.from({ length: count }).map((_, index) => (
        <View key={`list-item-skeleton-${index}`} style={styles.item}>
          <Skeleton width={44} height={44} borderRadius={22} />
          <View style={styles.textBlock}>
            <Skeleton width="70%" height={14} />
            <Skeleton width="45%" height={12} />
          </View>
          <Skeleton width={24} height={24} borderRadius={12} />
        </View>
      ))}
    </View>
  );
};

export default ListItemSkeleton;
