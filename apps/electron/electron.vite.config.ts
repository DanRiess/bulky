import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
	main: {
		plugins: [externalizeDepsPlugin()],
		resolve: {
			alias: {
				'@shared': resolve('src/shared'),
				'@web': resolve('src/renderer/src'),
				'@main': resolve('src/main'),
			},
		},
	},
	preload: {
		plugins: [externalizeDepsPlugin()],
		resolve: {
			alias: {
				'@shared': resolve('src/shared'),
				'@web': resolve('src/renderer/src'),
			},
		},
	},
	renderer: {
		resolve: {
			alias: {
				'@web': resolve('src/renderer/src'),
				'@main': resolve('src/main'),
				'@shared': resolve('src/shared'),
			},
		},
		plugins: [vue()],
		server: {
			port: 5174,
		},
	},
})
