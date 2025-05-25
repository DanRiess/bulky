<template>
	<nav class="nav">
		<ButtonAtom :active="router.currentRoute.value.name === 'Bazaar'" @click="router.push({ name: 'Bazaar' })">
			Bazaar
		</ButtonAtom>
		<ButtonAtom :active="!!router.currentRoute.value.path.match('shop')" @click="router.push({ name: 'Shop' })">
			Shop
		</ButtonAtom>

		<div class="icon-buttons">
			<div class="current-price">
				<ChaosPerDivAtom
					:chaos-per-div="ninjaStore.chaosPerDiv"
					ref="cpdComponent"
					@mouseenter="showCPDTooltip = true"
					@mouseleave="showCPDTooltip = false" />
				<TooltipAtom :show="showCPDTooltip" :parent="cpdAtom" :max-width="200">
					<ChaosPerDivTooltipTemplate />
				</TooltipAtom>
			</div>
			<SettingsIconMolecule />
			<UserIconMolecule />
		</div>
	</nav>
</template>

<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useRouter } from 'vue-router'
import { useNinjaStore } from '@web/stores/ninjaStore'
import ButtonAtom from '../atoms/ButtonAtom.vue'
import TooltipAtom from '../atoms/TooltipAtom.vue'
import ChaosPerDivAtom from '../atoms/ChaosPerDivAtom.vue'
import SettingsIconMolecule from '../molecules/SettingsIconMolecule.vue'
import UserIconMolecule from '../molecules/UserIconMolecule.vue'
import ChaosPerDivTooltipTemplate from '../implementations/ChaosPerDivTooltipTemplate.vue'

// STORES
const ninjaStore = useNinjaStore()

// COMPOSABLES
const router = useRouter()

// STATE
const cpdComponent = ref<InstanceType<typeof ChaosPerDivAtom>>()
const cpdAtom = ref<HTMLElement>()
const showCPDTooltip = ref(false)

// HOOKS
onMounted(() => {
	if (cpdComponent.value) {
		cpdAtom.value = cpdComponent.value.$el
	}
})
</script>

<style scoped>
.nav {
	display: grid;
	gap: 0.5rem;
	grid-template-columns: 7rem 7rem 1fr auto;
	margin-bottom: 1rem;
}

.icon-buttons {
	grid-column: 4/4;
	display: flex;
	gap: 1rem;
}

.current-price {
	display: flex;
	align-items: center;
	justify-content: center;
}
</style>
