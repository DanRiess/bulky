import { RouteRecordRaw, createRouter, createWebHistory } from 'vue-router'
import { authGuard } from './guards/authGuard'

const routes: RouteRecordRaw[] = [
	{
		path: '/',
		name: 'Home',
		component: () => import(/* webpackChunkName: "home" */ '../views/HomeView.vue'),
	},
	{
		path: '/app-update',
		name: 'AppUpdate',
		component: () => import(/* webpackChunkName: "app-update" */ '../views/AppUpdateView.vue'),
	},
	{
		path: '/attachment-panel',
		name: 'AttachmentPanel',
		component: () => import(/* webpackChunkName: "attachment-panel" */ '../views/AttachmentPanelView.vue'),
	},
	{
		path: '/auth',
		name: 'Auth',
		component: () => import(/* webpackChunkName: "auth" */ '../views/AuthView.vue'),
	},
	{
		path: '/shop',
		name: 'Shop',
		component: () => import(/* webpackChunkName: "shop" */ '../views/ShopView.vue'),
		beforeEnter: authGuard(),
	},
	{
		path: '/shop/create',
		name: 'CreateOffer',
		component: () => import(/* webpackChunkName: "create-offer" */ '../views/ShopCreateOfferView.vue'),
	},
	{
		path: '/shop/edit/:uuid',
		name: 'EditOffer',
		component: () => import(/* webpackChunkName: "edit-offer" */ '../views/ShopEditOfferView.vue'),
		props: true,
	},
	{
		path: '/bazaar',
		name: 'Bazaar',
		component: () => import(/* webpackChunkName: "bazaar" */ '../views/BazaarView.vue'),
		beforeEnter: authGuard(),
	},
	{
		path: '/settings',
		name: 'Settings',
		component: () => import(/* webpackChunkName: "settings" */ '../views/SettingsView.vue'),
	},
]

export const router = createRouter({
	history: createWebHistory(import.meta.env.BASE_URL),
	routes,
})
