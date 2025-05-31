module.exports = {
  plugins: {
    'postcss-import': {},
    '@tailwindcss/nesting': 'postcss-nesting',
    '@tailwindcss/postcss': {},
    autoprefixer: {},
    'postcss-preset-env': {
      features: {
        'nesting-rules': false,
      },
    },
  },
};
