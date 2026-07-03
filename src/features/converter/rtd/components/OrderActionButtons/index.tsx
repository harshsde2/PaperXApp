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
    loadingAccept = false,
    loadingDecline = false,
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

    return null;
  },
);
