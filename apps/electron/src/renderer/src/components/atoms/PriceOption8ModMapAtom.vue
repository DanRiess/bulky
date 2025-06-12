<template>
  <li class="a-map-price-option">
    <div class="map">{{ type }}</div>
    <div class="dash">&mdash;</div>
    <div class="quant">Amount: {{ amount }}</div>
    <div class="dash">&ndash;</div>
    <LabelWithNumberInput v-model="model" :step="1"
      >Base Price:</LabelWithNumberInput
    >
    <div class="chaos">
      <img
        src="/src/assets/png-icons/currency-chaos.png"
        height="24"
        width="24"
        decoding="async"
        loading="lazy"
      />
    </div>
  </li>
</template>

<script setup lang="ts">
import LabelWithNumberInput from "../molecules/LabelWithNumberInput.vue";

// MODEL
const model = defineModel<number>({ required: true });

// PROPS
defineProps<{
  type:
    | "8 Mod Basic"
    | "8 Mod Delirious"
    | "8 Mod Originator"
    | "8 Mod Deli + Originator";
  amount: number;
}>();
</script>

<style scoped>
.a-map-price-option {
  margin-left: 2.5rem;
  height: 1.5rem;
  display: grid;
  grid-template-columns: subgrid;
  grid-column: span 8;
  align-items: center;
}

/* .a-map-price-option::before {
	content: '';
	position: absolute;
	padding-top: 2rem;
	margin-top: -2rem;
	left: -1.5rem;
	top: 0;
	bottom: 0;
	transform: translateY(-25%);
	width: 1rem;
	border-left: 1px solid white;
	border-bottom: 1px solid white;
} */
</style>
