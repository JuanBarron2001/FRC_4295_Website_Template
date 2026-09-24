/** @type {import('tailwindcss').Config} */
// Compiled at build time by `npm run build:css` (Tailwind 3.4.17, the same
// version the site used to load from cdn.tailwindcss.com).
module.exports = {
  // Scan the built pages rather than the templates, so classes that come from
  // _data files and Markdown entries are included too. js/ covers classes the
  // calendar adds at runtime.
  content: [
    './_site/**/*.html',
    './js/**/*.{js,mjs}',
  ],
  theme: {
    extend: {
      fontFamily: {
        stinger: ['Hudson Stinger', 'sans-serif'],
      },
      colors: {
        tech: '#822008',
        // Lighter brand red for text and icons on the dark backgrounds; maroon text
        // on near-black fails WCAG contrast (2.0:1). #e85c3a is 5.7:1.
        'tech-light': '#e85c3a',
        dark: '#0f0f0f',
        gray: {
          950: '#0a0a0a',
          900: '#1a1a1a',
          800: '#2e2e2e',
          700: '#3a3a3a',
          600: '#4a4a4a',
          500: '#606060',
          400: '#808080', // was #757575, 4.3:1 on gray-950; #808080 is 5.0:1
          300: '#999999',
          200: '#d3d3d3',
          100: '#e8e8e8',
          50: '#f5f5f5',
        },
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
    },
  },
  plugins: [],
}
