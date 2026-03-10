/**
 * FullScreenImageModal – full-screen image viewer with dark backdrop and close button.
 * Reusable for sample images, product photos, etc.
 */

import React from 'react';
import { Modal, View, TouchableOpacity, Image, StyleSheet } from 'react-native';
import { useTheme } from '@theme/index';
import { AppIcon } from '@assets/svgs';

export interface FullScreenImageModalProps {
  visible: boolean;
  imageUrl: string;
  onClose: () => void;
}

export const FullScreenImageModal: React.FC<FullScreenImageModalProps> = ({
  visible,
  imageUrl,
  onClose,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
      statusBarTranslucent
    >
      <View style={styles.overlay}>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={onClose}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
          activeOpacity={0.8}
        >
          <AppIcon.Close width={28} height={28} color={theme.colors.text.inverse} />
        </TouchableOpacity>
        <Image
          source={{ uri: imageUrl }}
          style={styles.image}
          resizeMode="contain"
        />
      </View>
    </Modal>
  );
};

const createStyles = (theme: { colors: { background: { primary: string }; text: { inverse: string } }; spacing: Record<number, number> }) =>
  StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0, 0, 0, 0.92)',
      justifyContent: 'center',
      alignItems: 'center',
    },
    closeButton: {
      position: 'absolute',
      top: theme.spacing[6],
      right: theme.spacing[4],
      zIndex: 10,
      padding: theme.spacing[2],
    },
    image: {
      width: '100%',
      height: '100%',
    },
  });
