/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './pages/**/*.{js,ts,jsx,tsx,mdx}'
  ],
  theme: {
    extend: {
      gridTemplateColumns: {
        'gridCard': 'repeat(3, minmax(25%, 90%))',
      },
      screens: {
        'smallTablet': '400px',
      },
      gridTemplateAreas: {
        'frame': [
          'a a',
          'b b',
          'c d'
        ],
        'frameMobile': [
          'a a',
          'b b',
          'c c',
          'd d'
        ]
      },
      margin: {
        'card': '1rem 0 0 1rem',
      },
      padding: {
        '01': '0 1rem',
        'card': '1rem 1.2rem',
        'center': '4rem 0',
        'centerMobile': '2rem 0'
      },
      colors: {
        'red': '#ff0000',
        'green': '#008000',
        'gray': '#c8c8c800'
      },
      transitionProperty: {
        'card': 'background, border',
      }
    }
  },
  plugins: [
    require('@savvywombat/tailwindcss-grid-areas')
  ]
}