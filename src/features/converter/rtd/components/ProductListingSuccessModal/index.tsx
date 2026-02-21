import React from 'react';
import { Modal, View } from 'react-native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import { AppIcon } from '@assets/svgs';
import type { ProductListingSuccessModalProps } from './@types';
import { createStyles } from './styles';

export const ProductListingSuccessModal: React.FC<ProductListingSuccessModalProps> = ({
  visible,
  productName,
  onViewListing,
  onAddAnother,
  isUpdate = false,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onViewListing}
    >
      <View style={styles.overlay}>
        <View style={styles.card}>
          <View style={styles.iconContainer}>
            <AppIcon.TickCheckedBox
              width={48}
              height={48}
              color={theme.colors.success.DEFAULT}
            />
          </View>
          <Text variant="h5" fontWeight="bold" style={styles.title}>
            {isUpdate ? 'Product Updated!' : 'Product Listed!'}
          </Text>
          <Text variant="bodyMedium" style={styles.subtitle}>
            {isUpdate
              ? `Your product ${productName} has been updated.`
              : `Your product ${productName} is now live`}
          </Text>
          <View style={styles.buttonsContainer}>
            <CustomButton
              title="View Listing"
              variant="gradient"
              onPress={onViewListing}
              fullWidth
            />
            <CustomButton
              title="Add Another"
              variant="outline"
              onPress={onAddAnother}
              fullWidth
              style={styles.buttonSpacing}
            />
          </View>
        </View>
      </View>
    </Modal>
  );
};
