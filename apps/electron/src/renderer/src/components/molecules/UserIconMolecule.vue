<template>
	<div class="user-icon" @mouseenter="menuExpanded = true" @mouseleave="menuExpanded = false">
		<SvgIconAtom :name="iconName" :use-gradient="true" cursor="pointer" />
		<TransitionAtom v-on="hooks">
			<ul class="popup-menu radial-gradient" v-if="menuExpanded" data-b-override>
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
import { ButtonBackgroundColorScheme } from '@shared/types/utility.types'
import { useGenericTransitionHooks } from '@web/transitions/genericTransitionHooks'
import TransitionAtom from '../atoms/TransitionAtom.vue'

// STORES
const authStore = useAuthStore()

// PROPS
const props = withDefaults(
	defineProps<{
		backgroundColor?: ButtonBackgroundColorScheme
	}>(),
	{
		backgroundColor: 'dark',
	}
)

// STATE
const router = useRouter()
const menuExpanded = ref(false)

// GETTERS
const iconName = computed(() => {
	console.log('profile changed')
	return authStore.profile ? 'person' : 'person-cancel'
})

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

const backgroundColorMenu = computed(() => {
	return props.backgroundColor === 'light'
		? 'var(--dr-background-color-button-light)'
		: 'var(--dr-background-color-button-dark)'
})

// HOOKS
const hooks = useGenericTransitionHooks({
	scaleY: 0.01,
	opacity: 0,
	duration: 0.25,
})
</script>

<style scoped>
.user-icon {
	position: relative;
}

.popup-menu {
	position: absolute;
	padding: 0.25rem 0.5rem;
	background-color: v-bind(backgroundColorMenu);
	border: 1px solid white;
	width: max-content;
	right: 0;
	transform-origin: top;
	border-radius: var(--border-radius-small);
}

.popup-menu li {
	cursor: pointer;
}
</style>
