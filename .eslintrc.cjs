module.exports = {
	root: true,
	parser: '@typescript-eslint/parser',
	extends: ['eslint:recommended', 'plugin:@typescript-eslint/recommended', 'prettier'],
	plugins: ['svelte3', '@typescript-eslint', 'simple-import-sort'],
	ignorePatterns: ['*.cjs'],
	rules: {
		'@typescript-eslint/ban-ts-comment': ['off'],
		'@typescript-eslint/ban-types': ['off'],
		'@typescript-eslint/explicit-module-boundary-types': ['off'],
		'@typescript-eslint/no-inferrable-types': ['off']
	},
	overrides: [
		{
			files: ['*.svelte'],
			processor: 'svelte3/svelte3'
		},
		{
			files: ['*.ts'],
			rules: {
				'simple-import-sort/imports': ['error', {
					groups: [
						['^[^@.].*\\u0000$', '^.*\u0000$'],
						['^\\u0000'],
						['^@?\\w'],
						['^'],
						['^\\.\\.(?!/?$)', '^\\.\\./?$'],
						['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$']
					]
				}]
			}
		}
	],
	settings: {
		'svelte3/typescript': () => require('typescript')
	},
	parserOptions: {
		sourceType: 'module',
		ecmaVersion: 2019
	},
	env: {
		browser: true,
		es2017: true,
		node: true
	}
};
