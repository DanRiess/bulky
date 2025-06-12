import { BulkyShopItemRecord } from "@shared/types/bulky.types";
import { BULKY_MAPS } from "@web/categories/map/map.transformers";
import { MaybeRef, MaybeRefOrGetter, computed, toValue } from "vue";

export function useAggregateItemPrice(
  items: MaybeRef<BulkyShopItemRecord>,
  multiplier: MaybeRefOrGetter<number>
) {
  return computed<number>(() => {
    let price = 0;

    toValue(items).forEach((item) => {
      if (!item.selected) return;
      if (item.priceOverrideMap8Mod) {
        if (item.category === "MAP_8_MOD") {
          price += BULKY_MAPS.getShop8ModBasePrice(item);
          return;
        }
        price += toValue(item.priceOverrideMap8Mod).base * item.quantity;
        return;
      } else if (toValue(item.priceOverride) > 0) {
        price += toValue(item.priceOverride) * item.quantity;
        return;
      }
      price += toValue(item.price) * item.quantity * toValue(multiplier);
    });

    return price;
  });
}
