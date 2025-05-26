<template>
	<div class="user-icon" ref="userIconEl" @click="menuExpanded = !menuExpanded">
		<SvgIconAtom :name="iconName" :use-gradient="true" cursor="pointer" width="100%" />
		<TransitionAtom v-on="hooks">
			<ul class="popup-menu animated-gradient-background" v-if="menuExpanded" data-b-override>
				<li v-for="option in menuOptions" :key="option.name" @click="option.click()">
					{{ option.name }}
				</li>
			</ul>
		</TransitionAtom>
	</div>
</template>

<script setup lang="ts">
import { useAuthStore } from '@web/stores/authStore'
import SvgIconAtom from '../atoms/SvgIconAtom.vue'
import { computed, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'
import TransitionAtom from '../atoms/TransitionAtom.vue'
import { onClickOutside } from '@vueuse/core'

// STORES
const authStore = useAuthStore()

// STATE
const router = useRouter()
const menuExpanded = ref(false)
const userIconEl = ref<HTMLElement | null>(null)

// GETTERS
const iconName = computed(() => (authStore.profile ? 'person' : 'person-cancel'))

const menuOptions = computed(() => {
	if (authStore.profile) {
		return [
			{
				name: 'Sign out',
				click: authStore.logout,
			},
		]
	} else {
		return [
			{
				name: 'Sign in',
				click: router.push.bind(null, { name: 'Auth' }),
			},
		]
	}
})

// HOOKS
const hooks = useGenericTransitionHooks({
	scaleY: 0.01,
	opacity: 0,
	duration: 0.25,
})

onClickOutside(userIconEl, () => {
	menuExpanded.value = false
})
</script>

<style scoped>
.user-icon {
	position: relative;
	width: 2rem;
}

.popup-menu {
	position: absolute;
	padding: 0.25rem 0.5rem;
	border: 1px solid white;
	width: max-content;
	right: 0;
	transform-origin: top;
	border-radius: var(--border-radius-small);
	z-index: 1;
}

.popup-menu li {
	cursor: pointer;
}
</style>
