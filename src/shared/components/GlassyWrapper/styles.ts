import { StyleSheet } from 'react-native';
import type { Theme } from '@theme/types';

export const createStyles = (_theme: Theme) =>
  StyleSheet.create({
    container: {
      overflow: 'hidden',
      position: 'relative',
    },
    /** Sits behind content; does not affect layout height. */
    backdrop: {
      ...StyleSheet.absoluteFillObject,
    },
    overlay: {
      ...StyleSheet.absoluteFillObject,
    },
    glossyHighlight: {
      ...StyleSheet.absoluteFillObject,
    },
    /**
     * Normal-flow content so the outer container sizes to children (absolute-only
     * children would collapse height to 0 when the parent has no minHeight).
     */
    contentWrapper: {
      zIndex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      alignSelf: 'stretch',
    },
  });
