import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

const TRACK_HEIGHT = 8;
const THUMB_RADIUS = 14;
/** Larger touch target for easier dragging */
const THUMB_HIT_SLOP = 22;

export const SLIDER_TRACK_HEIGHT = TRACK_HEIGHT;
export const SLIDER_THUMB_RADIUS = THUMB_RADIUS;
export const SLIDER_THUMB_HIT_SIZE = THUMB_RADIUS * 2 + THUMB_HIT_SLOP * 2;
export const SLIDER_HEIGHT = 40;
/** Padding so thumbs at 0 and 1000 are not clipped */
export const SLIDER_TRACK_PADDING_H = SLIDER_THUMB_HIT_SIZE / 2;

export const createStyles = (theme: Theme) =>
  StyleSheet.create({
    container: {
      width: '100%',
      paddingVertical: theme.spacing[2],
    },
    sliderRow: {
      width: '100%',
      height: SLIDER_HEIGHT,
      justifyContent: 'center',
      paddingHorizontal: SLIDER_TRACK_PADDING_H,
    },
    trackWrapper: {
      width: '100%',
      height: SLIDER_HEIGHT,
      position: 'relative',
      overflow: 'visible',
    },
    thumbHitArea: {
      position: 'absolute',
      width: SLIDER_THUMB_HIT_SIZE,
      height: SLIDER_THUMB_HIT_SIZE,
      top: (SLIDER_HEIGHT - SLIDER_THUMB_HIT_SIZE) / 2,
      justifyContent: 'center',
      alignItems: 'center',
    },
    thumb: {
      width: THUMB_RADIUS * 2,
      height: THUMB_RADIUS * 2,
      borderRadius: THUMB_RADIUS,
      backgroundColor: 'transparent',
    },
    inputsRow: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: theme.spacing[3],
      marginTop: theme.spacing[3],
    },
    inputGroup: {
      flex: 1,
    },
    inputLabel: {
      color: theme.colors.text.secondary,
      marginBottom: theme.spacing[1],
    },
    rangeInput: {
      backgroundColor: theme.colors.surface.tertiary,
      borderWidth: 1,
      borderColor: theme.colors.border.primary,
      borderRadius: theme.borderRadius.md,
      paddingHorizontal: theme.spacing[3],
      paddingVertical: theme.spacing[3],
      fontSize: 14,
      color: theme.colors.text.primary,
    },
    rangeSeparator: {
      color: theme.colors.text.tertiary,
    },
  });
