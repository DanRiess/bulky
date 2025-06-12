<template>
  <li class="a-bazaar-offer-item">
    <div class="item-data">
      <div class="name">{{ item.name }}</div>
      <div class="stack-size">x{{ item.quantity }}</div>
      <div class="price">
        <span>{{ price }}</span>
        <img
          src="/src/assets/png-icons/currency-chaos.png"
          height="24"
          width="24"
          decoding="async"
          loading="lazy"
        />
      </div>
      <div
        class="regex"
        ref="tooltipParentElement"
        @mouseenter="showTooltip = true"
        @mouseleave="showTooltip = false"
      >
        <SvgIconAtom
          name="listRemove"
          :color="
            toValue(item.priceOverrideMap8Mod).avoidRegex.available
              ? 'var(--color-success)'
              : 'var(--color-error)'
          "
        />
        <SvgIconAtom
          name="listAdd"
          :color="
            toValue(item.priceOverrideMap8Mod).wantedRegex.available
              ? 'var(--color-success)'
              : 'var(--color-error)'
          "
        />
        <SvgIconAtom
          name="quantity"
          :color="
            toValue(item.priceOverrideMap8Mod).quantityRegex[0].available
              ? 'var(--color-success)'
              : 'var(--color-error)'
          "
        />
        <SvgIconAtom
          name="packsize"
          :color="
            toValue(item.priceOverrideMap8Mod).packsizeRegex[0].available
              ? 'var(--color-success)'
              : 'var(--color-error)'
          "
        />
      </div>
      <TooltipAtom
        :show="showTooltip"
        :parent="tooltipParentElement"
        :max-width="300"
      >
        <RegexTooltipTemplate :prices="toValue(item.priceOverrideMap8Mod)" />
      </TooltipAtom>
    </div>
  </li>
</template>

<script setup lang="ts">
import { ShopMap8Mod } from "@web/categories/map/map.types";
import { UnwrapRef, computed, ref, toValue } from "vue";
import SvgIconAtom from "./SvgIconAtom.vue";
import TooltipAtom from "./TooltipAtom.vue";
import RegexTooltipTemplate from "../implementations/RegexTooltipTemplate.vue";

// PROPS
const props = defineProps<{
  item: ShopMap8Mod | UnwrapRef<ShopMap8Mod>;
}>();

// STATE
const tooltipParentElement = ref<HTMLElement>();
const showTooltip = ref(false);

const price = computed(() => {
  const po = toValue(props.item.priceOverrideMap8Mod);
  const prices = [
    po.base,
    po.baseDeli,
    po.originator,
    po.originatorDeli,
  ].filter((p) => p > 0);
  const lowest = Math.min(...prices);
  const highest = Math.max(...prices);
  return lowest === highest ? lowest : `${lowest} - ${highest}`;
});
</script>

<style scoped>
.a-bazaar-offer-item {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: span 4;
  align-items: center;
  user-select: none;
  transition: all 0.25s ease;
}

.item-data {
  display: grid;
  grid-template-columns: subgrid;
  grid-column: span 4;
  align-items: center;
  user-select: none;
}

.name {
  text-align: left;
  text-wrap: nowrap;
  overflow: hidden;
  margin-right: 0.5rem;
}

.stack-size {
  text-align: left;
  padding-left: 0.25rem;
  padding-right: 0.4rem;
}

.price {
  display: flex;
  gap: 0.25rem;
}

.regex {
  display: flex;
  gap: 0.15rem;
}
</style>
