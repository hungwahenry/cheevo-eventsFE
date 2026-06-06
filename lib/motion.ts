import { Easing } from 'react-native-reanimated';

const easeOut = Easing.out(Easing.quad);

export const MOTION = {
  press: {
    scale: 0.97,
    inMs: 80,
    outMs: 120,
    transition: { type: 'timing' as const, duration: 80, easing: easeOut },
  },
  entrance: {
    duration: 240,
    distance: 8,
    transition: { type: 'timing' as const, duration: 240, easing: easeOut },
  },
  like: {
    peak: 1.25,
    upMs: 100,
    downMs: 120,
  },
  stagger: 40,
};
