import {
  BulkyBazaarItem,
  BulkyBazaarOffer,
  BulkyFilter,
  ComputedBulkyOfferStore,
  TotalPrice,
} from "@shared/types/bulky.types";
import { BULKY_TRANSFORM } from "./transformers";
import { MaybeComputedRef } from "@shared/types/utility.types";
import { toValue } from "vue";
import { BULKY_MAPS } from "@web/categories/map/map.transformers";
import { BULKY_FACTORY } from "./factory";

export function generateWhisperMessage(
  offer: BulkyBazaarOffer,
  filter: BulkyFilter,
  items: MaybeComputedRef<BulkyBazaarItem[]>,
  price: MaybeComputedRef<TotalPrice>,
  priceComputeFn: ComputedBulkyOfferStore["calculateBaseItemPrice"]
) {
  let itemText = "";

  if (filter.fullBuyout) {
    itemText = `full ${BULKY_TRANSFORM.stringToDisplayValue(
      offer.category
    )} listing`;
  } else {
    itemText = toValue(items)
      .map((item) => {
        console.log({ item });
        let adjustedItem = item;
        let secondaryTypeOption = 0;

        if (item.category === "MAP_8_MOD") {
          const perItemAttributes =
            BULKY_MAPS.filterIndividual8ModItemsBySubtype(item, filter);
          if (perItemAttributes) {
            adjustedItem = {
              ...item,
              perItemAttributes,
            };
          }

          secondaryTypeOption =
            filter.delirious && filter.originator
              ? 4
              : filter.originator
              ? 2
              : filter.delirious
              ? 1
              : 0;
        }

        const name =
          BULKY_FACTORY.getNameFromTypeAndTier(
            item.category,
            item,
            secondaryTypeOption
          ) ?? item.name;
        console.log({ name });

        // Calculate the quantity.
        const filterField = filter.fields.find(
          (field) =>
            field.type === adjustedItem.type && field.tier === adjustedItem.tier
        );
        const quantity =
          filter.alwaysMaxQuantity || filter.fullBuyout
            ? adjustedItem.computedQuantity
            : filterField?.quantity ?? 0;

        // Return the string
        return `${quantity}x ${name} (${priceComputeFn(
          adjustedItem,
          filter
        )}c each)`;
      })
      .join(", ");
  }

  return `@${offer.ign} Hi, I'd like to buy your ${itemText} for ${
    toValue(price).divine > 0 ? Math.round(toValue(price).divine) + " div " : ""
  }${Math.round(toValue(price).chaos)} chaos in ${offer.league}.`;
}
