<template>
	<div class="m-info-panel" @mouseenter="hovered = true" @mouseleave="hovered = false">
		<SvgIconAtom name="infoThick" :width="iconWidth" />
		<ButtonTooltipAtom :active="hovered" v-bind="popupProps" :max-width="tooltipWidth">
			<slot />
		</ButtonTooltipAtom>
	</div>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue'
import ButtonTooltipAtom from '../atoms/ButtonTooltipAtom.vue'
import SvgIconAtom from '../atoms/SvgIconAtom.vue'

// PROPS
const props = withDefaults(
	defineProps<{
		popupProps?: Omit<InstanceType<typeof ButtonTooltipAtom>['$props'], 'active'>
		iconWidth?: number
	}>(),
	{
		popupProps: () => ({
			position: 'bottom',
			transitionDirection: 'toBottom',
			popupAlignment: 'left',
		}),
		iconWidth: 24,
	}
)

// STATE
const hovered = ref(false)

// GETTERS
const tooltipWidth = computed(() => {
	return props.popupProps.maxWidth ?? 250
})
</script>

<style scoped>
.m-info-panel {
	position: relative;
	cursor: pointer;
}
</style>
