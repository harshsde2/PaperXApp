/**
 * RequirementSummaryCard
 * Shared requirement/inquiry summary with optional elapsed timer (count up from post time).
 */

import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { ElapsedTimer } from '../ElapsedTimer';
import { RequirementSummaryCardProps } from './@types';
import { createStyles } from './styles';

export const RequirementSummaryCard: React.FC<RequirementSummaryCardProps> = ({
  title,
  subtitle,
  startDate,
  endDate,
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
      {startDate != null && (
        <View style={styles.timer}>
          <ElapsedTimer
            startDate={startDate}
            endDate={endDate}
            label="Time since post"
            showLabel
          />
        </View>
      )}
    </View>
  );
};

export default RequirementSummaryCard;
