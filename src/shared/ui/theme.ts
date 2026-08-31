import { colors, fonts, radii, spacing, typography } from './tokens';

export { colors, fonts, radii, spacing, typography };

/** Journal / reading surface — charcoal continuum, not literary paper. */
export const paper = {
  background: colors.background,
  line: colors.border,
  ink: colors.text,
  inkMuted: colors.textMuted,
  margin: colors.border,
} as const;

/** Data card surface — tonal stack + blueprint outline */
export const card = {
  background: colors.surface,
  border: colors.border,
  radius: radii.md,
} as const;
