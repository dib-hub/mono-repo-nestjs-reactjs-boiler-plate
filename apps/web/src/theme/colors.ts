export const TRUXOPS_COLORS = {
  primary: '#102c44',
  primaryMuted: '#1c65a5',
  accent: '#4b9def',
  text: '#43474d',
  textSoft: '#828fa1',
  surface: '#f8f9ff',
  surfaceAlt: '#f0f4f8',
  white: '#ffffff',
  borderSoft: '#d6def7',
} as const;

export type TruxOpsColorToken = keyof typeof TRUXOPS_COLORS;
