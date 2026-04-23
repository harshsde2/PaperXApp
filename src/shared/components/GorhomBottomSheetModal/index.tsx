import React, { forwardRef, useCallback } from 'react';
import { BottomSheetModal, BottomSheetBackdrop } from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { useTheme } from '@theme/index';
import type { GorhomBottomSheetModalProps } from './@types';

const GorhomBottomSheetModal = forwardRef<BottomSheetModal, GorhomBottomSheetModalProps>(
  ({ backdropComponent, ...props }, ref) => {
    const theme = useTheme();

    const renderBackdrop = useCallback(
      (backdropProps: BottomSheetBackdropProps) => (
        <BottomSheetBackdrop
          {...backdropProps}
          appearsOnIndex={0}
          disappearsOnIndex={-1}
          pressBehavior="close"
          opacity={0.5}
          style={[backdropProps.style, { backgroundColor: theme.colors.black }]}
        />
      ),
      [theme.colors.black],
    );

    return (
      <BottomSheetModal
        ref={ref}
        backdropComponent={backdropComponent ?? renderBackdrop}
        {...props}
      />
    );
  },
);

GorhomBottomSheetModal.displayName = 'GorhomBottomSheetModal';

export { GorhomBottomSheetModal };
