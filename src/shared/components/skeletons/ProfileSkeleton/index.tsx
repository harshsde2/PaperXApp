import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@theme/index';
import { Skeleton } from '@shared/components/Skeleton';
import type { ProfileSkeletonProps } from './@types';
import { createStyles } from './styles';

export const ProfileSkeleton: React.FC<ProfileSkeletonProps> = ({ rowCount = 5 }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Skeleton width={96} height={96} borderRadius={48} />
        <Skeleton width="48%" height={20} />
        <Skeleton width="36%" height={14} />
      </View>

      <View style={styles.infoCard}>
        {Array.from({ length: rowCount }).map((_, index) => (
          <View key={`profile-skeleton-row-${index}`} style={styles.row}>
            <Skeleton width={20} height={20} borderRadius={10} />
            <View style={styles.rowText}>
              <Skeleton width="58%" height={14} />
              <Skeleton width="74%" height={12} />
            </View>
            <Skeleton width={18} height={18} borderRadius={9} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default ProfileSkeleton;
