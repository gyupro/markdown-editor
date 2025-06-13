/** @type {import('postcss-load-config').Config} */
const config = {
  plugins: [
    require('@tailwindcss/postcss'),
    require('@csstools/postcss-oklab-function')({ preserve: false }),
    require('@csstools/postcss-color-function'),
    require('postcss-color-mod-function'),
    require('autoprefixer'),
  ],
};

export default config;
