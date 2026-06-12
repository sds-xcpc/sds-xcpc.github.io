/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'Noto Sans SC', 'Microsoft YaHei', 'ui-sans-serif', 'system-ui', 'sans-serif'],
        serif: ['Noto Serif SC', 'STSong', 'SimSun', 'ui-serif', 'serif'],
        mono: ['JetBrains Mono', 'ui-monospace', 'SFMono-Regular', 'monospace'],
      },
      colors: {
        ink: '#17142b',
        purple: '#4a258b',
        violet: '#7561bd',
        lavender: '#ede9ff',
        lavender2: '#f6f3ff',
        orange: '#ff9800',
        gold: '#ffd34d',
        cyan: '#16b9dc',
        slatecopy: '#4e4a62',
        paper: '#fbf9ff',
      },
    },
  },
  plugins: [],
};
