/** @type {import('tailwindcss').Config} */
import { keepTheme } from "keep-react/keepTheme";
const config = {
  content: [
    './index.html',
    './src/**/*.{js,jsx,ts,tsx}',
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        lborder: '#E0E0E0',
        dborder: '#333333',
        primary: '#A8E6CF',
        secondary: '#FFD700',
        accent: '#F4D1C1',
        hover: '#D79985',
        link: '#007BFF',
        green: '#0A6A47',
        highlight: '#FFD700',
        ctaBg: '#FF6F30',
        charcoal: '#36454F',
        c: {
          danger: '#FF4136',
          success: '#4CAF50',
          warning: '#FF9800',
          info: '#00BCD4',
        },
        subtleAccent: '#B3C7F9',
        neutralGray: '#999999',
        darkAccent: '#8A5A3B',
        darkText: '#666666',
        lightText: '#E0E0E0',
        l: {
          background: '#FFFFFF',
          primary: '#333333',
          secondary: '#666666',
          border: '#E0E0E0',
          boxBg: '#d3d3d3',
          ctaText: '#FFFFFF',
          hover: '#D79985',
        },
        d: {
          background: '#101316',
          primary: '#E0E0E0',
          secondary: '#B0B0B0',
          border: '#333333',
          boxBg: '#161a1e',
          ctaText: '#FFFFFF',
          hover: '#D79985',
          greenFade: 'rgba(10, 106, 71, 0.5)',
          darkAccent: '#8A5A3B',
          subtleAccent: '#B3C7F9',
        },
        accentSoft: '#A6D1FF',
        mutedGray: '#888888',
      },
      backdropBlur: {
        'glass': '8px',
      },
      fontFamily: {
        'poppins': ['Poppins', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


export default keepTheme(config);
