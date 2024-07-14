<template>
	<div class="m-info-panel" @mouseenter="hovered = true" @mouseleave="hovered = false">
		<SvgIconAtom name="infoThick" :width="iconWidth" />
		<ButtonTooltipAtom :active="hovered" v-bind="popupProps" :max-width="tooltipWidth">
			<slot />
		</ButtonTooltipAtom>
	</div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import ButtonTooltipAtom from '../atoms/ButtonTooltipAtom.vue'
import SvgIconAtom from '../atoms/SvgIconAtom.vue'

// PROPS
withDefaults(
	defineProps<{
		popupProps?: Omit<InstanceType<typeof ButtonTooltipAtom>['$props'], 'active'>
		iconWidth?: number
		tooltipWidth?: number
	}>(),
	{
		popupProps: () => ({
			position: 'bottom',
			transitionDirection: 'toBottom',
			popupAlignment: 'left',
		}),
		iconWidth: 24,
		tooltipWidth: 250,
	}
)

// STATE
const hovered = ref(false)
</script>

<style scoped>
.m-info-panel {
	position: relative;
	cursor: pointer;
}
</style>
