<template>
	<TransitionGroup name="list">
		<slot />
	</TransitionGroup>
</template>

<style>
/* Standard vue transition component based on css */

/* 1. declare transition */
.list-move,
.list-enter-active,
.list-leave-active {
	transition: all 0.5s cubic-bezier(0.55, 0, 0.1, 1);
}

/* 2. declare enter from and leave to state */
.list-enter-from,
.list-leave-to {
	opacity: 0;
	transform: scaleY(0.01);
}

/* 3. ensure leaving items are taken out of layout flow so that moving
      animations can be calculated correctly. */
.list-leave-active {
	position: absolute;
}
</style>
