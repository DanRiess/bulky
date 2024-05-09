<template>
	<div class="m-bazaar-offer-items">
		<header class="header">
			<ExpandSectionAtom :expanded="expanded" @toggle-expanded="expanded = !expanded" />
			<h3 class="no-select">Items</h3>
		</header>

		<AccordionTransitionWrapperAtom :expanded="expanded">
			<ul class="item-list">
				<TransitionAtom :group="true" v-on="hooks">
					<BazaarOfferItemAtom
						v-for="item in computedItemDisplayValues"
						:full-buyout-watcher="fullBuyoutWatcher"
						:computed-item-display-values="item" />
				</TransitionAtom>
			</ul>
		</AccordionTransitionWrapperAtom>
	</div>
</template>

<script setup lang="ts">
import ExpandSectionAtom from '../atoms/ExpandSectionAtom.vue'
import { useListTransition } from '@web/transitions/listTransition'
import TransitionAtom from '../atoms/TransitionAtom.vue'
import { computed, onMounted, ref, watch } from 'vue'
import AccordionTransitionWrapperAtom from '../atoms/AccordionTransitionWrapperAtom.vue'
import { ComputedItemDisplayValues } from '@shared/types/bulky.types'
import BazaarOfferItemAtom from '../atoms/BazaarOfferItemAtom.vue'

// PROPS
const props = defineProps<{
	fullBuyoutWatcher: boolean
	computedItemDisplayValues: ComputedItemDisplayValues[]
}>()

// STATE
const expanded = ref(!props.fullBuyoutWatcher)

// WATCHERS
watch(
	() => props.fullBuyoutWatcher,
	bool => {
		expanded.value = !bool
	}
)

// GETTERS
const gridTemplateColumns = computed(() => {
	return props.fullBuyoutWatcher
		? 'fit-content(20ch) minmax(4ch, 1fr) fit-content(3.5ch) 1ch fit-content(3.5ch) 24px'
		: 'fit-content(20ch) minmax(4ch, 1fr) fit-content(4ch) fit-content(2.5ch) 0.75ch fit-content(2.75ch) 24px'
})

// HOOKS
const hooks = useListTransition({
	duration: 0.35,
})

onMounted(() => {
	expanded.value = !props.fullBuyoutWatcher
})
</script>

<style scoped>
.item-list {
	display: grid;
	grid-template-columns: v-bind(gridTemplateColumns);
	gap: 0.2rem;
	margin-top: 0.5rem;
}

.header {
	display: grid;
	grid-template-columns: 1.5rem auto;
	align-items: center;
	gap: 0.25rem;
}
</style>
