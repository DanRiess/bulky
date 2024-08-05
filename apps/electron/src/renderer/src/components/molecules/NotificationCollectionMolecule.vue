<template>
	<AccordionTransitionWrapperAtom :expanded="true">
		<ul class="m-notification-collection">
			<NotificationMolecule />
			<NotificationMolecule />
			<NotificationMolecule />
			<NotificationMolecule />
			<NotificationMoleculeRegex
				ign="Chavincar"
				encoded-message="MDQwNTYwMTYwMTI4OTg5JVJYJW15Y29vbHJlZ2V4cXdlcnR5dWlvcGFzZGZnaGprbHp4Y3Zibm1xd2VydHl1aW9wYXM=" />
		</ul>
	</AccordionTransitionWrapperAtom>
</template>

<script setup lang="ts">
import AccordionTransitionWrapperAtom from '../atoms/AccordionTransitionWrapperAtom.vue'
import NotificationMolecule from './NotificationMolecule.vue'
import NotificationMoleculeRegex from './NotificationMoleculeRegex.vue'
</script>

<style scoped>
.m-notification-collection {
	display: grid;
	gap: 0.5rem;
}
</style>
