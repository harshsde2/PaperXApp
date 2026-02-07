/**
 * SubmitQuoteModal
 * Modal for dealer to submit quote (price, delivery days, notes).
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
import { createStyles } from '../styles';

export interface SubmitQuoteModalProps {
  visible: boolean;
  onClose: () => void;
  onSubmit: (data: { quoted_price: number; delivery_days: number; notes?: string }) => void;
  isSubmitting?: boolean;
}

export const SubmitQuoteModal: React.FC<SubmitQuoteModalProps> = ({
  visible,
  onClose,
  onSubmit,
  isSubmitting = false,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [price, setPrice] = useState('');
  const [deliveryDays, setDeliveryDays] = useState('');
  const [notes, setNotes] = useState('');

  const handleSubmit = useCallback(() => {
    const priceNum = parseFloat(price.replace(/,/g, '.'));
    const daysNum = parseInt(deliveryDays, 10);
    if (Number.isNaN(priceNum) || priceNum <= 0 || Number.isNaN(daysNum) || daysNum <= 0) {
      return;
    }
    onSubmit({
      quoted_price: priceNum,
      delivery_days: daysNum,
      notes: notes.trim() || undefined,
    });
  }, [price, deliveryDays, notes, onSubmit]);

  const isValid = useCallback(() => {
    const priceNum = parseFloat(price.replace(/,/g, '.'));
    const daysNum = parseInt(deliveryDays, 10);
    return !Number.isNaN(priceNum) && priceNum > 0 && !Number.isNaN(daysNum) && daysNum > 0;
  }, [price, deliveryDays]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={modalStyles.overlay}>
        <KeyboardAvoidingView
          behavior={Platform.OS === 'ios' ? 'padding' : undefined}
          style={modalStyles.centered}
        >
          <View style={[modalStyles.box, { backgroundColor: theme.colors.background.primary }]}>
            <Text style={[modalStyles.title, { color: theme.colors.text.primary }]}>
              Submit your quote
            </Text>
            <Text style={[modalStyles.label, { color: theme.colors.text.secondary }]}>
              Quoted price (₹)
            </Text>
            <TextInput
              style={[modalStyles.input, { borderColor: theme.colors.border.primary, color: theme.colors.text.primary }]}
              value={price}
              onChangeText={setPrice}
              placeholder="e.g. 50000"
              placeholderTextColor={theme.colors.text.tertiary}
              keyboardType="decimal-pad"
            />
            <Text style={[modalStyles.label, { color: theme.colors.text.secondary }]}>
              Delivery (days)
            </Text>
            <TextInput
              style={[modalStyles.input, { borderColor: theme.colors.border.primary, color: theme.colors.text.primary }]}
              value={deliveryDays}
              onChangeText={setDeliveryDays}
              placeholder="e.g. 7"
              placeholderTextColor={theme.colors.text.tertiary}
              keyboardType="number-pad"
            />
            <Text style={[modalStyles.label, { color: theme.colors.text.secondary }]}>
              Notes (optional)
            </Text>
            <TextInput
              style={[modalStyles.input, modalStyles.inputMultiline, { borderColor: theme.colors.border.primary, color: theme.colors.text.primary }]}
              value={notes}
              onChangeText={setNotes}
              placeholder="Any additional details"
              placeholderTextColor={theme.colors.text.tertiary}
              multiline
              numberOfLines={3}
            />
            <View style={modalStyles.actions}>
              <TouchableOpacity
                style={[modalStyles.button, modalStyles.buttonSecondary]}
                onPress={onClose}
                disabled={isSubmitting}
              >
                <Text style={modalStyles.buttonSecondaryText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  modalStyles.button,
                  modalStyles.buttonPrimary,
                  { backgroundColor: theme.colors.primary.DEFAULT },
                  !isValid() && modalStyles.buttonDisabled,
                ]}
                onPress={handleSubmit}
                disabled={isSubmitting || !isValid()}
              >
                {isSubmitting ? (
                  <ActivityIndicator size="small" color="#FFF" />
                ) : (
                  <Text style={modalStyles.buttonPrimaryText}>Submit quote</Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </View>
    </Modal>
  );
};

const modalStyles = {
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center' as const,
    alignItems: 'center' as const,
    padding: 24,
  },
  centered: {
    width: '100%',
    maxWidth: 400,
  },
  box: {
    borderRadius: 16,
    padding: 24,
    width: '100%',
  },
  title: {
    fontSize: 18,
    fontWeight: '700' as const,
    marginBottom: 20,
  },
  label: {
    fontSize: 13,
    fontWeight: '600' as const,
    marginBottom: 8,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 16,
    marginBottom: 16,
  },
  inputMultiline: {
    minHeight: 80,
    textAlignVertical: 'top' as const,
  },
  actions: {
    flexDirection: 'row' as const,
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center' as const,
    justifyContent: 'center' as const,
  },
  buttonSecondary: {
    backgroundColor: '#f0f0f0',
  },
  buttonSecondaryText: {
    fontSize: 16,
    fontWeight: '600' as const,
    color: '#333',
  },
  buttonPrimary: {},
  buttonPrimaryText: {
    fontSize: 16,
    fontWeight: '700' as const,
    color: '#FFFFFF',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
};
