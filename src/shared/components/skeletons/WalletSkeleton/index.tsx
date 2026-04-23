import React from 'react';
import { View } from 'react-native';
import { Skeleton } from '@shared/components/Skeleton';
import { useTheme } from '@theme/index';
import type { WalletSkeletonProps } from './@types';
import { createStyles } from './styles';

export const WalletSkeleton: React.FC<WalletSkeletonProps> = ({ transactionCount = 5 }) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.container}>
      <View style={styles.balanceCard}>
        <Skeleton width="40%" height={14} />
        <Skeleton width="55%" height={28} />
        <View style={styles.row}>
          <Skeleton width="35%" height={12} />
          <Skeleton width={72} height={32} borderRadius={theme.borderRadius.full} />
        </View>
      </View>

      <View style={styles.transactionList}>
        {Array.from({ length: transactionCount }).map((_, index) => (
          <View key={`wallet-skeleton-txn-${index}`} style={styles.transactionRow}>
            <Skeleton width={38} height={38} borderRadius={19} />
            <View style={styles.transactionText}>
              <Skeleton width="62%" height={14} />
              <Skeleton width="35%" height={12} />
            </View>
            <Skeleton width={52} height={14} />
          </View>
        ))}
      </View>
    </View>
  );
};

export default WalletSkeleton;
