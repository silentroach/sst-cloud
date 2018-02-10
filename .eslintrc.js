module.exports = {
	env: {
		es6: true,
		node: true
	},
	parserOptions: {
		ecmaVersion: 2017
	},
	plugins: [
		'ava'
	],
	extends: ['eslint:recommended', 'plugin:ava/recommended'],
	
	rules: {
		'no-trailing-spaces': 'error'
	}
};