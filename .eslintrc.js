/**
 * SPDX-License-Identifier: BSL-1.1
 * Copyright (c) 2025 Velocity BPA
 */

module.exports = {
	root: true,
	env: {
		browser: false,
		es2021: true,
		node: true,
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaVersion: 2021,
		sourceType: 'module',
		project: ['./tsconfig.json'],
	},
	plugins: ['@typescript-eslint', 'n8n-nodes-base'],
	extends: [
		'eslint:recommended',
		'plugin:@typescript-eslint/recommended',
		'plugin:n8n-nodes-base/community',
	],
	rules: {
		'@typescript-eslint/no-explicit-any': 'warn',
		'@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
		'@typescript-eslint/explicit-function-return-type': 'off',
		'@typescript-eslint/no-non-null-assertion': 'off',
		'n8n-nodes-base/node-param-description-missing-final-period': 'off',
		'n8n-nodes-base/node-param-description-missing-for-ignore-ssl-issues': 'off',
		'no-console': 'warn',
		'prefer-const': 'error',
		'no-var': 'error',
	},
	ignorePatterns: [
		'node_modules/',
		'dist/',
		'*.js',
		'!.eslintrc.js',
		'!gulpfile.js',
	],
};
