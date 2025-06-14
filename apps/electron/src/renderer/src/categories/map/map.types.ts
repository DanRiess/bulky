import {
  DeepRequired,
  getKeys,
  MaybeComputedRef,
  ObjectValues,
} from "@shared/types/utility.types";
import { MAP_TIER, MAP_TYPE } from "./map.const";
import {
  BulkyBazaarItemBase,
  BulkyBazaarOffer,
  BulkyFilter,
  BulkyFilterFieldBase,
  BulkyShopItemBase,
  CATEGORY,
  PerItemAttributes,
} from "@shared/types/bulky.types";
import { useNormalMapOfferStore } from "./normalMapOffers.store";
import { useNormalMapFilterStore } from "./normalMapFilter.store";
import { ComputedRef } from "vue";
import { useMap8ModOfferStore } from "./map8ModOffers.store";
import { useMap8ModFilterStore } from "./map8ModFilter.store";

// STORE TYPES
export type NormalMapOfferStore = ReturnType<typeof useNormalMapOfferStore>;
export type NormalMapFilterStore = ReturnType<typeof useNormalMapFilterStore>;
export type Map8ModOfferStore = ReturnType<typeof useMap8ModOfferStore>;
export type Map8ModFilterStore = ReturnType<typeof useMap8ModFilterStore>;

// ITEM TYPES

/** All possible map base types. */
export type MapType = ObjectValues<typeof MAP_TYPE>;

/** All possible map tiers. */
export type MapTier = ObjectValues<typeof MAP_TIER>;

/** BulkyShopItem implementation for the map category */
export type ShopMap = BulkyShopItemBase<typeof CATEGORY.MAP> & {
  type: MapType;
  tier: MapTier;
};

/** BulkyShopItem implementation for the 8 mod map category */
export type ShopMap8Mod = Omit<
  BulkyShopItemBase<typeof CATEGORY.MAP_8_MOD>,
  "perItemAttributes" | "allowRegexFilter"
> & {
  type: MapType;
  tier: MapTier;
  priceOverrideMap8Mod: ComputedRef<Map8ModPrices>;
  perItemAttributes: Map8ModPerItemAttributes[];
  allowRegexFilter: MaybeComputedRef<boolean>;
};

/** BulkyBazaarItem implementation for the map category */
export type BazaarMap = BulkyBazaarItemBase<typeof CATEGORY.MAP> & {
  type: MapType;
  tier: MapTier;
  price: number;
};

/** BulkyBazaarItem implementation for the 8 mod map category */
export type BazaarMap8Mod = Omit<
  BulkyBazaarItemBase<typeof CATEGORY.MAP_8_MOD>,
  "regex" | "perItemAttributes"
> & {
  type: MapType;
  tier: MapTier;
  regex: NonNullable<BulkyBazaarItemBase<typeof CATEGORY.MAP_8_MOD>["regex"]>;
  perItemAttributes: Map8ModPerItemAttributes[];
};

/** BulkyBazaarOffer implementation for the map category */
export type BazaarMapOffer = BulkyBazaarOffer<BazaarMap>;

/** BulkyBazaarOffer implementation for the map category */
export type BazaarMap8ModOffer = BulkyBazaarOffer<BazaarMap8Mod>;

// FILTER TYPES

/** FilterField implementation for the map category */
export type MapFilterField = BulkyFilterFieldBase<typeof CATEGORY.MAP> & {
  type: MapType;
  tier: MapTier;
};

/** FilterField implementation for the 8 mod map category */
export type Map8ModFilterField = BulkyFilterFieldBase<
  typeof CATEGORY.MAP_8_MOD
> & {
  type: MapType;
  tier: MapTier;
};

/** Filter implementation for the map category */
export type MapFilter = BulkyFilter<MapFilterField>;

/** Filter implementation for the map category */
export type Map8ModFilter = Omit<
  BulkyFilter<Map8ModFilterField>,
  "multiplier" | "fullBuyout"
> & {
  regex: string;
};
// export type Map8ModFilter = BulkyFilter<Map8ModFilterField>

// UTILITY TYPES

export type RegexSimplePriceFragment = {
  available: boolean;
  addedPrice: number;
};

export type RegexComplexPriceFragment = {
  available: boolean;
  addedPrice: [number, number];
};

export type Map8ModPrices = {
  base: number;
  baseDeli: number;
  originator: number;
  originatorDeli: number;
  quantityRegex: RegexComplexPriceFragment[];
  packsizeRegex: RegexComplexPriceFragment[];
  avoidRegex: RegexSimplePriceFragment;
  wantedRegex: RegexSimplePriceFragment;
};

// export type Map8ModPerItemAttributes = {
// 	properties: {
// 		itemQuantity: number
// 		itemRarity: number
// 		packSize: number
// 	}
// 	modifiers: number[]
// }
export type Map8ModPerItemAttributes = DeepRequired<
  PerItemAttributes,
  | ["price"]
  | ["modifiers"]
  | ["properties"]
  | ["properties", "itemQuantity"]
  | ["properties", "packSize"]
  | ["properties", "delirious"]
  | ["properties", "originator"]
>;

export function isShopMap8Mod(obj: any): obj is ShopMap8Mod {
  return (
    obj &&
    "type" in obj &&
    getKeys(MAP_TYPE).includes(obj.type) &&
    "tier" in obj &&
    getKeys(MAP_TIER).includes(obj.tier) &&
    "perItemAttributes" in obj
  );
}
