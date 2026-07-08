import React from 'react';
import { Modal, TouchableOpacity, View, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView, useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text } from '@shared/components/Text';
import { AppIcon } from '@assets/svgs';
import { WarehouseAddressForm } from '@shared/components/WarehouseAddressForm/WarehouseAddressForm';
import { KeyboardDoneBar } from '@shared/components/KeyboardDoneBar';
import { useTheme } from '@theme/index';
import type { StructuredAddressFormModalProps } from './@types';
import { createStyles } from './styles';

export const StructuredAddressFormModal: React.FC<
  StructuredAddressFormModalProps
> = ({
  visible,
  title,
  onDismiss,
  mapData,
  existingLocation,
  coordinatesOverride,
  showNameField,
  onSubmit,
  submitLabel,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const insets = useSafeAreaInsets();
  const headerBarHeight = theme.spacing[3] * 2 + 28;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      presentationStyle="pageSheet"
      onRequestClose={onDismiss}
    >
      <SafeAreaView
        style={[
          styles.modalContainer,
          { backgroundColor: theme.colors.background.secondary },
        ]}
      >
        <View style={styles.formModalHeader}>
          <Text
            variant="h5"
            fontWeight="semibold"
            style={styles.formModalTitle}
            numberOfLines={2}
          >
            {title}
          </Text>
          <TouchableOpacity
            onPress={onDismiss}
            style={styles.formModalCloseButton}
            hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
            activeOpacity={0.7}
          >
            <AppIcon.Close
              width={24}
              height={24}
              color={theme.colors.text.primary}
            />
          </TouchableOpacity>
        </View>
        <KeyboardAvoidingView
          style={styles.keyboardAvoiding}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={
            Platform.OS === 'ios' ? insets.top + headerBarHeight : 0
          }
        >
          <WarehouseAddressForm
            mapData={mapData}
            existingLocation={existingLocation}
            coordinatesOverride={coordinatesOverride}
            showNameField={showNameField}
            onSubmit={onSubmit}
            onCancel={onDismiss}
            submitLabel={submitLabel}
          />
        </KeyboardAvoidingView>
        <KeyboardDoneBar />
      </SafeAreaView>
    </Modal>
  );
};
