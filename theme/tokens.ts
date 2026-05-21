export const colors = {
  paper: '#FAF6EE',
  inkWarm: '#2B1F19',
  peach: '#E8927C',
  sage: '#8FA68E',
  goldWarm: '#C9A876',
  inkSoft: '#5C4F45',
  peachSoft: '#F4D5C9',
  error: '#A65A4F',
  success: '#8FA68E',
} as const;

export const spacing = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
  '2xl': 48,
  '3xl': 64,
} as const;

export const radii = {
  sm: 4,
  md: 8,
  lg: 16,
  pill: 999,
} as const;

export const fonts = {
  serif: 'NotoSerifKR_500Medium',
  serifBold: 'NotoSerifKR_700Bold',
  body: 'GowunDodum_400Regular',
  hand: 'MaruBuri_400Regular',
  english: 'CormorantGaramond_400Regular_Italic',
} as const;

export const sizes = {
  xs: 11,
  sm: 13,
  base: 15,
  lg: 17,
  xl: 20,
  '2xl': 24,
  '3xl': 32,
  hero: 48,
} as const;

export type ColorToken = keyof typeof colors;
export type SpacingToken = keyof typeof spacing;
export type RadiusToken = keyof typeof radii;
export type FontToken = keyof typeof fonts;
export type SizeToken = keyof typeof sizes;
