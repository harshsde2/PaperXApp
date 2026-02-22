import React from 'react';
import { View } from 'react-native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import type { EmptyStateProps } from './@types';
import { createStyles } from './styles';

export const EmptyState: React.FC<EmptyStateProps> = ({
  title,
  description,
  icon,
  action,
  variant = 'card',
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const isCard = variant === 'card';

  const containerStyle = isCard ? styles.card : styles.minimal;
  const descriptionStyle = [
    styles.description,
    !action && styles.descriptionNoAction,
  ];

  return (
    <View style={containerStyle}>
      {icon ? <View style={styles.iconWrap}>{icon}</View> : null}
      <Text fontWeight="bold" style={styles.title}>
        {title}
      </Text>
      {description ? (
        <Text style={descriptionStyle}>{description}</Text>
      ) : null}
      {action ? (
        <View style={styles.actionWrap}>
          <CustomButton
            title={action.label}
            onPress={action.onPress}
            variant="gradient"
            size="sm"
            textStyle={{ fontWeight: '600' }}
          />
        </View>
      ) : null}
    </View>
  );
};
