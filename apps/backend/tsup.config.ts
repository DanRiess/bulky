import { defineConfig } from 'tsup'

export default defineConfig(options => {
	return {
		entry: ['src/hello.ts'],
		format: ['esm'],
		splitting: false,
		minify: !options.watch,
		clean: true,
		target: 'node20',
	}
})
