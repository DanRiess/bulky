<template>
	<div class="a-info-panel-regex-template flow" style="--flow-space: 0.3em">
		<p>Enable users to filter your maps with a regex.</p>
		<p>Typically, a map regex consists of any combination of modifiers to avoid, wanted modifiers, quantity or pack size.</p>
		<p>
			For each of these categories, you can charge an additional fee on top of the base fee. These fees accumulate. E. g. a
			regex with modifiers to avoid and quantity will result in a per-map price of baseFee + avoidFee + quantFee.
		</p>
		<p>
			If you unselect a part (e. g. because you don't want users to be able to search for quantity), people using such a
			regex won't be able to see your offer.
		</p>
	</div>
</template>

<style scoped>
.a-info-panel-regex-template > p {
	font-size: 0.8rem;
}
</style>
