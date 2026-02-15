/**
 * InterestedModal
 * Popup for responder to enter approx price (INR) and description before expressing interest.
 */

import React, { useState, useCallback } from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  TextInput,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { createStyles } from './styles';

export interface InterestedModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { approx_price: number; description: string }) => void;
  isSubmitting?: boolean;
}

export const InterestedModal: React.FC<InterestedModalProps> = ({
  visible,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [approxPrice, setApproxPrice] = useState('');
  const [description, setDescription] = useState('');

  const handleSubmit = useCallback(() => {
    const priceNum = parseFloat(approxPrice.replace(/,/g, '.'));
    if (Number.isNaN(priceNum) || priceNum < 0) return;
    const desc = description.trim();
    if (!desc) return;
    onSubmit({ approx_price: priceNum, description: desc });
  }, [approxPrice, description, onSubmit]);

  const priceNum = parseFloat(approxPrice.replace(/,/g, '.'));
  const isValid = !Number.isNaN(priceNum) && priceNum >= 0 && description.trim().length > 0;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity style={styles.modalBackdrop} onPress={onClose} activeOpacity={1} />
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={styles.modalCenter}
        >
          <View
            style={[styles.modalBox, { backgroundColor: theme.colors.background.primary }]}
            onStartShouldSetResponder={() => true}
          >
            <Text style={[styles.modalTitle, { color: theme.colors.text.primary }]}>
              Express interest
            </Text>
            <Text style={[styles.modalLabel, { color: theme.colors.text.secondary }]}>
              Approx price (₹ INR)
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                { borderColor: theme.colors.border.primary, color: theme.colors.text.primary },
              ]}
              value={approxPrice}
              onChangeText={setApproxPrice}
              placeholder="0"
              placeholderTextColor={theme.colors.text.tertiary}
              keyboardType="decimal-pad"
            />
            <Text style={[styles.modalLabel, { color: theme.colors.text.secondary, marginTop: 12 }]}>
              Description
            </Text>
            <TextInput
              style={[
                styles.modalInput,
                styles.modalTextArea,
                { borderColor: theme.colors.border.primary, color: theme.colors.text.primary },
              ]}
              value={description}
              onChangeText={setDescription}
              placeholder="Add a message..."
              placeholderTextColor={theme.colors.text.tertiary}
              multiline
              numberOfLines={3}
            />
            <View style={styles.modalActions}>
              <TouchableOpacity
                style={[styles.modalButtonSecondary, { borderColor: theme.colors.border.primary }]}
                onPress={onClose}
                disabled={isSubmitting}
              >
                <Text style={[styles.modalButtonSecondaryText, { color: theme.colors.text.secondary }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.modalButtonPrimary,
                  { backgroundColor: theme.colors.primary.DEFAULT },
                  !isValid && { opacity: 0.5 },
                ]}
                onPress={handleSubmit}
                disabled={!isValid || isSubmitting}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={styles.modalButtonPrimaryText}>Submit</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

