/**
 * RequirementSummaryCard
 * Shared requirement/inquiry summary with optional countdown
 */

import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { RequirementSummaryCardProps } from './@types';
import { createStyles } from './styles';

export const RequirementSummaryCard: React.FC<RequirementSummaryCardProps> = ({
  title,
  subtitle,
  countdown,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <View style={styles.card}>
      <View style={styles.content}>
        <View style={styles.imagePlaceholder}>
          <AppIcon.Market width={32} height={32} color={theme.colors.text.tertiary} />
        </View>
        <View style={styles.details}>
          <Text style={styles.label}>Requirement Summary</Text>
          <Text style={styles.title} numberOfLines={2}>
            {title}
          </Text>
          <Text style={styles.subtitle}>{subtitle}</Text>
        </View>
      </View>
      {countdown != null && (
        <View style={styles.timer}>
          <Text style={styles.timerLabel}>Bidding ends in:</Text>
          <View style={styles.timerRow}>
            <View style={styles.timerBlock}>
              <View style={styles.timerValue}>
                <Text style={styles.timerValueText}>
                  {String(countdown.hours).padStart(2, '0')}
                </Text>
              </View>
              <Text style={styles.timerUnit}>Hrs</Text>
            </View>
            <View style={styles.timerBlock}>
              <View style={styles.timerValue}>
                <Text style={styles.timerValueText}>
                  {String(countdown.mins).padStart(2, '0')}
                </Text>
              </View>
              <Text style={styles.timerUnit}>Mins</Text>
            </View>
            <View style={styles.timerBlock}>
              <View style={styles.timerValue}>
                <Text style={styles.timerValueText}>
                  {String(countdown.secs).padStart(2, '0')}
                </Text>
              </View>
              <Text style={styles.timerUnit}>Secs</Text>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

export default RequirementSummaryCard;
