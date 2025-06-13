<template>
  <div
    class="o-bazaar-offer animated-gradient-background"
    :class="{ disabled }"
    :style="{ zIndex: 10000 - idx }"
    data-b-override
  >
    <div class="metadata-and-whisper flow">
      <BazaarOfferMetadataMolecule
        :offer="offer"
        :min-buyout-not-met="disabled"
      />
      <ButtonAtom
        background-color="dark"
        :disabled="disabled"
        @click="sendMessage"
      >
        <template v-if="offer.contact.messageSent">
          <div class="message-sent">
            Message Sent!
            <SvgIconAtom
              name="done"
              height="24"
              color="var(--color-blue-bright)"
            />
          </div>
        </template>
        <template v-else>Whisper Player</template>
      </ButtonAtom>
    </div>

    <div class="items-and-price">
      <BazaarOfferItemsMolecule
        :filter="filter"
        :items="filteredItems"
        :price="filteredPrice"
        :price-compute-function="priceComputeFn"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from "vue";
import { nodeApi } from "@web/api/nodeApi";
import { useApi } from "@web/api/useApi";
import { generateWhisperMessage } from "@web/utility/whisper";
import { BULKY_FRAGMENT } from "@web/categories/fragment/fragment.transformers";
import {
  decodeMinifiedTradeNotification,
  generateMinifiedTradeNotification,
} from "@web/utility/minifiedTradeNotification";
import SvgIconAtom from "../atoms/SvgIconAtom.vue";
import ButtonAtom from "../atoms/ButtonAtom.vue";
import BazaarOfferMetadataMolecule from "../molecules/BazaarOfferMetadataMolecule.vue";
import BazaarOfferItemsMolecule from "../molecules/BazaarOfferItemsMolecule.vue";
import { ComputedBulkyOfferStore } from "@shared/types/bulky.types";
import {
  BulkyBazaarItem,
  BulkyBazaarOffer,
  BulkyFilter,
  TotalPrice,
} from "@shared/types/bulky.types";
import { useNotificationStore } from "@web/stores/notificationStore";
import { BULKY_MAPS } from "@web/categories/map/map.transformers";

// STORES
const notificationStore = useNotificationStore();

// PROPS
const props = defineProps<{
  idx: number;
  offer: BulkyBazaarOffer;
  filter: BulkyFilter;
  priceComputeFn: ComputedBulkyOfferStore["calculateBaseItemPrice"];
}>();

// GETTERS

const disabled = computed(() => {
  return (
    filteredPrice.value.divine * props.offer.chaosPerDiv +
      filteredPrice.value.chaos <
    props.offer.minimumBuyout
  );
});

/** Filter the offer's items based on the filter */
const filteredItems = computed<BulkyBazaarItem[]>(() => {
  // If the user wants to buy the full offer, return all items
  if (props.filter.fullBuyout) {
    return props.offer.items;
  }

  // If the user is looking for fragment sets, they have to be generated here.
  if (props.filter.category === "FRAGMENT" && props.filter.fullSets) {
    const sets = BULKY_FRAGMENT.generateItemSetsFromOffer(props.offer);

    return sets.filter((set) => {
      return props.filter.fields.find((field) => field.type === set.type);
    });
  }

  return props.offer.items.filter((item) => {
    return props.filter.fields.find(
      (field) => field.type === item.type && field.tier === item.tier
    );
  });
});

/** Calculate the price of the filtered items. */
const filteredPrice = computed<TotalPrice>(() => {
  // If 'fullBuyout' is chosen, return the offer's full price.
  // Else, calculate the filtered items price.
  const chaosValue = props.filter.fullBuyout
    ? props.offer.fullPrice
    : filteredItems.value.reduce((prev, curr) => {
        try {
          let adjustedItem = curr;
          if (curr.category === "MAP_8_MOD") {
            const perItemAttributes =
              BULKY_MAPS.filterIndividual8ModItemsBySubtype(curr, props.filter);
            if (perItemAttributes) {
              adjustedItem = {
                ...curr,
                perItemAttributes,
              };
            }
          }
          const basePrice = props.priceComputeFn(adjustedItem, props.filter);

          // If 'alwaysMaxQuantity' is picked, just return the items price * quantity.
          if (props.filter.alwaysMaxQuantity) {
            return (prev += basePrice * curr.computedQuantity);
          }

          // Find the filter field that corresponds to the item and return its quantity * the items price.
          const field = props.filter.fields.find(
            (field) => field.type === curr.type && field.tier === curr.tier
          );
          if (!field) {
            return prev;
          }

          return (prev += basePrice * field.quantity);
        } catch (e) {
          return prev;
        }
      }, 0);

  return {
    divine: Math.floor(chaosValue / props.offer.chaosPerDiv),
    chaos: chaosValue % props.offer.chaosPerDiv,
  };
});

// METHODS

/**
 * Create a whisper message and send it ingame.
 */
async function sendMessage() {
  const message = generateWhisperMessage(
    props.offer,
    props.filter,
    filteredItems,
    filteredPrice,
    props.priceComputeFn
  );

  const fullPriceInChaos =
    filteredPrice.value.divine * props.offer.chaosPerDiv +
    filteredPrice.value.chaos;
  const mtn = generateMinifiedTradeNotification(
    props.offer.category,
    filteredItems,
    fullPriceInChaos,
    props.filter,
    props.priceComputeFn
  );
  console.log({ mtn, message });

  if (!message || !mtn) {
    const notification = notificationStore.createErrorNotification({
      message: "Something went wrong. Could not generate whisper message.",
    });
    notificationStore.addErrorNotification(notification);
    return;
  }

  if (import.meta.env.VITE_NO_ATTACH_MODE === "false") {
    const request = useApi("typeInChat", nodeApi.typeInChat);
    await request.exec(`${message} B-MTN ${mtn}`);

    if (request.data.value) {
      props.offer.contact.messageSent = true;
      setTimeout(() => {
        props.offer.contact.messageSent = false;
      }, 60000);
    }
  } else {
    console.log(`${message} B-MTN ${mtn}`);
    console.log(decodeMinifiedTradeNotification(mtn));
  }
}
</script>

<style scoped>
.o-bazaar-offer {
  position: relative;
  display: grid;
  grid-template-columns: 17ch 1fr;
  gap: 1.5rem;
  padding: 0.5rem;
  border-radius: var(--border-radius-medium);
  /* transition: margin-top 1s cubic-bezier(0, 0, 0.85, 1); */
}

.price {
  float: right;
  margin-top: 0.5rem;
  margin-right: 5px;
}

.message-sent {
  display: flex;
  text-wrap: nowrap;
  gap: 0.5rem;
  /* color: transparent;
	font-weight: 600;
	background: linear-gradient(
			90deg,
			var(--color-stop-2, var(--dr-gradient-to-bright, #dc00fe)),
			var(--color-stop-1, var(--dr-gradient-from-bright, #00c0f9))
		)
		border-box;
	background-clip: text; */
  color: var(--color-blue-bright);
}

.disabled {
  opacity: 0.6 !important;
}
</style>
