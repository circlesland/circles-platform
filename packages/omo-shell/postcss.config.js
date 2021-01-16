const tailwind = require('tailwindcss');
const autoprefixer = require('autoprefixer');
const postcssPresetEnv = require('postcss-preset-env');

const production = !process.env.NODE_ENV;

module.exports = {
	plugins: production ? [
		tailwind,
        autoprefixer,
		postcssPresetEnv,
	] : [
		tailwind,
        autoprefixer,
        postcssPresetEnv,
	],
	minimize: production,
	sourceMap: true,
};