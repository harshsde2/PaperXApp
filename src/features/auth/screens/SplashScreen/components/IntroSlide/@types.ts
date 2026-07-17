import type { ImageSourcePropType } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';

export interface IntroSlideProps {
  /** Bundled slide artwork */
  source: ImageSourcePropType;
  /** Slide position in the carousel */
  index: number;
  /** Carousel scroll offset shared with every slide for parallax */
  scrollX: SharedValue<number>;
}
