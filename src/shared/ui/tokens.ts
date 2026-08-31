/**
 * Cadence design tokens — Restrained Modernism / technical precision.
 * Source: docs/DESIGN.md
 */
export const colors = {
  /** Charcoal void — base environment */
  background: '#121212',
  charcoal: '#121212',
  /** Cool focus atmosphere (active session) */
  backgroundFocus: '#101214',
  /** Warm break atmosphere */
  backgroundBreak: '#141210',
  /** Elevated surface (#1E1E1E) */
  surface: '#1E1E1E',
  surfaceElevated: '#1E1E1E',
  /** Hover / pressed / outline stroke */
  surfaceHover: '#2A2826',
  text: '#D6D2CC',
  textMuted: '#7A7670',
  /** Champagne silver — primary interaction beacon */
  accent: '#C2B9AD',
  champagne: '#C2B9AD',
  accentMuted: '#958C82',
  accentSoft: '#2A2826',
  accentGlow: '#DED5C8',
  /** Blueprint outlines (no shadows) */
  border: '#2A2826',
  borderSubtle: '#2A2826',
  danger: '#FFB4AB',
  dangerSoft: '#2A1C1C',
  overlay: 'rgba(0, 0, 0, 0.72)',
  success: '#8FA88A',
  successSoft: '#1C241C',
  onPrimary: '#121212',
  error: '#FFB4AB',
  onError: '#690005',
} as const;

/** 8px linear scale */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
  /** Mobile content inset */
  container: 20,
  /** Gap between disparate modules */
  section: 48,
  gutter: 16,
  maxWidthContent: 720,
} as const;

/** Soft-technical radii — never exceed 8px for containers */
export const radii = {
  /** Inputs, checkboxes — sharp disciplined */
  xs: 2,
  sm: 2,
  /** Buttons, cards — DEFAULT 4px */
  md: 4,
  /** Larger containers / modals — max 8px */
  lg: 8,
  xl: 8,
  full: 9999,
} as const;

export const fonts = {
  /** Instrument Sans — UI chrome */
  sans: 'InstrumentSans_400Regular',
  sansMedium: 'InstrumentSans_500Medium',
  sansSemiBold: 'InstrumentSans_600SemiBold',
  sansBold: 'InstrumentSans_700Bold',
  /** Geist — content, data, journal */
  geist: 'Geist_400Regular',
  geistMedium: 'Geist_500Medium',
  geistSemiBold: 'Geist_600SemiBold',
  /** Aliases: journal used to be Literata */
  content: 'Geist_400Regular',
  contentMedium: 'Geist_500Medium',
  contentSemiBold: 'Geist_600SemiBold',
  serif: 'Geist_400Regular',
  serifSemiBold: 'Geist_600SemiBold',
  /** Tabular / mono data accents */
  mono: 'Geist_500Medium',
} as const;

export const typography = {
  brand: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 32,
    letterSpacing: -0.64,
    lineHeight: 38,
  },
  display: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 32,
    letterSpacing: -0.64,
    lineHeight: 38,
  },
  title: {
    fontFamily: fonts.sansSemiBold,
    fontSize: 32,
    letterSpacing: -0.64,
    lineHeight: 38,
  },
  heading: {
    fontFamily: fonts.sansMedium,
    fontSize: 24,
    letterSpacing: -0.24,
    lineHeight: 32,
  },
  body: {
    fontFamily: fonts.sans,
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 24,
  },
  bodyMedium: {
    fontFamily: fonts.sansMedium,
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 24,
  },
  bodyBold: {
    fontFamily: fonts.sansBold,
    fontSize: 16,
    letterSpacing: 0,
    lineHeight: 24,
  },
  caption: {
    fontFamily: fonts.geistMedium,
    fontSize: 14,
    letterSpacing: 0.28,
    lineHeight: 20,
  },
  labelSm: {
    fontFamily: fonts.geist,
    fontSize: 12,
    letterSpacing: 0.6,
    lineHeight: 16,
  },
  data: {
    fontFamily: fonts.geistMedium,
    fontSize: 13,
    letterSpacing: 0.39,
    lineHeight: 18,
  },
  timer: {
    fontFamily: fonts.geistMedium,
    fontSize: 56,
    fontWeight: '500' as const,
    letterSpacing: -1.5,
  },
  journalTitle: {
    fontFamily: fonts.sansMedium,
    fontSize: 24,
    letterSpacing: -0.24,
    lineHeight: 32,
  },
  /** Geist 18 / 1.6 — journal body & free write */
  journalBody: {
    fontFamily: fonts.geist,
    fontSize: 18,
    lineHeight: 29,
    letterSpacing: -0.18,
  },
} as const;
