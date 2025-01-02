<template>
	<div class="m-refetch-offers">
		<LabelWithCheckboxMolecule v-model="configStore.config.autoRefetchOffers" label-position="right">
			<div class="special-label">
				{{ labelText }}
				<template v-if="timeRemaining === 0 && configStore.config.autoRefetchOffers">
					<SvgIconAtom name="refresh" :rotate="true" :use-gradient="true" />
				</template>
			</div>
		</LabelWithCheckboxMolecule>
	</div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import LabelWithCheckboxMolecule from './LabelWithCheckboxMolecule.vue'
import { useConfigStore } from '@web/stores/configStore'
import SvgIconAtom from '../atoms/SvgIconAtom.vue'

// STORES
const configStore = useConfigStore()

// PROPS
const props = defineProps<{
	timeRemaining: number
}>()

// GETTERS
const labelText = computed(() => {
	if (configStore.config.autoRefetchOffers && props.timeRemaining > 0) {
		return `Next Update: ${props.timeRemaining} s`
	} else if (configStore.config.autoRefetchOffers) {
		return 'Updating:'
	} else {
		return `Auto Update: off`
	}
})
</script>

<style scoped>
.m-refetch-offers {
	display: grid;
	grid-template-columns: max-content max-content;
	gap: 0.5rem;
}

.special-label {
	display: flex;
	gap: 0.5rem;
	align-items: center;
	height: 24px;
}
</style>
