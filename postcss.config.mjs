/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: {
    '@csstools/postcss-color-function': {},
    '@csstools/postcss-oklab-function': {
      preserve: false
    },
    '@tailwindcss/postcss': {},
    autoprefixer: {},
  },
};

export default config;
