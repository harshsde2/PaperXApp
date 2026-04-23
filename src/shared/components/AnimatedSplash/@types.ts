import type { SharedValue } from 'react-native-reanimated';

export interface AnimatedSplashProps {
  onAnimationEnd: () => void;
}

export interface ParticleData {
  startAngle: number;
  startDistance: number;
  spiralTurns: number;
  radius: number;
  color: string;
}

export interface ParticleProps {
  progress: SharedValue<number>;
  data: ParticleData;
  centerX: number;
  centerY: number;
}
