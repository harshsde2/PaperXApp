import React, { memo } from 'react';
import { View } from 'react-native';
import { CustomButton } from '@shared/components/CustomButton';
import { useTheme } from '@theme/index';
import type { OrderActionButtonsProps } from './@types';
import { createStyles } from './styles';

export const OrderActionButtons = memo<OrderActionButtonsProps>(
  function OrderActionButtons({
    status,
    onAccept,
    onDecline,
    onMarkInProduction,
    onDispatch,
    loadingAccept = false,
    loadingDecline = false,
    loadingMarkInProduction = false,
  }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    if (status === 'REQUESTED') {
      return (
        <View style={styles.container}>
          <View style={styles.buttonWrap}>
            <CustomButton
              title="Accept"
              onPress={onAccept}
              variant="gradient"
              loading={loadingAccept}
              fullWidth
            />
          </View>
          <View style={styles.buttonWrap}>
            <CustomButton
              title="Decline"
              onPress={onDecline}
              variant="danger"
              loading={loadingDecline}
              fullWidth
            />
          </View>
        </View>
      );
    }

    if (status === 'PAID') {
      return (
        <View style={styles.container}>
          <View style={styles.buttonWrap}>
            <CustomButton
              title="Mark In Production"
              onPress={onMarkInProduction}
              variant="gradient"
              loading={loadingMarkInProduction}
              fullWidth
            />
          </View>
        </View>
      );
    }

    if (status === 'IN_PRODUCTION') {
      return (
        <View style={styles.container}>
          <View style={styles.buttonWrap}>
            <CustomButton
              title="Dispatch Order"
              onPress={onDispatch}
              variant="gradient"
              fullWidth
            />
          </View>
        </View>
      );
    }

    return null;
  }
);
