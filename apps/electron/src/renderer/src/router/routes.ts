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
	{
		path: '/auth',
		name: 'Auth',
		component: () => import(/* webpackChunkName: "auth" */ '../views/AuthView.vue'),
	},
	{
		path: '/shop',
		name: 'Shop',
		component: () => import(/* webpackChunkName: "shop" */ '../views/ShopView.vue'),
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
