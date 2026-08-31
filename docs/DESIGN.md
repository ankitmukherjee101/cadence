---
name: Monolith
colors:
  surface: '#141312'
  surface-dim: '#141312'
  surface-bright: '#3a3938'
  surface-container-lowest: '#0f0e0d'
  surface-container-low: '#1c1b1a'
  surface-container: '#201f1e'
  surface-container-high: '#2b2a29'
  surface-container-highest: '#363433'
  on-surface: '#e6e1e0'
  on-surface-variant: '#cdc5bb'
  inverse-surface: '#e6e1e0'
  inverse-on-surface: '#32302f'
  outline: '#979087'
  outline-variant: '#4b463f'
  surface-tint: '#cec5b9'
  primary: '#ded5c8'
  on-primary: '#353027'
  primary-container: '#c2b9ad'
  on-primary-container: '#4f4940'
  inverse-primary: '#645d54'
  secondary: '#c8c6c5'
  on-secondary: '#313030'
  secondary-container: '#4a4949'
  on-secondary-container: '#bab8b7'
  tertiary: '#d7d5dc'
  on-tertiary: '#303035'
  tertiary-container: '#bbb9c0'
  on-tertiary-container: '#4a494f'
  error: '#ffb4ab'
  on-error: '#690005'
  error-container: '#93000a'
  on-error-container: '#ffdad6'
  primary-fixed: '#ebe1d4'
  primary-fixed-dim: '#cec5b9'
  on-primary-fixed: '#1f1b13'
  on-primary-fixed-variant: '#4c463d'
  secondary-fixed: '#e5e2e1'
  secondary-fixed-dim: '#c8c6c5'
  on-secondary-fixed: '#1c1b1b'
  on-secondary-fixed-variant: '#474646'
  tertiary-fixed: '#e4e1e9'
  tertiary-fixed-dim: '#c8c5cc'
  on-tertiary-fixed: '#1b1b20'
  on-tertiary-fixed-variant: '#46464c'
  background: '#141312'
  on-background: '#e6e1e0'
  surface-variant: '#363433'
  charcoal: '#121212'
  champagne-silver: '#C2B9AD'
  surface-elevated: '#1E1E1E'
  text-primary: '#D6D2CC'
  text-muted: '#7A7670'
typography:
  display-lg:
    fontFamily: Instrument Sans
    fontSize: 40px
    fontWeight: '600'
    lineHeight: 48px
    letterSpacing: -0.03em
  display-lg-mobile:
    fontFamily: Instrument Sans
    fontSize: 32px
    fontWeight: '600'
    lineHeight: 38px
    letterSpacing: -0.02em
  headline-md:
    fontFamily: Instrument Sans
    fontSize: 24px
    fontWeight: '500'
    lineHeight: 32px
    letterSpacing: -0.01em
  body-lg:
    fontFamily: Geist
    fontSize: 18px
    fontWeight: '400'
    lineHeight: 28px
    letterSpacing: -0.01em
  body-md:
    fontFamily: Instrument Sans
    fontSize: 16px
    fontWeight: '400'
    lineHeight: 24px
  label-md:
    fontFamily: Geist
    fontSize: 14px
    fontWeight: '500'
    lineHeight: 20px
    letterSpacing: 0.02em
  label-sm:
    fontFamily: Geist
    fontSize: 12px
    fontWeight: '400'
    lineHeight: 16px
    letterSpacing: 0.05em
  data-mono:
    fontFamily: Geist
    fontSize: 13px
    fontWeight: '500'
    lineHeight: 18px
    letterSpacing: 0.03em
rounded:
  sm: 0.125rem
  DEFAULT: 0.25rem
  md: 0.375rem
  lg: 0.5rem
  xl: 0.75rem
  full: 9999px
spacing:
  unit: 8px
  container-padding-mobile: 20px
  container-padding-desktop: 40px
  gutter: 16px
  section-gap: 48px
  max-width-content: 720px
---

## Brand & Style

This design system is defined by **Restrained Modernism**, evolving the previous aesthetic into a sharper, more technical expression of focused productivity. It targets the disciplined minimalist who values precision and high-performance clarity over decorative flourishes. The brand personality is "The Precise Tool": silent, efficient, and exceptionally legible.

The visual style shifts away from editorial softness toward a **Minimalist / Technical** hybrid. It utilizes deep blacks and champagne silvers to create a high-end, obsidian-like environment. Every interface element is reduced to its functional essence, relying on superior typography and purposeful contrast rather than ornamentation.

- **Core Tenet:** Technical precision meets monastic focus.
- **Emotion:** Analytical, controlled, undisturbed.
- **Execution:** Stark tonal layering, monospaced data accents, and "Instrumental" UI clarity.

## Colors

The palette remains anchored in a high-contrast dark mode theme, using **Charcoal (#121212)** as the primary environmental void. This color should be used for the base background to eliminate distractions.

**Champagne Silver (#C2B9AD)** acts as the singular beacon of interaction. It is used for primary brand moments, active states, and critical paths. Its metallic warmth prevents the interface from feeling cold or clinical.

**Surface hierarchies** are managed through subtle charcoal shifts. Secondary surfaces use **#1E1E1E**, while interactive hover or pressed states utilize **#2A2826**. This creates depth through value rather than color, maintaining the monochromatic integrity of the design system.

## Typography

This system utilizes a minimalist dual-font strategy to separate UI navigation from user-generated data.

- **Instrument Sans:** The primary UI font. Used for all headers, navigation, buttons, and system instructions. It provides a clean, contemporary aesthetic with a variable weight range that allows for subtle emphasis.
- **Geist:** The secondary font reserved for "Content" and "Data." This includes journal entries, time-stamped logs, and metrics. Its technical, slightly monospaced character gives journal entries a feel of precise documentation and "logged" history.
- **Visual Rhythm:** Use tight tracking for large headers and generous tracking for Geist labels to maximize legibility. Data-heavy views should leverage Geist's tabular qualities to ensure vertical alignment of numbers and dates.

## Layout & Spacing

The layout follows a **Fixed-Fluid Hybrid** model, prioritizing reading comfort and a "columnar" focus.

- **Focus Column:** On desktop, main content is restricted to a 720px width to ensure optimal line lengths for reading Geist-rendered journal entries.
- **Rhythm:** An 8px linear scale governs all padding and margins. 
- **The "Breath" Rule:** Spacing between disparate data modules (e.g., between a habit tracker list and a journal entry) should be at least 48px (6 units) to prevent the dark theme from feeling cramped or heavy.

## Elevation & Depth

Depth is communicated via **Tonal Stacking**. The design system explicitly avoids drop shadows to maintain its minimalist, flat-technical aesthetic.

- **Base Layer:** The deepest Charcoal (#121212) acts as the infinite background.
- **Surface Layer:** Cards and containers use #1E1E1E. These surfaces should appear to be cut from the same material as the background, just slightly closer to the light source.
- **Outlines:** Instead of shadows, use 1px solid strokes in #2A2826 to define boundaries where surfaces meet or overlap. This creates a "blueprint" feel that complements the Geist typography.

## Shapes

The shape language is **Soft-Technical**. We use a constrained rounding system that feels intentional without being "bubbly."

- **Small elements** (Inputs, Checkboxes) use a 2px radius for a sharp, disciplined look.
- **Standard elements** (Buttons, Cards) use a 4px radius.
- **Large containers** (Modals) may use up to 8px, but never exceed this to maintain the minimalist rigor.
- **Icons:** Use geometric, line-based icons (1.5px stroke). The icons should feel like part of the typeface.

## Components

- **Primary Action:** Solid Champagne Silver (#C2B9AD) background with deep Charcoal (#121212) text. Use Instrument Sans Bold for the label.
- **Data Cards:** Background #1E1E1E with a 1px border of #2A2826. All data within the card (dates, counts) must use Geist.
- **Journal Input:** A pure, borderless experience. The background should match the base charcoal. The text should use Geist 18px with a 1.6x line height. The blinking cursor is Champagne Silver.
- **Checkboxes:** 16px squares with a 2px radius. When active, they feature a Champagne Silver border and a centered 4px dot rather than a checkmark, leaning into the technical/minimal aesthetic.
- **Progress Bars:** Extremely thin (2px or 4px) lines. The track is #2A2826 and the fill is Champagne Silver. No rounded caps; use butt caps for a more architectural feel.