/**
 * ConfirmModal — reusable confirmation dialog with confirm/cancel actions.
 */

import React from 'react';
import { Modal, View, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { ConfirmModalProps } from './@types';
import { createStyles } from './styles';

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  visible,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  onConfirm,
  onCancel,
  destructive = false,
  icon,
  loading = false,
  testID,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}
      testID={testID}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {icon ? (
            <View
              style={[
                styles.iconContainer,
                destructive && styles.iconContainerDestructive,
              ]}
            >
              {icon}
            </View>
          ) : null}

          <Text style={styles.title}>{title}</Text>
          {message ? <Text style={styles.message}>{message}</Text> : null}

          <View style={styles.buttonsContainer}>
            <TouchableOpacity
              style={[
                styles.confirmButton,
                destructive && styles.confirmButtonDestructive,
              ]}
              onPress={onConfirm}
              activeOpacity={0.8}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator size="small" color={theme.colors.white} />
              ) : (
                <Text style={styles.confirmButtonText}>{confirmLabel}</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.cancelButton}
              onPress={onCancel}
              activeOpacity={0.7}
              disabled={loading}
            >
              <Text style={styles.cancelButtonText}>{cancelLabel}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

export default ConfirmModal;
