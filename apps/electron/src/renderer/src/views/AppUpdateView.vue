<template>
	<div class="v-app-update animated-gradient-background flow" data-b-override>
		<h1 class="header">Searching for Update</h1>
		<div class="icon">
			<SvgIconAtom name="bulky" width="72" :use-gradient="true" :active="true" />
		</div>
		<div class="status">Status: {{ BULKY_TRANSFORM.stringToDisplayValue(updateStatus) }}</div>
		<div class="additional-info">
			<template v-if="downloadProgress">
				<ProgressBarAtom :percentage="downloadProgress.percent" />
				<div class="numeric-progress">
					{{ (downloadProgress.transferred / 1024 / 1024).toFixed(2) }} /
					{{ (downloadProgress.total / 1024 / 1024).toFixed(2) }} MB
				</div>
			</template>
			<template v-else-if="updateStatus === 'SUCCESS'"> Restarting and installing new version now! </template>
		</div>
	</div>
</template>

<script setup lang="ts">
import { AppUpdateStatus } from '@shared/types/electron.types'
import ProgressBarAtom from '@web/components/atoms/ProgressBarAtom.vue'
import SvgIconAtom from '@web/components/atoms/SvgIconAtom.vue'
import { BULKY_TRANSFORM } from '@web/utility/transformers'
import { ProgressInfo } from 'electron-updater'

defineProps<{
	updateStatus: AppUpdateStatus
	downloadProgress?: ProgressInfo
}>()
</script>

<style scoped>
.v-app-update {
	display: flex;
	flex-direction: column;
	align-items: center;
	gap: 0.35rem;
	background-color: var(--color-darker);
	border: 1px solid var(--color-dark);
	border-radius: 1rem;
	padding: 1rem;
	margin-bottom: 35%;
	user-select: none;
}

.header {
	font-size: 1.1rem;
	font-weight: 700;
}

.additional-info {
	width: 80%;
	text-align: center;
}
</style>
