import React, { memo } from 'react';
import { View, Pressable } from 'react-native';
import { Text } from '@shared/components/Text';
import { useTheme } from '@theme/index';
import type { TrackingInfoCardProps } from './@types';
import { createStyles } from './styles';

const hasTrackingData = (
  trackingNumber: string | null,
  courierService: string | null,
): boolean => Boolean(trackingNumber || courierService);

export const TrackingInfoCard = memo<TrackingInfoCardProps>(
  function TrackingInfoCard({ trackingNumber, courierService, onCopyTracking }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    const showData = hasTrackingData(trackingNumber, courierService);

    return (
      <View style={styles.card}>
        <Text style={styles.sectionHeader}>Tracking Information</Text>

        {showData ? (
          <>
            {courierService && (
              <View style={styles.row}>
                <View style={styles.iconCircle}>
                  <Text style={styles.iconText}>🏢</Text>
                </View>
                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>Courier Service</Text>
                  <Text variant="bodySmall" style={styles.infoValue}>
                    {courierService}
                  </Text>
                </View>
              </View>
            )}

            {trackingNumber && (
              <View style={[styles.row, { marginBottom: 0 }]}>
                <View style={styles.iconCircle}>
                  <Text style={styles.iconText}>📦</Text>
                </View>
                <View style={styles.infoBlock}>
                  <Text style={styles.infoLabel}>Tracking ID</Text>
                  <Text variant="bodySmall" style={styles.trackingValue}>
                    {trackingNumber}
                  </Text>
                </View>
                {onCopyTracking && (
                  <Pressable
                    onPress={onCopyTracking}
                    style={styles.copyButton}
                    hitSlop={8}
                  >
                    <Text style={styles.copyIcon}>📋</Text>
                  </Pressable>
                )}
              </View>
            )}
          </>
        ) : (
          <View style={styles.placeholderContainer}>
            <Text style={{ fontSize: 28 }}>📭</Text>
            <Text variant="bodySmall" style={styles.placeholderText}>
              Tracking info not available
            </Text>
          </View>
        )}
      </View>
    );
  },
);
