import React, { useState, useCallback, useRef, useMemo } from 'react';
import {
  Modal,
  View,
  TouchableOpacity,
  TextInput,
  Alert,
  StyleSheet,
  ScrollView,
  Pressable,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { BottomSheetModal, BottomSheetModalProvider, BottomSheetFlatList } from '@gorhom/bottom-sheet';
import { GorhomBottomSheetModal } from '@shared/components/GorhomBottomSheetModal';
import { useTheme } from '@theme/index';
import { pickImageFromLibrary } from '@shared/utils/imagePicker';
import type { PickedImage } from '@shared/utils/imagePicker';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import { ImagePicker } from '@shared/components/ImagePicker';
import { AppIcon } from '@assets/svgs';
import { useDispatchRtdOrder, useGetRtdDispatchOptions, useUploadImage } from '@services/api';
import type { RtdDispatchProofType } from '@services/api';
import type { DispatchProofModalProps } from './@types';
import { createStyles } from './styles';

const FALLBACK_COURIERS = [
  'Delhivery',
  'BlueDart',
  'Ecom Express',
  'DTDC',
  'Xpressbees',
  'Shadowfax',
  'India Post',
  'VRL',
  'Local Tempo',
  'Other',
];

const PROOF_TYPE_OPTIONS: { value: RtdDispatchProofType; label: string }[] = [
  { value: 'courier_receipt', label: 'Courier receipt' },
  { value: 'lr_copy', label: 'LR copy' },
  { value: 'eway_bill', label: 'E-way bill' },
  { value: 'transport_challan', label: 'Transport challan' },
  { value: 'invoice_copy', label: 'Invoice copy' },
];

function formatDateForInput(date: Date): string {
  const y = date.getFullYear();
  const m = String(date.getMonth() + 1).padStart(2, '0');
  const d = String(date.getDate()).padStart(2, '0');
  return `${y}-${m}-${d}`;
}

export const DispatchProofModal: React.FC<DispatchProofModalProps> = ({
  visible,
  orderId,
  onClose,
  onSuccess,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  const [courierName, setCourierName] = useState('');
  const [trackingNumber, setTrackingNumber] = useState('');
  const [dispatchDate, setDispatchDate] = useState(() => formatDateForInput(new Date()));
  const [proofType, setProofType] = useState<RtdDispatchProofType>('courier_receipt');
  const [selectedFile, setSelectedFile] = useState<PickedImage | null>(null);

  const courierSheetRef = useRef<BottomSheetModal>(null);
  const snapPoints = useMemo(() => ['50%'], []);

  const insets = useSafeAreaInsets();
  const { data: dispatchOptions } = useGetRtdDispatchOptions({ enabled: visible });
  const allowedCouriers =
    Array.isArray(dispatchOptions?.allowed_couriers) && dispatchOptions.allowed_couriers.length > 0
      ? dispatchOptions.allowed_couriers
      : FALLBACK_COURIERS;
  const dispatchMutation = useDispatchRtdOrder();
  const uploadImage = useUploadImage();

  const isSubmitting = uploadImage.isPending || dispatchMutation.isPending;

  const isSubmitDisabled =
    !courierName.trim() ||
    !trackingNumber.trim() ||
    !dispatchDate.trim() ||
    !selectedFile;

  const handlePickFile = useCallback(async () => {
    const picked = await pickImageFromLibrary();
    if (picked) setSelectedFile(picked);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isSubmitDisabled || !selectedFile) return;

    try {
      const filePath = await uploadImage.mutateAsync({ file: selectedFile, purpose: 'dispatch' });

      await dispatchMutation.mutateAsync({
        id: orderId,
        data: {
          courier_name: courierName.trim(),
          tracking_number: trackingNumber.trim(),
          dispatch_date: dispatchDate.trim(),
          proof_type: proofType,
          file_path: filePath,
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
    courierName,
    trackingNumber,
    dispatchDate,
    proofType,
    selectedFile,
    uploadImage,
    dispatchMutation,
    onSuccess,
    onClose,
  ]);

  const handleClose = useCallback(() => {
    courierSheetRef.current?.dismiss();
    setCourierName('');
    setTrackingNumber('');
    setDispatchDate(formatDateForInput(new Date()));
    setProofType('courier_receipt');
    setSelectedFile(null);
    onClose();
  }, [onClose]);

  const openCourierSheet = useCallback(() => {
    courierSheetRef.current?.present();
  }, []);

  const handleSelectCourier = useCallback((name: string) => {
    setCourierName(name);
    courierSheetRef.current?.dismiss();
  }, []);

  if (!visible) return null;

  const cardStyle = [
    styles.card,
    {
      paddingTop: Math.max(theme.spacing[6], insets.top),
      paddingBottom: Math.max(theme.spacing[10], insets.bottom),
    },
  ];
  const scrollContentStyle = [
    styles.scrollContent,
    { paddingBottom: Math.max(theme.spacing[10], insets.bottom) },
  ];

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
        <BottomSheetModalProvider>
        <View style={cardStyle}>
          <ScrollView
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
            contentContainerStyle={scrollContentStyle}
          >
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

            <Text variant="captionMedium" style={styles.warningText}>
              Fake dispatch or invalid tracking will result in permanent account suspension.
            </Text>

            <View style={styles.termsBox}>
              <Text variant="captionMedium" style={styles.termsText}>
                By confirming dispatch you acknowledge: Zupply is not the seller — goods are sold
                by you (the seller) to the buyer. Zupply acts solely as a payment collection
                facilitator. Tax invoices must be issued by you. You are responsible for
                production quality and timely dispatch.
              </Text>
            </View>

            <Text variant="bodySmall" style={styles.label}>
              Courier / Transporter name <Text variant="captionMedium" style={styles.requiredHint}>(Required)</Text>
            </Text>
            <Pressable
              style={styles.dropdownTrigger}
              onPress={openCourierSheet}
              android_ripple={undefined}
            >
              <Text
                variant="bodyMedium"
                style={courierName ? styles.inputValue : styles.placeholder}
              >
                {courierName || 'Select courier'}
              </Text>
              <AppIcon.ChevronDown width={20} height={20} color={theme.colors.text.secondary} />
            </Pressable>

            <Text variant="bodySmall" style={styles.label}>
              Tracking / LR number
            </Text>
            <TextInput
              style={styles.input}
              placeholder="Enter tracking or LR number"
              placeholderTextColor={theme.colors.text.placeholder}
              value={trackingNumber}
              onChangeText={setTrackingNumber}
              autoCapitalize="none"
              autoCorrect={false}
            />

            <Text variant="bodySmall" style={styles.label}>
              Dispatch date
            </Text>
            <TextInput
              style={styles.input}
              placeholder="YYYY-MM-DD"
              placeholderTextColor={theme.colors.text.placeholder}
              value={dispatchDate}
              onChangeText={setDispatchDate}
              autoCapitalize="none"
            />

            <Text variant="bodySmall" style={styles.label}>
              Document (upload one)
            </Text>
            {PROOF_TYPE_OPTIONS.map((opt) => (
              <TouchableOpacity
                key={opt.value}
                style={styles.optionRow}
                onPress={() => setProofType(opt.value)}
                activeOpacity={0.7}
              >
                <View style={styles.radioOuter}>
                  {proofType === opt.value && <View style={styles.radioInner} />}
                </View>
                <Text variant="bodyMedium" style={styles.optionLabel}>
                  {opt.label}
                </Text>
              </TouchableOpacity>
            ))}

            <View style={styles.filePickerContainer}>
              <Text variant="bodySmall" style={styles.label}>
                Upload proof document
              </Text>
              <ImagePicker
                value={selectedFile}
                onChange={setSelectedFile}
                placeholderText="Add receipt / LR / e-way bill / challan / invoice"
                hintText="PNG, JPG up to 10MB"
                showCamera
              />
            </View>

            <CustomButton
              title="Confirm Dispatch"
              variant="gradient"
              onPress={handleSubmit}
              disabled={isSubmitDisabled}
              loading={isSubmitting}
              fullWidth
              style={[styles.submitButton, isSubmitDisabled && styles.disabledButton]}
            />
          </ScrollView>

          <GorhomBottomSheetModal
            ref={courierSheetRef}
            snapPoints={snapPoints}
            enablePanDownToClose
            onDismiss={() => {}}
          >
            <View style={styles.sheetHeader}>
              <Text variant="h4" fontWeight="semibold" style={styles.sheetTitle}>
                Select courier
              </Text>
            </View>
            <BottomSheetFlatList
              data={allowedCouriers}
              keyExtractor={(item: string) => item}
              renderItem={({ item }: { item: string }) => (
                <TouchableOpacity
                  style={[styles.sheetOption, courierName === item && styles.sheetOptionSelected]}
                  onPress={() => handleSelectCourier(item)}
                  activeOpacity={0.7}
                >
                  <Text variant="bodyMedium">{item}</Text>
                </TouchableOpacity>
              )}
            />
          </GorhomBottomSheetModal>
        </View>
      </BottomSheetModalProvider>
      </View>
    </Modal>
  );
};
