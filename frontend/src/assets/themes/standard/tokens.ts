/**
 * Central Design Token Definitions
 * Single source of truth for all theme tokens.
 * PrimeNG will generate --p-* CSS variables from these tokens.
 */

// Primary color palette (using PrimeNG's teal scale)
export const primaryTokens = {
  color: '{teal.700}',
  inverseColor: '#ffffff',
  hoverColor: '{teal.900}',
  activeColor: '{teal.800}',
};

// Accent colors for UI feedback states
export const accentTokensLight = {
  success: '{emerald.200}',
  danger: '{rose.200}',
  neutral: '{gray.100}',
};

export const accentTokensDark = {
  success: '{teal.800}',
  danger: '{rose.800}',
  neutral: '{zinc.700}',
};

// Intention colors for question types
export const intentionTokensLight = {
  question: '{teal.200}',
  discussion: '{stone.300}',
  information: '{sky.200}',
};

export const intentionTokensDark = {
  question: '{teal.800}',
  discussion: '{stone.600}',
  information: '{sky.800}',
};
