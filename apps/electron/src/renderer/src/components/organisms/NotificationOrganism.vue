<template>
	<div class="o-notification">
		<NotificationCollectionMolecule />
		<div class="buttons">
			<NotificationButtonAtom />
		</div>
	</div>
</template>

<script setup lang="ts">
import { useConfigStore } from '@web/stores/configStore'
import NotificationButtonAtom from '../atoms/NotificationButtonAtom.vue'
import NotificationCollectionMolecule from '../molecules/NotificationCollectionMolecule.vue'
import { computed } from 'vue'

// STORES
const configStore = useConfigStore()

// GETTER
const offsetBottom = computed(() => configStore.config.notifications.offsetBottom)
</script>

<style scoped>
.o-notification {
	position: absolute;
	width: 100%;
	bottom: v-bind(offsetBottom);
	display: grid;
	gap: 1rem;
}

.buttons {
	justify-self: end;
}
</style>
