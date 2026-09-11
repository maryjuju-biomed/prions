import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{js,ts,jsx,tsx}', './components/**/*.{js,ts,jsx,tsx}'],
  theme: {
    extend: {
      colors: {
        bg: '#0f0a1f',
        card: '#1a1034',
        neon: '#b86bff'
      }
    }
  },
  plugins: []
};

export default config;
