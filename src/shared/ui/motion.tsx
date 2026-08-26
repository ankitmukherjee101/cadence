import { type ReactNode, useEffect } from 'react';
import Animated, {
  Easing,
  FadeIn,
  FadeInDown,
  FadeInUp,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

const enterEasing = Easing.out(Easing.cubic);

/** Clock / hero fade-up on session enter */
export function FadeUp({
  children,
  delay = 0,
  style,
}: {
  children: ReactNode;
  delay?: number;
  style?: object;
}) {
  return (
    <Animated.View
      entering={FadeInUp.delay(delay).duration(520).easing(enterEasing)}
      style={style}>
      {children}
    </Animated.View>
  );
}

export function FadeInView({
  children,
  delay = 0,
  style,
}: {
  children: ReactNode;
  delay?: number;
  style?: object;
}) {
  return (
    <Animated.View entering={FadeIn.delay(delay).duration(400)} style={style}>
      {children}
    </Animated.View>
  );
}

export function FadeDown({
  children,
  delay = 0,
  style,
}: {
  children: ReactNode;
  delay?: number;
  style?: object;
}) {
  return (
    <Animated.View
      entering={FadeInDown.delay(delay).duration(420).easing(enterEasing)}
      style={style}>
      {children}
    </Animated.View>
  );
}

/** Soft settle used for completion checkmarks */
export function SettleIn({
  children,
  active,
}: {
  children: ReactNode;
  active: boolean;
}) {
  const scale = useSharedValue(0.85);
  const opacity = useSharedValue(0);

  useEffect(() => {
    if (!active) {
      scale.value = 0.85;
      opacity.value = 0;
      return;
    }
    scale.value = withTiming(1, { duration: 320, easing: enterEasing });
    opacity.value = withTiming(1, { duration: 240 });
  }, [active, opacity, scale]);

  const style = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
    opacity: opacity.value,
  }));

  return <Animated.View style={style}>{children}</Animated.View>;
}
