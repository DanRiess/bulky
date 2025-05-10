<template>
	<SingleColumnLayout>
		<AuthOrganism />
		<div class="affiliation-notice">This product isn't affiliated with or endorsed by Grinding Gear Games in any way.</div>
	</SingleColumnLayout>
</template>

<script setup lang="ts">
import SingleColumnLayout from '@web/components/layouts/SingleColumnLayout.vue'
import AuthOrganism from '@web/components/organisms/AuthOrganism.vue'
</script>

<style scoped>
.affiliation-notice {
	position: absolute;
	bottom: 0;
	left: 0;
	right: 0;
	text-align: center;
}
</style>
