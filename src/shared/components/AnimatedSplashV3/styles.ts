import { StyleSheet } from 'react-native';

export const createStyles = () =>
  StyleSheet.create({
    root: {
      ...StyleSheet.absoluteFillObject,
    },
    canvas: {
      flex: 1,
    },
  });
