/**
 * WalletBadge Component - Premium Gradient Design
 * Displays wallet balance in a luxurious gradient badge for headers
 */

import React from 'react';
import { TouchableOpacity, View, ActivityIndicator } from 'react-native';
import { Canvas, RoundedRect, LinearGradient, vec } from '@shopify/react-native-skia';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { useGetWalletBalance } from '@services/api';
import { WalletBadgeProps } from './@types';
import { createStyles, BADGE_WIDTH, BADGE_HEIGHT } from './styles';

export const WalletBadge: React.FC<WalletBadgeProps> = ({
  onPress,
  style,
  showLoading = true,
  testID,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const { data: wallet, isLoading } = useGetWalletBalance();

  const formatBalance = (balance: number): string => {
    if (balance >= 10000) {
      return `${(balance / 1000).toFixed(1)}K`;
    }
    if (balance >= 1000) {
      return balance.toLocaleString('en-IN');
    }
    return balance.toString();
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={onPress}
      activeOpacity={0.85}
      testID={testID}
    >
      {/* Gradient Background */}
      <Canvas style={styles.gradientCanvas}>
        <RoundedRect x={0} y={0} width={BADGE_WIDTH} height={BADGE_HEIGHT} r={22}>
          <LinearGradient
            start={vec(0, 0)}
            end={vec(BADGE_WIDTH, BADGE_HEIGHT)}
            colors={['#1E3A8A', '#2563EB', '#3B82F6']}
          />
        </RoundedRect>
      </Canvas>

      {/* Content */}
      <View style={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <AppIcon.Wallet width={14} height={14} color="#FFFFFF" />
        </View>
        <View style={styles.textContainer}>
          {isLoading && showLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="small" color="#FFFFFF" />
            </View>
          ) : (
            <>
              <Text style={styles.balance}>
                {formatBalance(wallet?.balance ?? 0)}
              </Text>
              <Text style={styles.label}>Credits</Text>
            </>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

export default WalletBadge;
