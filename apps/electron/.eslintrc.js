/** @type {import("eslint").Linter.Config} */
module.exports = {
	root: true,
	extends: ['@dan_riess/eslint-config/vue.js'],
	parser: '@typescript-eslint/parser',
	parserOptions: {
		project: true,
	},
}
