<template>
	<div class="transition-wrapper" :class="{ expanded }">
		<div ref="overflowEl" class="flow" style="isolation: isolate">
			<slot />
		</div>
	</div>
</template>

<script setup lang="ts">
import { onMounted, ref, watch } from 'vue'

const props = withDefaults(
	defineProps<{
		expanded: boolean
		transitionTime?: number
	}>(),
	{
		transitionTime: 250,
	}
)

watch(
	() => props.expanded,
	expanded => {
		computeOverflowProperty(expanded)
	}
)

const overflowEl = ref<HTMLElement | null>(null)

/**
 * If overflow is hidden constantly, the absolute comboboxes would not be able to overflow either.
 * This function makes sure to only hide the overflow during the transition or when the content is collapsed.
 */
function computeOverflowProperty(expanded: boolean) {
	if (!overflowEl.value) return

	if (expanded) {
		setTimeout(() => {
			if (!overflowEl.value) return
			overflowEl.value.classList.remove('hide-overflow')
		}, props.transitionTime)
	} else {
		if (!overflowEl.value.classList.contains('hide-overflow')) {
			overflowEl.value.classList.add('hide-overflow')
		}
	}
}

onMounted(() => {
	computeOverflowProperty(props.expanded)
})
</script>

<style scoped>
.transition-wrapper {
	--transition-time: v-bind(transitionTime + 'ms');

	display: grid;
	grid-template-rows: 0fr;
	transition: grid-template-rows var(--transition-time) ease-out, margin-top var(--transition-time) ease-out;
}

.transition-wrapper.expanded {
	grid-template-rows: 1fr;
}

.transition-wrapper:not(.expanded) {
	margin-top: 0;
}

.hide-overflow {
	overflow: hidden;
}
</style>
