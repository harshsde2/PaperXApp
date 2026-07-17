import type { SharedValue } from 'react-native-reanimated';

export interface PaginationDotProps {
  /** Slide position this dot represents */
  index: number;
  /** Carousel scroll offset shared with every dot */
  scrollX: SharedValue<number>;
}
