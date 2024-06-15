<template>
	<div class="m-shop-offer-items">
		<header class="header">
			<ExpandSectionAtom :expanded="expanded" @toggle-expanded="expanded = !expanded" />
			<h3 @click="expanded = !expanded">Items ({{ items.length }})</h3>
		</header>

		<AccordionTransitionWrapperAtom :expanded="expanded">
			<ul class="item-list">
				<TransitionAtom :group="true" v-on="hooks">
					<ShopOfferItemAtom v-for="item in items" :item="item" />
				</TransitionAtom>
			</ul>
		</AccordionTransitionWrapperAtom>
	</div>
</template>

<script setup lang="ts">
import ExpandSectionAtom from '../atoms/ExpandSectionAtom.vue'
import { useListTransition } from '@web/transitions/listTransition'
import TransitionAtom from '../atoms/TransitionAtom.vue'
import { ref } from 'vue'
import AccordionTransitionWrapperAtom from '../atoms/AccordionTransitionWrapperAtom.vue'
import { BulkyItem } from '@shared/types/bulky.types'
import ShopOfferItemAtom from '../atoms/ShopOfferItemAtom.vue'

// PROPS
defineProps<{
	items: BulkyItem[]
}>()

// STATE
const expanded = ref(false)

// HOOKS
const hooks = useListTransition({
	duration: 0.35,
})
</script>

<style scoped>
.item-list {
	display: grid;
	grid-template-columns: fit-content(25ch) minmax(4ch, 1fr) fit-content(3.5ch) 24px;
	gap: 0.2rem;
	margin-top: 0.5rem;
	max-height: 8rem;
	overflow: auto;
	padding-left: 0.5rem;
	scrollbar-gutter: stable;
}

.header {
	display: grid;
	grid-template-columns: 1.5rem auto;
	align-items: center;
	gap: 0.25rem;
	text-align: left;
	cursor: pointer;
	user-select: none;
}
</style>
