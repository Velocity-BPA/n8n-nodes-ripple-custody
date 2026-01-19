/**
 * Ripple Custody n8n Node - Build Configuration
 *
 * SPDX-License-Identifier: BSL-1.1
 * Copyright (c) 2025 Velocity BPA
 */

const { src, dest, series } = require('gulp');
const path = require('path');

/**
 * Copy icon files to dist directory
 */
function copyIcons() {
	return src('nodes/**/*.svg')
		.pipe(dest('dist/nodes'));
}

/**
 * Copy credential icons to dist directory
 */
function copyCredentialIcons() {
	return src('credentials/**/*.svg')
		.pipe(dest('dist/credentials'));
}

/**
 * Copy package.json to dist
 */
function copyPackageJson() {
	return src('package.json')
		.pipe(dest('dist'));
}

/**
 * Copy license files to dist
 */
function copyLicenses() {
	return src(['LICENSE', 'COMMERCIAL_LICENSE.md', 'LICENSING_FAQ.md', 'README.md'])
		.pipe(dest('dist'));
}

exports.default = series(copyIcons, copyCredentialIcons, copyPackageJson, copyLicenses);
exports.copyIcons = copyIcons;
exports.copyCredentialIcons = copyCredentialIcons;
exports.copyPackageJson = copyPackageJson;
exports.copyLicenses = copyLicenses;
