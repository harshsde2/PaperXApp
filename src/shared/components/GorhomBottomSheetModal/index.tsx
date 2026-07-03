import React, { forwardRef, useCallback, useEffect } from 'react';
import { Platform, useWindowDimensions, View, StyleSheet } from 'react-native';
import {
  BottomSheetModal,
  BottomSheetBackdrop,
  BottomSheetFooter,
  useBottomSheet,
  useBottomSheetModalInternal,
  INITIAL_LAYOUT_VALUE,
} from '@gorhom/bottom-sheet';
import type { BottomSheetBackdropProps, BottomSheetFooterProps } from '@gorhom/bottom-sheet';
import { useSharedValue, useAnimatedReaction } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { FullWindowOverlay } from 'react-native-screens';
import { useTheme } from '@theme/index';
import { CustomButton } from '@shared/components/CustomButton';
import type { Theme } from '@theme/types';
import type { GorhomBottomSheetModalProps } from './@types';

/**
 * Sticky "Done" bar pinned to the visible bottom of the sheet at every snap point.
 * Rendered inside BottomSheetFooter (so it tracks the sheet position) and closes the
 * sheet via the gorhom hook — no ref plumbing needed at call sites.
 */
function DoneFooterBar({ label, theme }: { label: string; theme: Theme }) {
  const { close } = useBottomSheet();
  return (
    <View
      style={[
        footerStyles.bar,
        {
          backgroundColor: theme.colors.background.primary,
          borderTopColor: theme.colors.border.primary,
        },
      ]}
    >
      <CustomButton
        title={label}
        onPress={() => close()}
        variant="gradient"
        size="md"
        fullWidth
        gradientColors={[
          theme.colors.primary[400],
          theme.colors.primary[600],
          theme.colors.primary.DEFAULT,
        ]}
        gradientStart={{ x: 0, y: 0 }}
        gradientEnd={{ x: 1, y: 1 }}
      />
    </View>
  );
}

const footerStyles = StyleSheet.create({
  bar: {
    paddingHorizontal: 16,
    paddingTop: 12,
    paddingBottom: 12,
    borderTopWidth: 1,
  },
});

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
    {
      backdropComponent,
      containerComponent: userContainerComponent,
      topInset,
      bottomInset,
      doneFooter,
      doneLabel = 'Done',
      footerComponent,
      ...props
    },
    ref,
  ) => {
    const theme = useTheme();
    const insets = useSafeAreaInsets();

    const renderDoneFooter = useCallback(
      (footerProps: BottomSheetFooterProps) => (
        <BottomSheetFooter {...footerProps} bottomInset={insets.bottom}>
          <DoneFooterBar label={doneLabel} theme={theme} />
        </BottomSheetFooter>
      ),
      [doneLabel, insets.bottom, theme],
    );

    const resolvedFooterComponent = doneFooter ? renderDoneFooter : footerComponent;

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
        footerComponent={resolvedFooterComponent}
        // Sheets in this app always pass explicit snapPoints; dynamic sizing (gorhom's
        // default) mis-measures content, so default it off. Callers can still override
        // by passing enableDynamicSizing explicitly.
        enableDynamicSizing={false}
        {...props}
      />
    );
  },
);

GorhomBottomSheetModal.displayName = 'GorhomBottomSheetModal';

export { GorhomBottomSheetModal };
