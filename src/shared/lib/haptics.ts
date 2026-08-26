import * as Haptics from 'expo-haptics';
import { Platform } from 'react-native';

async function safe(run: () => Promise<void>) {
  if (Platform.OS === 'web') return;
  try {
    await run();
  } catch {
    // Expo Go / unsupported — ignore
  }
}

export function hapticLight() {
  return safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light));
}

export function hapticMedium() {
  return safe(() => Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium));
}

export function hapticSuccess() {
  return safe(() => Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success));
}

export function hapticSelection() {
  return safe(() => Haptics.selectionAsync());
}
