/**
 * TransactionItem Component - Premium Design
 * Displays a single wallet transaction with modern styling
 */

import React, { useCallback, useMemo } from 'react';
import { TouchableOpacity, View } from 'react-native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { TransactionItemProps } from './@types';
import { createStyles } from './styles';

export const TransactionItem: React.FC<TransactionItemProps> = ({
  transaction,
  onPress,
  style,
  testID,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const isAdded = transaction.type === 'ADDED';

  const handlePress = useCallback(() => {
    if (onPress) {
      onPress(transaction);
    }
  }, [onPress, transaction]);

  const formatTransactionType = (type: string): string => {
    return type.replace(/_/g, ' ');
  };

  const iconColor = useMemo(() => {
    return isAdded ? '#16A34A' : '#DC2626';
  }, [isAdded]);

  const renderIcon = useMemo(() => {
    if (isAdded) {
      return <AppIcon.ArrowRight width={22} height={22} color={iconColor} />;
    } else {
      return <AppIcon.ArrowLeft width={22} height={22} color={iconColor} />;
    }
  }, [isAdded, iconColor]);

  const Container = onPress ? TouchableOpacity : View;

  return (
    <Container
      style={[styles.container, style]}
      onPress={onPress ? handlePress : undefined}
      activeOpacity={onPress ? 0.7 : 1}
      testID={testID}
    >
      {/* Icon */}
      <View
        style={[
          styles.iconContainer,
          isAdded ? styles.iconContainerAdded : styles.iconContainerDeducted,
        ]}
      >
        {renderIcon}
      </View>

      {/* Content */}
      <View style={styles.contentContainer}>
        {/* Top Row - Description */}
        <View style={styles.topRow}>
          <Text style={styles.description} numberOfLines={1}>
            {transaction.description}
          </Text>
          <View style={styles.amountContainer}>
            <Text
              style={[
                styles.amount,
                isAdded ? styles.amountAdded : styles.amountDeducted,
              ]}
            >
              {transaction.credits}
            </Text>
            <Text style={styles.balanceAfter}>
              Bal: {transaction.balance_after}
            </Text>
          </View>
        </View>

        {/* Bottom Row - Type & Date */}
        <View style={styles.bottomRow}>
          <View style={styles.transactionTypeBadge}>
            <Text style={styles.transactionType}>
              {formatTransactionType(transaction.transaction_type)}
            </Text>
          </View>
          <Text style={styles.dateTime}>{transaction.date}</Text>
          <View style={styles.dot} />
          <Text style={styles.dateTime}>{transaction.time}</Text>
        </View>
      </View>
    </Container>
  );
};

export default TransactionItem;
