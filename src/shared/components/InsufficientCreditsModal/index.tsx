/**
 * InsufficientCreditsModal Component - Premium Design
 * Modal displayed when user doesn't have enough credits for an action
 */

import React from 'react';
import { Modal, View, TouchableOpacity } from 'react-native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { InsufficientCreditsModalProps } from './@types';
import { createStyles } from './styles';

export const InsufficientCreditsModal: React.FC<InsufficientCreditsModalProps> = ({
  visible,
  currentBalance,
  requiredCredits,
  onClose,
  onBuyCredits,
  title = 'Insufficient Credits',
  message,
  testID,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const creditsNeeded = requiredCredits - currentBalance;

  const defaultMessage = `You need ${creditsNeeded} more credits to complete this action.`;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      testID={testID}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Icon */}
          <View style={styles.iconContainer}>
            <AppIcon.Wallet width={40} height={40} color="#F59E0B" />
          </View>

          {/* Title */}
          <Text style={styles.title}>{title}</Text>

          {/* Message */}
          <Text style={styles.message}>{message || defaultMessage}</Text>

          {/* Balance Details */}
          <View style={styles.balanceContainer}>
            <View style={[styles.balanceRow, styles.balanceRowDivider]}>
              <Text style={styles.balanceLabel}>Current Balance</Text>
              <Text style={styles.balanceValue}>{currentBalance} Credits</Text>
            </View>
            <View style={[styles.balanceRow, styles.balanceRowDivider]}>
              <Text style={styles.balanceLabel}>Required</Text>
              <Text style={styles.balanceValue}>{requiredCredits} Credits</Text>
            </View>
            <View style={[styles.balanceRow, styles.neededRow]}>
              <Text style={styles.neededLabel}>Credits Needed</Text>
              <Text style={styles.neededValue}>{creditsNeeded} Cr</Text>
            </View>
          </View>

          {/* Buttons */}
          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={styles.buyButton}
              onPress={onBuyCredits}
              activeOpacity={0.8}
            >
              <AppIcon.Wallet width={20} height={20} color={theme.colors.white} />
              <Text style={styles.buyButtonText}>Buy Credits</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={styles.cancelButtonText}>Maybe Later</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default InsufficientCreditsModal;
