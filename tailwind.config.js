/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ['./public/*.html', './src/**/*.{js,ts}'],
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [
    require('@tailwindcss/forms'),
    require('@tailwindcss/typography'),
  ],
};
