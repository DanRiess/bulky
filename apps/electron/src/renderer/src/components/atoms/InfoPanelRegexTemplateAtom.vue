<template>
	<div class="a-info-panel-regex-template flow" style="--flow-space: 0.3em">
		<h5>What does this do?</h5>
		<p>Enable users to filter your maps with a regex. The regex will be limited by the options you choose below.</p>
		<p>Each part of the regex will incur an additional price charge that you can set.</p>
		<p>Example: Enable regexes that filter out mods your customers don't want (and nothing else).</p>
		<p>
			Set the price for 'avoid modifiers' to any number, e. g. 5c. If someone uses a regex with modifiers to avoid, they
			will see your maps that respect that filter. The price per map will be the base price + the additional 5c.
		</p>
		<p>
			If someone uses a regex with modifiers to avoid and another option, like item quantity, their search will not list
			your maps in this case.
		</p>
	</div>
</template>

<style scoped>
.a-info-panel-regex-template > p {
	font-size: 0.8rem;
}
</style>
