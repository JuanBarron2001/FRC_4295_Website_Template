/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './_includes/**/*.njk',
    './**/*.html',
  ],
  theme: {
    extend: {
      colors: {
        // Brand colors
        maroon: {
          950: '#3d0f04',
          900: '#5c1509',
          800: '#7a1d0e',
          700: '#982311',
          600: '#b32915',
          500: '#c73220',
          400: '#d94325',
          300: '#e85c3a',
          200: '#f08654',
          100: '#f5b5a3',
          50: '#fce8e2',
        },
        tech: '#822008', // Primary maroon accent
        dark: '#0f0f0f',
        gray: {
          950: '#0a0a0a',
          900: '#1a1a1a',
          800: '#2e2e2e',
          700: '#3a3a3a',
          600: '#4a4a4a',
          500: '#606060',
          400: '#757575',
          300: '#999999',
          200: '#d3d3d3',
          100: '#e8e8e8',
          50: '#f5f5f5',
        },
      },
      fontFamily: {
        sans: ['Roboto', 'system-ui', 'sans-serif'],
        mono: ['Courier New', 'monospace'],
      },
      fontSize: {
        xs: ['0.75rem', { lineHeight: '1rem' }],
        sm: ['0.875rem', { lineHeight: '1.25rem' }],
        base: ['1rem', { lineHeight: '1.6' }],
        lg: ['1.125rem', { lineHeight: '1.75rem' }],
        xl: ['1.25rem', { lineHeight: '1.75rem' }],
        '2xl': ['1.5rem', { lineHeight: '2rem' }],
        '3xl': ['1.875rem', { lineHeight: '2.25rem' }],
        '4xl': ['2.25rem', { lineHeight: '2.5rem' }],
        '5xl': ['3rem', { lineHeight: '1' }],
        '6xl': ['3.75rem', { lineHeight: '1' }],
      },
      backgroundImage: {
        'gradient-dark': 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #2e2e2e 100%)',
        'gradient-tech': 'linear-gradient(135deg, #0f0f0f 0%, #3a3a3a 25%, #822008 50%, #3a3a3a 75%, #0f0f0f 100%)',
        'gradient-accent': 'linear-gradient(135deg, #822008 0%, #c73220 50%, #822008 100%)',
      },
      boxShadow: {
        'glow-maroon': '0 0 20px rgba(130, 32, 8, 0.5)',
        'glow-maroon-lg': '0 0 40px rgba(130, 32, 8, 0.6)',
        'tech': '0 10px 40px rgba(0, 0, 0, 0.8)',
      },
      animation: {
        'pulse-glow': 'pulse-glow 2s cubic-bezier(0.4, 0, 0.6, 1) infinite',
        'slide-in': 'slide-in 0.5s ease-out',
        'fade-in': 'fade-in 0.6s ease-out',
      },
      keyframes: {
        'pulse-glow': {
          '0%, 100%': {
            boxShadow: '0 0 20px rgba(130, 32, 8, 0.3)',
          },
          '50%': {
            boxShadow: '0 0 40px rgba(130, 32, 8, 0.6)',
          },
        },
        'slide-in': {
          '0%': {
            transform: 'translateX(-20px)',
            opacity: '0',
          },
          '100%': {
            transform: 'translateX(0)',
            opacity: '1',
          },
        },
        'fade-in': {
          '0%': { opacity: '0' },
          '100%': { opacity: '1' },
        },
      },
      spacing: {
        '128': '32rem',
        '144': '36rem',
      },
    },
  },
  plugins: [],
}
