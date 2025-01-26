<template>
	<div class="a-loading-spinner">
		<div class="outer-circle"></div>
		<div class="inner-circle"></div>
	</div>
</template>

<style scoped>
.a-loading-spinner {
	position: relative;
	height: 50px;
	width: 50px;
}

.outer-circle {
	position: absolute;
	inset: 0;
	border-top: 3px solid transparent;
	border-left: 1px solid transparent;
	border-radius: 50%;
	animation: spinner 0.7s linear infinite;
	background: conic-gradient(
			from 0.65turn,
			var(--color-stop-1, var(--dr-gradient-from-bright, #00c0f9)),
			var(--color-stop-2, var(--dr-gradient-to-bright, #dc00fe)),
			var(--color-stop-1, var(--dr-gradient-from-bright, #00c0f9))
		)
		border-box;
	mask: radial-gradient(#000 100%, #0000 101%) border-box 0% 0% / 100% 100% no-repeat, linear-gradient(#000 0 0) content-box;
	mask-composite: subtract;
	clip-path: polygon(0 0, 100% 0, 100% 37%, 0 63%);
}

.inner-circle {
	position: absolute;
	inset: 10px;
	margin: auto;
	border-top: 3px solid transparent;
	border-left: 1px solid transparent;
	border-radius: 50%;
	animation: spinner 1s linear infinite reverse;
	background: conic-gradient(
			from var(--gradient-angle),
			var(--color-stop-1, var(--dr-gradient-from-bright, #00c0f9)),
			var(--color-stop-2, var(--dr-gradient-to-bright, #dc00fe)),
			var(--color-stop-1, var(--dr-gradient-from-bright, #00c0f9))
		)
		border-box;
	mask: radial-gradient(#000 100%, #0000 101%) border-box 0% 0% / 100% 100% no-repeat, linear-gradient(#000 0 0) content-box;
	mask-composite: subtract;
	clip-path: polygon(0 0, 100% 0, 100% 37%, 0 63%);
}

@keyframes spinner {
	to {
		transform: rotate(360deg);
	}
}
</style>
