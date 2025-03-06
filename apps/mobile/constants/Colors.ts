/**
 * MoodTech color palette - designed for wellness and mood tracking.
 * A soft, calming palette with blues, greens, and neutral tones that
 * create a serene and positive environment for users.
 */

// Light theme colors
const primaryLight = '#5B9AA9'; // Soft teal-blue (primary brand color)
const secondaryLight = '#A1D6E2'; // Light blue (secondary accent)
const tertiaryLight = '#84B59F'; // Soft sage green (tertiary accent)
const backgroundLight = '#F7F9F9'; // Off-white background
const surfaceLight = '#FFFFFF'; // Pure white surface
const textPrimaryLight = '#364954'; // Deep blue-gray text
const textSecondaryLight = '#6C8490'; // Medium blue-gray text
const subtleLight = '#DFE8ED'; // Very light blue-gray for subtle elements

// Dark theme colors
const primaryDark = '#64A7B5'; // Slightly lighter teal for dark mode
const secondaryDark = '#81B8C5'; // Lighter blue for dark mode
const tertiaryDark = '#8FC0A9'; // Lighter sage green for dark mode
const backgroundDark = '#1A2327'; // Deep blue-gray background
const surfaceDark = '#243036'; // Slightly lighter blue-gray surface
const textPrimaryDark = '#E8EFF2'; // Off-white text
const textSecondaryDark = '#A8BDC5'; // Light blue-gray text
const subtleDark = '#304550'; // Dark blue-gray for subtle elements

export const Colors = {
  light: {
    text: textPrimaryLight,
    textSecondary: textSecondaryLight,
    background: backgroundLight,
    surface: surfaceLight,
    tint: primaryLight,
    secondary: secondaryLight,
    tertiary: tertiaryLight,
    subtle: subtleLight,
    icon: textSecondaryLight,
    tabIconDefault: textSecondaryLight,
    tabIconSelected: primaryLight,
    cardBackground: surfaceLight,
    statusBar: 'dark',
    headerBackground: backgroundLight,
    border: subtleLight,
  },
  dark: {
    text: textPrimaryDark,
    textSecondary: textSecondaryDark,
    background: backgroundDark,
    surface: surfaceDark,
    tint: primaryDark,
    secondary: secondaryDark,
    tertiary: tertiaryDark,
    subtle: subtleDark,
    icon: textSecondaryDark,
    tabIconDefault: textSecondaryDark,
    tabIconSelected: primaryDark,
    cardBackground: surfaceDark,
    statusBar: 'light',
    headerBackground: backgroundDark,
    border: subtleDark,
  },
};
