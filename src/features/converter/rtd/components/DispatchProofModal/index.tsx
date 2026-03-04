import React, { useState, useCallback } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
} from 'react-native';
import { useTheme } from '@theme/index';
import { pickImageFromLibrary } from '@shared/utils/imagePicker';
import type { PickedImage } from '@shared/utils/imagePicker';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import { AppIcon } from '@assets/svgs';
import { useDispatchRtdOrder } from '@services/api';
import type { RtdDispatchProofType } from '@services/api';
import type { DispatchProofModalProps } from './@types';
import { createStyles } from './styles';

const PROOF_OPTIONS: { value: RtdDispatchProofType; label: string }[] = [
  { value: 'tracking_number', label: 'Courier Tracking Number' },
  { value: 'lr_photo', label: 'LR Photo' },
  { value: 'delivery_challan', label: 'Delivery Challan' },
];

export const DispatchProofModal: React.FC<DispatchProofModalProps> = ({
  visible,
  orderId,
  onClose,
  onSuccess,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [proofType, setProofType] = useState<RtdDispatchProofType>('tracking_number');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [selectedFile, setSelectedFile] = useState<PickedImage | null>(null);

  const dispatchMutation = useDispatchRtdOrder();

  const isSubmitDisabled =
    proofType === 'tracking_number'
      ? !trackingNumber.trim()
      : !selectedFile;

  const handlePickFile = useCallback(async () => {
    const picked = await pickImageFromLibrary();
    if (picked) setSelectedFile(picked);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isSubmitDisabled) return;

    const fileObj =
      selectedFile && (proofType === 'lr_photo' || proofType === 'delivery_challan')
        ? { uri: selectedFile.uri, type: selectedFile.type, name: selectedFile.name }
        : undefined;

    try {
      await dispatchMutation.mutateAsync({
        id: orderId,
        data: {
          proof_type: proofType,
          ...(proofType === 'tracking_number' && { tracking_number: trackingNumber.trim() }),
          ...(fileObj && { file: fileObj }),
        },
      });
      onSuccess();
      onClose();
    } catch (err: any) {
      Alert.alert(
        'Dispatch Failed',
        err?.message ?? 'Something went wrong. Please try again.'
      );
    }
  }, [
    isSubmitDisabled,
    orderId,
    proofType,
    trackingNumber,
    selectedFile,
    dispatchMutation,
    onSuccess,
    onClose,
  ]);

  const handleClose = useCallback(() => {
    setProofType('tracking_number');
    setTrackingNumber('');
    setSelectedFile(null);
    onClose();
  }, [onClose]);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={handleClose}
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={StyleSheet.absoluteFill}
          activeOpacity={1}
          onPress={handleClose}
        />
        <View style={styles.card}>
          <View style={styles.headerRow}>
            <Text variant="h5" fontWeight="semibold" style={styles.title}>
              Dispatch Order
            </Text>
            <TouchableOpacity
              onPress={handleClose}
              style={styles.closeButton}
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <AppIcon.Close
                width={24}
                height={24}
                color={theme.colors.text.secondary}
              />
            </TouchableOpacity>
          </View>

          {PROOF_OPTIONS.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              style={styles.optionRow}
              onPress={() => {
                setProofType(opt.value);
                if (opt.value !== 'tracking_number') setSelectedFile(null);
              }}
              activeOpacity={0.7}
            >
              <View style={styles.radioOuter}>
                {proofType === opt.value && (
                  <View style={styles.radioInner} />
                )}
              </View>
              <Text variant="bodyMedium" style={styles.optionLabel}>
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}

          {proofType === 'tracking_number' && (
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="Enter tracking number"
                placeholderTextColor={theme.colors.text.placeholder}
                value={trackingNumber}
                onChangeText={setTrackingNumber}
                autoCapitalize="none"
                autoCorrect={false}
              />
            </View>
          )}

          {(proofType === 'lr_photo' || proofType === 'delivery_challan') && (
            <View style={styles.filePickerContainer}>
              <CustomButton
                title="Choose File"
                variant="outline"
                onPress={handlePickFile}
              />
              {selectedFile && (
                <Text
                  variant="captionMedium"
                  style={styles.fileNameText}
                  numberOfLines={2}
                >
                  {selectedFile.name}
                </Text>
              )}
            </View>
          )}

          <CustomButton
            title="Confirm Dispatch"
            variant="gradient"
            onPress={handleSubmit}
            disabled={isSubmitDisabled}
            loading={dispatchMutation.isPending}
            fullWidth
            style={[styles.submitButton, isSubmitDisabled && styles.disabledButton]}
          />
        </View>
      </View>
    </Modal>
  );
};
