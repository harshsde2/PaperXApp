import React, { forwardRef, useCallback, useEffect } from 'react';
import { Platform, useWindowDimensions } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  useBottomSheetModalInternal,
  INITIAL_LAYOUT_VALUE,
} from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps } from '@gorhom/bottom-sheet';
import { useSharedValue, useAnimatedReaction } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FullWindowOverlay } from 'react-native-screens';
import { useTheme } from '@theme/index';
import type { GorhomBottomSheetModalProps } from './@types';

/**
 * iOS: native layer above high-z-index siblings (e.g. floating CTAs). See gorhom#832.
 * FullWindowOverlay uses the full window height, but Gorhom modal snap math uses
 * `containerLayoutState.height` measured from the provider (often inside safe area).
 * Sync that shared height to the window so percentage snap points reach the real bottom.
 */
function IosFullWindowSheetContainer({ children }: React.PropsWithChildren) {
  const { containerLayoutState } = useBottomSheetModalInternal();
  const { height: windowHeight } = useWindowDimensions();
  const sharedWindowHeight = useSharedValue(windowHeight);

  useEffect(() => {
    sharedWindowHeight.value = windowHeight;
  }, [windowHeight, sharedWindowHeight]);

  useAnimatedReaction(
    () => containerLayoutState.get().height,
    (measured) => {
      const wh = sharedWindowHeight.value;
      if (wh <= 0 || measured === INITIAL_LAYOUT_VALUE) {
        return;
      }
      if (measured !== wh) {
        containerLayoutState.modify((state) => {
          'worklet';
          state.height = wh;
          return state;
        });
      }
    },
    [containerLayoutState, sharedWindowHeight],
  );

  return <FullWindowOverlay>{children}</FullWindowOverlay>;
}

const GorhomBottomSheetModal = forwardRef<BottomSheetModal, GorhomBottomSheetModalProps>(
  (
    { backdropComponent, containerComponent: userContainerComponent, topInset, bottomInset, ...props },
    ref,
  ) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();

    const containerComponent =
      Platform.OS === 'ios' ? IosFullWindowSheetContainer : userContainerComponent;

    const resolvedTopInset =
      Platform.OS === 'ios' ? (topInset ?? insets.top) : topInset;
    // Gorhom hosting container uses `bottom: bottomInset`; home-indicator inset lifts the sheet.
    const resolvedBottomInset =
      Platform.OS === 'ios' ? (bottomInset ?? 0) : bottomInset;

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
        containerComponent={containerComponent}
        topInset={resolvedTopInset}
        bottomInset={resolvedBottomInset}
        {...props}
      />
    );
  },
);

GorhomBottomSheetModal.displayName = 'GorhomBottomSheetModal';

export { GorhomBottomSheetModal };
