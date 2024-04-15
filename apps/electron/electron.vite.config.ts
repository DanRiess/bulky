import { resolve } from 'path'
import { defineConfig, externalizeDepsPlugin } from 'electron-vite'
import vue from '@vitejs/plugin-vue'

export default defineConfig({
	main: {
		plugins: [externalizeDepsPlugin()],
		resolve: {
			alias: {
				'@shared': resolve('src/shared'),
			},
		},
	},
	preload: {
		plugins: [externalizeDepsPlugin()],
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
	},
})
