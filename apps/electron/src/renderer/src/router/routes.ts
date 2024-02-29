import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'Home',
		component: () => import(/* webpackChunkName: "home" */ '../views/HomeView.vue'),
	},
	{
		path: '/attachment-panel',
		name: 'AttachmentPanel',
		component: () => import(/* webpackChunkName: "attachment-panel" */ '../views/AttachmentPanelView.vue'),
	},
]

export const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
})
