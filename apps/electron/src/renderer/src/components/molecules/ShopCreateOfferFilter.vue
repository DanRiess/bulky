<template>
	<div class="m-shop-create-offer-filter">
		<div class="tier-filter">
			<label :for="uuid">Selected Tiers:</label>
			<InputMultiSelectAtom
				v-if="filterOptions.tiers && model.selectedTiers"
				v-model="model.selectedTiers"
				:id="uuid"
				:options="filterOptions.tiers"
				:category="category"></InputMultiSelectAtom>
		</div>
	</div>
</template>

<script setup lang="ts">
import { Category, ShopFilter } from '@shared/types/bulky.types'
import { BULKY_FACTORY } from '@web/utility/factory'
import { computed } from 'vue'
import InputMultiSelectAtom from '../atoms/InputMultiSelectAtom.vue'
import { BULKY_UUID } from '@web/utility/uuid'

// MODEL
const model = defineModel<ShopFilter>({ required: true })

// STATE
const uuid = BULKY_UUID.generateTypedUuid()

// PROPS
const props = defineProps<{
	category: Category
}>()

// GETTERS
const filterOptions = computed(() => {
	const tiers = BULKY_FACTORY.getItemTiers(props.category)

	return {
		tiers,
	}
})
</script>

<style scoped>
.m-shop-create-offer-filter {
	border-top: 1px solid white;
	border-bottom: 1px solid white;
	padding-block: 0.5rem;
}
.tier-filter {
	display: flex;
	align-items: center;
	gap: 0.5rem;
	width: 100%;
}
</style>
