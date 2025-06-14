<template>
	<div class="m-filter-field">
		<div class="field-type">
			<InputSelectAtom
				v-model="filterField.type"
				@update:model-value="updateTierWhenTypeChanges"
				:id="itemId"
				:options="store.filterFieldTypeOptions"></InputSelectAtom>
		</div>

		<!-- A filter has at least one secondary option, because it's required for consistent typing -->
		<div class="field-tier" v-if="filterFieldTierOptions.length > 1">
			<InputSelectAtom v-model="filterField.tier" :id="modifierId" :options="filterFieldTierOptions"></InputSelectAtom>
		</div>
		<div class="field-quantity" :class="{ hidden: store.filter.alwaysMaxQuantity }">
			<InputNumberAtom v-model="filterField.quantity" :id="quantityId" :min="1" :max="999999" />
		</div>
		<div class="field-remove" @click="emit('removeFilterField')" v-if="!disableRemove">
			<SvgIconAtom name="close" cursor="pointer" :use-gradient="true" />
		</div>
	</div>
</template>

<script setup lang="ts" generic="MainOptionType extends string, SecondaryOptionType extends string">
import { BULKY_UUID } from '@web/utility/uuid'
import InputSelectAtom from '../atoms/InputSelectAtom.vue'
import InputNumberAtom from '../atoms/InputNumberAtom.vue'
import SvgIconAtom from '../atoms/SvgIconAtom.vue'
import { computed } from 'vue'
import { BulkyFilterField, ComputedBulkyFilterStore } from '@shared/types/bulky.types'

// MODELS
const filterField = defineModel<BulkyFilterField>({ required: true })

//PROPS
const props = defineProps<{
	store: ComputedBulkyFilterStore
	zIndex: number
}>()

// EMITS
const emit = defineEmits<{
	removeFilterField: []
}>()

// STATE
const itemId = BULKY_UUID.generateTypedUuid()
const modifierId = BULKY_UUID.generateTypedUuid()
const quantityId = BULKY_UUID.generateTypedUuid()

// GETTERS

/**
 * Some categories have items that can have tiers and items that don't.
 * For those categories, add extra rules about which tiers to display here.
 */
const filterFieldTierOptions = computed<BulkyFilterField['tier'][]>(() => {
	if (filterField.value.category === 'EXPEDITION') {
		return filterField.value.type.match(/logbook/i) ? ['ILVL_68-72', 'ILVL_73-77', 'ILVL_78-82', 'ILVL_83+'] : ['0']
	} else if (filterField.value.category === 'HEIST') {
		return filterField.value.type === "ROGUE'S_MARKER" ? ['0'] : ['ILVL_68-72', 'ILVL_73-77', 'ILVL_78-82', 'ILVL_83+']
	} else if (filterField.value.category === 'ESSENCE') {
		return filterField.value.type.match(/hyste|deli|horr|insan/i) ? ['TIER_8'] : ['SCREAMING', 'SHRIEKING', 'DEAFENING']
	}

	return props.store.filterFieldTierOptions
})

const disableRemove = computed(() => {
	return props.store.filter.fields.length <= 1
})

// METHODS

/**
 * For categories where not all tiers are applicable to all items,
 * add additional rules here when the item type changes
 */
function updateTierWhenTypeChanges(type: typeof filterField.value.type) {
	// Expedition
	if (filterField.value.category === 'EXPEDITION') {
		if (type.match(/logbook/i) && filterField.value.tier === '0') {
			filterField.value.tier = 'ILVL_83+'
		} else if (!type.match(/logbook/i)) {
			filterField.value.tier = '0'
		}
	}
	// Heist
	else if (filterField.value.category === 'HEIST') {
		if (type === "ROGUE'S_MARKER") {
			filterField.value.tier = '0'
		} else if (filterField.value.tier === '0') {
			filterField.value.tier = 'ILVL_83+'
		}
	}
	// Essence
	else if (filterField.value.category === 'ESSENCE') {
		if (type.match(/hyste|deli|horr|insan/i)) {
			filterField.value.tier = 'TIER_8'
		} else if (filterField.value.tier === 'TIER_8') {
			filterField.value.tier = 'DEAFENING'
		}
	}
}

// STYLE
const gridTemplateColumns = computed(() => {
	const tierOptionsAvailable = props.store.filterFieldTierOptions.length > 1 ? '1fr' : '0'
	const quant = props.store.filter.alwaysMaxQuantity ? '0' : 'min(7ch)'
	return `2fr ${tierOptionsAvailable} ${quant} 1.5rem`
})
</script>

<style scoped>
/* don't use subgrid here, it will somehow mess up the filter field animation */
.m-filter-field {
	/* display: grid;
	grid: subgrid / subgrid;
	grid-column: span 5; */
	display: grid;
	/* grid-template-columns: 2fr 1fr min(7ch) min(5ch) 1.5rem; */
	grid-template-columns: v-bind(gridTemplateColumns);
	gap: 0.5rem;
	position: relative;
	z-index: v-bind(zIndex);
	transition: grid-template-columns 0.25s ease;
}

.field-type {
	grid-column: 1/2;
}

.field-tier {
	grid-column: 2/3;
}

.field-quantity {
	place-self: center;
	grid-column: 3/4;
	transition: opacity 0.25s ease;
}

.field-remove {
	display: flex;
	align-items: center;
}
</style>
