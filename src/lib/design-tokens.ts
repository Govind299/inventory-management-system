export const colors = {
  background: '#F6F7F9',
  surface: '#FFFFFF',
  primary: {
    DEFAULT: '#117A65',
    hover: '#0E6251',
    light: '#D5F4E6',
  },
  text: {
    primary: '#0F1724',
    secondary: '#475569',
    tertiary: '#94A3B8',
  },
  border: '#E6E9EE',
  warning: '#D97706',
  danger: '#B91C1C',
  success: '#0F9D58',
  info: '#0EA5E9',
} as const;

export const spacing = {
  xs: '4px',
  sm: '8px',
  md: '12px',
  base: '16px',
  lg: '24px',
  xl: '32px',
  '2xl': '48px',
} as const;

export const borderRadius = {
  sm: '4px',
  base: '6px',
  md: '8px',
  lg: '12px',
} as const;

export const fontSize = {
  xs: '12px',
  sm: '13px',
  base: '14px',
  md: '15px',
  lg: '16px',
  xl: '20px',
  '2xl': '24px',
} as const;

export const fontWeight = {
  light: 300,
  normal: 400,
  medium: 500,
  semibold: 600,
  bold: 700,
} as const;

export const shadows = {
  sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
  base: '0 1px 3px 0 rgba(0, 0, 0, 0.08)',
  md: '0 4px 6px -1px rgba(0, 0, 0, 0.08)',
  lg: '0 10px 15px -3px rgba(0, 0, 0, 0.08)',
} as const;

export const transitions = {
  fast: '100ms',
  base: '150ms',
  slow: '200ms',
} as const;
