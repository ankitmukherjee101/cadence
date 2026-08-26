import { Platform } from 'react-native';

/** Near-black charcoal with champagne-silver metal — calm instrument, not neon SaaS. */
export const colors = {
  background: '#121212',
  /** Cool focus atmosphere (active session) */
  backgroundFocus: '#101214',
  /** Warm break atmosphere */
  backgroundBreak: '#141210',
  surface: '#1A1A1A',
  surfaceElevated: '#242424',
  text: '#D6D2CC',
  textMuted: '#7A7670',
  /** Champagne silver — primary actions & active session */
  accent: '#C2B9AD',
  accentMuted: '#958C82',
  accentSoft: '#2A2723',
  accentGlow: '#E8E2D8',
  border: '#2E2E2E',
  borderSubtle: '#242424',
  danger: '#B07070',
  dangerSoft: '#2A1C1C',
  overlay: 'rgba(0, 0, 0, 0.72)',
  success: '#8FA88A',
  successSoft: '#1C241C',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
} as const;

export const radii = {
  sm: 8,
  md: 12,
  lg: 16,
  xl: 20,
  full: 999,
} as const;

export const fonts = {
  sans: 'DMSans_400Regular',
  sansMedium: 'DMSans_500Medium',
  sansSemiBold: 'DMSans_600SemiBold',
  sansBold: 'DMSans_700Bold',
  mono: 'SpaceMono',
  serif: 'Literata_400Regular',
  serifSemiBold: 'Literata_600SemiBold',
  /** Platform fallback when custom fonts unavailable */
  serifSystem: Platform.select({ ios: 'Georgia', android: 'serif', default: 'serif' }) as string,
} as const;

export const typography = {
  brand: {
    fontFamily: fonts.sansBold,
    fontSize: 26,
    letterSpacing: 5,
  },
  title: {
    fontFamily: fonts.sansBold,
    fontSize: 28,
    letterSpacing: -0.6,
  },
  heading: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 20,
    letterSpacing: -0.3,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 16,
    letterSpacing: -0.1,
  },
  bodyMedium: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    letterSpacing: -0.1,
  },
  caption: {
    fontFamily: fonts.sansMedium,
    fontSize: 12,
    letterSpacing: 0.4,
  },
  timer: {
    fontFamily: fonts.mono,
    fontSize: 64,
    fontWeight: '400' as const,
    letterSpacing: -1.5,
  },
  journalTitle: {
    fontFamily: fonts.serifSemiBold,
    fontSize: 24,
    letterSpacing: -0.2,
  },
  journalBody: {
    fontFamily: fonts.serif,
    fontSize: 18,
    lineHeight: 30,
  },
} as const;
