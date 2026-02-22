import React, { useCallback, useState } from 'react';
import { View, Image, TouchableOpacity } from 'react-native';
import { useTheme } from '@theme/index';
import { Text } from '@shared/components/Text';
import { CustomButton } from '@shared/components/CustomButton';
import { AppIcon } from '@assets/svgs';
import { pickImageFromLibrary, pickImageFromCamera } from '@shared/utils/imagePicker';
import type { ImagePickerProps } from './@types';
import { createStyles } from './styles';

export const ImagePicker: React.FC<ImagePickerProps> = ({
  value,
  onChange,
  previewUri,
  placeholderText = 'Add photo',
  hintText = 'PNG, JPG up to 10MB',
  showCamera = false,
  disabled = false,
  aspectRatio = 1,
}) => {
  const theme = useTheme();
  const styles = createStyles(theme);
  const [isPicking, setIsPicking] = useState(false);

  const previewSource = value ? value.uri : previewUri ?? null;
  const hasPreview = !!previewSource;

  const handlePickLibrary = useCallback(async () => {
    if (disabled || isPicking) return;
    setIsPicking(true);
    try {
      const picked = await pickImageFromLibrary();
      if (picked) onChange(picked);
    } finally {
      setIsPicking(false);
    }
  }, [disabled, isPicking, onChange]);

  const handlePickCamera = useCallback(async () => {
    if (disabled || isPicking) return;
    setIsPicking(true);
    try {
      const picked = await pickImageFromCamera();
      if (picked) onChange(picked);
    } finally {
      setIsPicking(false);
    }
  }, [disabled, isPicking, onChange]);

  const handleRemove = useCallback(() => {
    if (disabled) return;
    onChange(null);
  }, [disabled, onChange]);

  if (hasPreview) {
    return (
      <View style={styles.container} accessible accessibilityLabel="Product image preview">
        <View style={[styles.previewContainer, { aspectRatio }]}>
          <Image
            source={{ uri: previewSource }}
            style={[styles.previewImage, { aspectRatio }]}
            resizeMode="cover"
            accessible
            accessibilityLabel="Selected image"
          />
        </View>
        <View style={styles.actionsRow}>
          <CustomButton
            title="Change"
            variant="outline"
            onPress={handlePickLibrary}
            disabled={disabled || isPicking}
            style={styles.actionButton}
            loading={isPicking}
          />
          <CustomButton
            title="Remove"
            variant="ghost"
            onPress={handleRemove}
            disabled={disabled}
            style={[styles.actionButton, styles.removeButton]}
          />
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.placeholder}
        onPress={handlePickLibrary}
        disabled={disabled || isPicking}
        activeOpacity={0.7}
        accessible
        accessibilityLabel="Add photo"
        accessibilityRole="button"
      >
        <View style={styles.iconCircle}>
          <AppIcon.PlusCircle width={28} height={28} color={theme.colors.primary.DEFAULT} />
        </View>
        <Text variant="bodyMedium" fontWeight="semibold" style={styles.placeholderTitle}>
          {placeholderText}
        </Text>
        <Text variant="captionSmall" style={styles.placeholderHint}>
          {hintText}
        </Text>
      </TouchableOpacity>
      <View style={styles.actionsRow}>
        <CustomButton
          title="Choose photo"
          variant="outline"
          onPress={handlePickLibrary}
          disabled={disabled || isPicking}
          loading={isPicking}
          style={styles.actionButton}
        />
        {showCamera && (
          <CustomButton
            title="Take photo"
            variant="outline"
            onPress={handlePickCamera}
            disabled={disabled || isPicking}
            style={styles.actionButton}
          />
        )}
      </View>
    </View>
  );
};
