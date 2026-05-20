/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,jsx,ts,tsx}',
    './components/**/*.{js,jsx,ts,tsx}',
  ],
  presets: [require('nativewind/preset')],
  theme: {
    extend: {
      colors: {
        paper: '#FAF6EE',
        'ink-warm': '#2B1F19',
        peach: '#E8927C',
        sage: '#8FA68E',
        'gold-warm': '#C9A876',
        'ink-soft': '#5C4F45',
        'peach-soft': '#F4D5C9',
        error: '#A65A4F',
        success: '#8FA68E',
      },
      fontFamily: {
        serif: ['NotoSerifKR-Medium'],
        'serif-bold': ['NotoSerifKR-Bold'],
        body: ['GowunDodum-Regular'],
        hand: ['MaruBuri-Regular'],
        english: ['CormorantGaramond-Italic'],
      },
      borderRadius: {
        sm: '4px',
        md: '8px',
        lg: '16px',
        pill: '999px',
      },
    },
  },
  plugins: [],
};
