import js from '@eslint/js';
import prettier from 'eslint-config-prettier';
import simpleImportSort from 'eslint-plugin-simple-import-sort';
import svelte from 'eslint-plugin-svelte';
import globals from 'globals';
import ts from 'typescript-eslint';

/** @type {import('eslint').Linter.FlatConfig[]} */
export default [
	js.configs.recommended,
	...ts.configs.recommended,
	...svelte.configs['flat/recommended'],
	prettier,
	...svelte.configs['flat/prettier'],
	{
		plugins: {
			'simple-import-sort': simpleImportSort,
		},
		rules: {
			'simple-import-sort/imports': [
				'error',
				{
					groups: [
						['^[^@.].*\\u0000$', '^.*\u0000$'],
						['^\\u0000'],
						['^@?\\w'],
						['^\\u0000'],
						['^'],
						['^\\.\\.(?!/?$)', '^\\.\\./?$'],
						['^\\./(?=.*/)(?!/?$)', '^\\.(?!/?$)', '^\\./?$'],
					],
				},
			],
		},
	},
	{
		languageOptions: {
			globals: {
				...globals.browser,
				...globals.node,
			},
		},
	},
	{
		files: ['src/**/*.svelte'],
		languageOptions: {
			parserOptions: {
				parser: ts.parser,
			},
		},
	},
	{
		rules: {
			'@typescript-eslint/no-unused-expressions': 'off',
		},
	},
];
