/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@tailwindcss/postcss': {},
    '@csstools/postcss-oklab-function': { preserve: false },
    '@csstools/postcss-color-function': {},
    'postcss-color-mod-function': {},
    autoprefixer: {},
  },
};

export default config;
