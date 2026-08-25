export const colors = {
  background: '#F7F5F2',
  surface: '#FFFFFF',
  text: '#1A1A1A',
  textMuted: '#6B6B6B',
  accent: '#1F6B5A',
  accentSoft: '#D8EDE7',
  border: '#E4E0DA',
  danger: '#B42318',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
} as const;

export const typography = {
  title: {
    fontSize: 28,
    fontWeight: '700' as const,
    letterSpacing: -0.5,
  },
  heading: {
    fontSize: 20,
    fontWeight: '600' as const,
  },
  body: {
    fontSize: 16,
    fontWeight: '400' as const,
  },
  caption: {
    fontSize: 13,
    fontWeight: '400' as const,
  },
} as const;
