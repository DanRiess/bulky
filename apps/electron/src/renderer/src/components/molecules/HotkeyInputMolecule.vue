<template>
	<div
		ref="hotkeyInput"
		class="m-hotkey-input gradient-border"
		:class="{ 'active-class': active }"
		@click="handleClick"
		data-b-override>
		<LabelAtom :id="uuid">
			<slot />
		</LabelAtom>
		<div class="keys">
			<KeyboardKeyAtom v-for="key in separateKeys" :key="key" :key-to-render="key" />
		</div>
	</div>
</template>

<script setup lang="ts">
import LabelAtom from '../atoms/LabelAtom.vue'
import { BULKY_UUID } from '@web/utility/uuid'
import { computed, ref } from 'vue'
import KeyboardKeyAtom from '../atoms/KeyboardKeyAtom.vue'
import { onClickOutside } from '@vueuse/core'
import { BulkyHotkeyStruct } from '@shared/types/config.types'

/**
 * This model string needs to be key characters separated by a + sign.
 * E. g. CTRL+SPACE
 */
const keyModel = defineModel<string>({ required: false })

// PROPS
const props = defineProps<{
	keyStruct: BulkyHotkeyStruct
}>()

// STATE
const hotkeyInput = ref<HTMLElement>()
const active = ref(false)
const uuid = BULKY_UUID.generateTypedUuid()

// COMPOSABLES
onClickOutside(hotkeyInput, () => {
	active.value = false
	document.removeEventListener('keydown', setInput)
})

// GETTERS
const separateKeys = computed(() => {
	return keyModel.value?.split('+') ?? []
})

// METHODS
function handleClick() {
	active.value = !active.value

	if (active.value === true) {
		document.addEventListener('keydown', setInput)
	} else {
		document.removeEventListener('keydown', setInput)
	}
}

function setInput(e: KeyboardEvent) {
	e.preventDefault()

	// Reset when user presses escape
	if (e.code === 'Escape') {
		active.value = false
		document.removeEventListener('keydown', setInput)
		return
	}

	// Remove the key binding on Backspace or Delete click.
	if (e.code === 'Backspace' || e.code === 'Delete') {
		if (!props.keyStruct.required) {
			keyModel.value = ''
		}
		active.value = false
		document.removeEventListener('keydown', setInput)
		return
	}

	// Ignore shift, control and alt keys. They will be accounted for later.
	const keysToIgnore = ['shift', 'alt', 'control']
	if (keysToIgnore.some(keyToIgnore => e.code.toLowerCase().includes(keyToIgnore))) return

	// If it's any other key, construct the combined key code.
	keyModel.value = `${e.ctrlKey ? 'CTRL+' : ''}${e.shiftKey ? 'SHIFT+' : ''}${e.altKey ? 'ALT+' : ''}${e.code
		.replace('Key', '')
		.replace('Digit', '')
		.toUpperCase()}`

	active.value = false
	document.removeEventListener('keydown', setInput)
}
</script>

<style scoped>
.m-hotkey-input {
	display: grid;
	grid-template-columns: subgrid;
	grid-template-areas: 'left right';
	grid-column: span 2;
	align-items: center;
	padding: 0.5rem 1rem;
	cursor: pointer;
	border-radius: var(--border-radius-small);
}

.m-hotkey-input:hover {
	background-color: rgb(255 255 255 / 0.1);
}

.m-hotkey-input.active-class {
	background-color: rgb(255 255 255 / 0.1);
	--show-border: 1;
}

.keys {
	display: flex;
	gap: 0.5rem;
}
</style>
