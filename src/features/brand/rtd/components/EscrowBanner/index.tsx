import React, { memo } from 'react';
import { View } from 'react-native';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { useTheme } from '@theme/index';
import type { EscrowBannerProps } from './@types';
import { createStyles } from './styles';

const DEFAULT_DESCRIPTION =
  'Your payment is held securely in escrow until the order is fulfilled and verified.';

export const EscrowBanner = memo<EscrowBannerProps>(
  function EscrowBanner({ description }) {
    const theme = useTheme();
    const styles = createStyles(theme);

    return (
      <View style={styles.container}>
        <View style={styles.iconCircle}>
          <AppIcon.Security
            width={20}
            height={20}
            color={theme.colors.text.inverse as string}
          />
        </View>

        <View style={styles.textContainer}>
          <Text variant="bodySmall" fontWeight="bold" style={styles.title}>
            Escrow Protected
          </Text>
          <Text variant="captionMedium" style={styles.description}>
            {description ?? DEFAULT_DESCRIPTION}
          </Text>
        </View>
      </View>
    );
  },
);
