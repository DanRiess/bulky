import {
  BulkyBazaarItem,
  BulkyBazaarItemDto,
  BulkyFilter,
  BulkyItemOverrideRecord,
  BulkyShopItem,
  PerItemAttributes,
} from "@shared/types/bulky.types";
import {
  BazaarMap,
  BazaarMap8Mod,
  Map8ModPerItemAttributes,
  Map8ModPrices,
  MapTier,
  MapType,
  ShopMap,
  ShopMap8Mod,
} from "./map.types";
import { NinjaPriceRecord } from "@shared/types/ninja.types";
import { Ref, computed, toValue } from "vue";
import { PoeItem } from "@shared/types/poe.types";
import { useConfigStore } from "@web/stores/configStore";
import { capitalize } from "lodash-es";
import {
  MAP_MODIFIERS,
  MAP_TIER,
  MAP_TIER_IDX_TO_NAME,
  MAP_TIER_NAME_TO_IDX,
  MAP_TYPE,
  MAP_TYPE_IDX_TO_NAME,
} from "./map.const";
import { PoeItemProperty } from "@shared/types/dtoResponse.types";
import { notEmpty } from "@web/utility/notEmpty";

export const BULKY_MAPS = {
  generateTypeFromBaseType,
  generateTierFromProperty,
  generateShopItemFromPoeItem,
  generateShopMap8ModItemFromPoeItem,
  generateNameFromType,
  generateBazaarItemFromDto,
  generateBazaarMap8ModItemFromDto,
  getPerItemAttributes,
  filterIndividual8ModItemsBySubtype,
  getShop8ModBasePrice,
  getIndividualPriceForDto,
};

function generateTypeFromBaseType(baseType: string): MapType | undefined {
  const transformedType = baseType
    .replace(/\s/g, "_")
    .toUpperCase()
    .replace("_MAP", "");
  return MAP_TYPE[transformedType];
}

function generateTierFromProperty(
  properties?: PoeItemProperty[]
): MapTier | undefined {
  const tierProperty = properties?.find((p) => p.name === "Map Tier");
  if (!tierProperty) return MAP_TIER.TIER_16;

  const tier = tierProperty.values[0][0];
  return MAP_TIER[`TIER_${tier}`];
}

function generateShopItemFromPoeItem(
  poeItem: PoeItem,
  prices: Ref<NinjaPriceRecord>,
  itemOverrides: Ref<BulkyItemOverrideRecord>
): ShopMap | undefined {
  const configStore = useConfigStore();

  const type = generateTypeFromBaseType(poeItem.baseType);
  const tier = generateTierFromProperty(poeItem.properties);

  if (!type || !tier || !poeItem.stackSize) return;

  return {
    type,
    tier,
    name: poeItem.baseType,
    icon: poeItem.icon,
    quantity: poeItem.stackSize,
    price: computed(() => {
      return (
        Math.round(
          (prices.value.get(`${poeItem.baseType}_${tier}`)?.chaos ?? 0) * 10
        ) / 10
      );
    }),
    league: configStore.config.league,
    category: "MAP",
    priceOverride: computed(() => {
      return (
        Math.round(
          (itemOverrides.value.get(`${type}_${tier}`)?.priceOverride ?? 0) * 10
        ) / 10
      );
    }),
    selected: computed(() => {
      return itemOverrides.value.get(`${type}_${tier}`)?.selected ?? true;
    }),
  };
}

function generateShopMap8ModItemFromPoeItem(
  poeItem: PoeItem,
  itemOverrides: Ref<BulkyItemOverrideRecord>
): ShopMap8Mod | undefined {
  const configStore = useConfigStore();

  const type = generateTypeFromBaseType(poeItem.baseType);
  const tier = generateTierFromProperty(poeItem.properties);

  if (!type || !tier) return;

  return {
    type,
    tier,
    name: poeItem.baseType,
    icon: poeItem.icon,
    quantity: 1,
    price: 0,
    league: configStore.config.league,
    category: "MAP_8_MOD",
    priceOverride: computed(() => 0),
    priceOverrideMap8Mod: computed<Map8ModPrices>(() => {
      return (
        itemOverrides.value.get(`${type}_${tier}`)?.priceOverrideMap8Mod ?? {
          base: 0,
          baseDeli: 0,
          originator: 0,
          originatorDeli: 0,
          avoidRegex: {
            available: false,
            addedPrice: 0,
          },
          wantedRegex: {
            available: false,
            addedPrice: 0,
          },
          quantityRegex: [
            {
              available: false,
              addedPrice: [110, 0],
            },
          ],
          packsizeRegex: [
            {
              available: false,
              addedPrice: [35, 0],
            },
          ],
        }
      );
    }),
    selected: computed(() => {
      return itemOverrides.value.get(`${type}_${tier}`)?.selected ?? true;
    }),
    allowRegexFilter: computed(() => {
      return (
        itemOverrides.value.get(`${type}_${tier}`)?.allowRegexFilter ?? false
      );
    }),
    perItemAttributes: [],
  };
}

function generateBazaarItemFromDto(item: BulkyBazaarItemDto): BazaarMap {
  const type = MAP_TYPE_IDX_TO_NAME[item.type];
  const tier = MAP_TIER_IDX_TO_NAME[item.tier];

  return {
    category: "MAP",
    type,
    tier,
    name: generateNameFromType(type),
    quantity: item.qnt,
    computedQuantity: item.qnt,
    price: item.prc,
    icon: "",
  };
}

function generateBazaarMap8ModItemFromDto(
  item: BulkyBazaarItemDto
): BazaarMap8Mod | undefined {
  const type = MAP_TYPE_IDX_TO_NAME[item.type];
  const tier = MAP_TIER_IDX_TO_NAME[item.tier];

  const perItemAttributes: Map8ModPerItemAttributes[] | undefined = item.pia
    ?.map((attrs): Map8ModPerItemAttributes | undefined => {
      if (
        !attrs.prc ||
        !attrs.mods ||
        !attrs.props ||
        !attrs.props.iQnt ||
        !attrs.props.pckSz
      )
        return;

      return {
        itemId: "", // Bazaar items don't need this.
        modifiers: attrs.mods,
        properties: {
          itemQuantity: attrs.props.iQnt,
          packSize: attrs.props.pckSz,
          delirious: !!attrs.props.deli,
          originator: !!attrs.props.orig,
        },
        price: attrs.prc,
      };
    })
    .filter(notEmpty);

  // Return if the perItemAttributes could not correctly be extracted.
  if (
    perItemAttributes === undefined ||
    perItemAttributes.length !== item.pia?.length
  )
    return;

  return {
    category: "MAP_8_MOD",
    type,
    tier,
    name: generateNameFromType(type),
    quantity: item.qnt,
    computedQuantity: item.qnt,
    price: item.prc,
    regex: {
      avoidRegex: item.rgx?.avd,
      wantedRegex: item.rgx?.wnt,
      quantityRegex: item.rgx?.qnt,
      packsizeRegex: item.rgx?.pckSz,
    },
    icon: "",
    perItemAttributes,
  };
}

/**
 * Generate a display name from a map type.
 *
 * @param type map type
 * @param secondaryTypeOption 0: basic map, 1: deli map, 2: originator map, 4: deli + originator map
 * @returns
 */
function generateNameFromType(
  type: MapType,
  options: { tier?: MapTier; secondaryTypeOption?: number } = {}
) {
  if (options.secondaryTypeOption !== undefined) {
    const mapName = type
      .split("_")
      .map((t) => capitalize(t))
      .join(" ");
    const tier = options.tier
      ? `(T${MAP_TIER_NAME_TO_IDX[options.tier] + 1})`
      : "";
    if (options.secondaryTypeOption === 0) {
      return `Basic ${mapName} ${tier}`;
    } else if (options.secondaryTypeOption === 1) {
      return `${mapName} ${tier}${tier ? " " : ""}w/ Deli`;
    } else if (options.secondaryTypeOption === 2) {
      return `${mapName} ${tier}${tier ? " " : ""}w/ Originator`;
    } else if (options.secondaryTypeOption === 4) {
      return `${mapName} ${tier}${tier ? " " : ""}w/ Deli+Originator`;
    }
  }

  return (
    type
      .split("_")
      .map((t) => capitalize(t))
      .join(" ") + " Map"
  );
}

// PERF: Optimize this.
/**
 * This function doesn't work perfectly due to how GGG applies modifiers to maps.
 * For example, if a map has % elemental and physical reflect, it could be
 * the T17 mod, or it could be 2 T16 mods. The only way to tell is to check the % number.
 *
 * Due to this, I currently removed most of the duplicate T17 mods. We'll have to revisit
 * this at some point in the future. Currently due to this, maps can have more than 8 modifiers.
 * Will result in some false positive 6 mod maps which will be detected as 8mod.
 */
function getModifiersFromItem(item: PoeItem) {
  const modifiers: number[] = [];

  item.explicitMods?.forEach((modifier) => {
    // const idx = MAP_MODIFIER_REGEX.findIndex(regex => modifier.match(regex))
    const idx = MAP_MODIFIERS.findIndex((bulkyMod) => {
      const regex = createFullRegexFromModifier(modifier);
      return bulkyMod.match(regex);
    });

    if (idx > -1 && !modifiers.includes(idx)) {
      modifiers.push(idx);
    }
  });

  return modifiers;
}

function createFullRegexFromModifier(modifier: string) {
  const numberRegex = /\d+/g;
  const regexPattern = modifier
    .replace("+", "\\+")
    .replace(numberRegex, ".*")
    .replace("\n", "|");
  return new RegExp(`(^|\|)${regexPattern}($|\|)`);
}

function getPerItemAttributes(
  item: PoeItem
): Map8ModPerItemAttributes | undefined {
  const quant = item.properties
    ?.find((p) => p.name === "Item Quantity")
    ?.values[0][0].replace(/[\+%]/g, "");
  // const rarity = item.properties?.find(p => p.name === 'Item Rarity')?.values[0][0].replace(/[\+%]/g, '')
  const packSize = item.properties
    ?.find((p) => p.name === "Monster Pack Size")
    ?.values[0][0].replace(/[\+%]/g, "");
  const delirious = !!item.enchantMods?.find((enchant) =>
    enchant.match(/players in area are \d*% delirious/gi)
  );
  const originator = !!item.implicitMods?.find((implicit) =>
    implicit.match(/Area is influenced by The Originator's Memories/gi)
  );
  const modifiers = getModifiersFromItem(item);

  if (!quant || !packSize) return;

  return {
    itemId: item.id,
    properties: {
      itemQuantity: parseInt(quant),
      packSize: parseInt(packSize),
      delirious,
      originator,
    },
    modifiers,
    price: 0,
  };
}

/**
 * Consumes a map 8 mod offer item and divides its perItemAttributes
 * into the four possible subtypes (normal, delirious, originator
 * influenced and delirious originator influenced).
 *
 * @param item BulkyBazaarItem
 * @returns Map8ModDividedBaseTypes
 */
function filterIndividual8ModItemsBySubtype(
  item: BulkyBazaarItem,
  filter: BulkyFilter
): BazaarMap8Mod["perItemAttributes"] | undefined {
  if (item.category !== "MAP_8_MOD") return;
  const map = item as BazaarMap8Mod;

  const map8Mod = map.perItemAttributes.filter(
    (attr) => !attr.properties.delirious && !attr.properties.originator
  );
  const deli8Mod = map.perItemAttributes.filter(
    (attr) => attr.properties.delirious && !attr.properties.originator
  );
  const originator8Mod = map.perItemAttributes.filter(
    (attr) => !attr.properties.delirious && attr.properties.originator
  );
  const originatorDeli8Mod = map.perItemAttributes.filter(
    (attr) => attr.properties.delirious && attr.properties.originator
  );

  if (filter.delirious && filter.originator) {
    return originatorDeli8Mod;
  } else if (filter.delirious && !filter.originator) {
    return deli8Mod;
  } else if (!filter.delirious && filter.originator) {
    return originator8Mod;
  } else {
    return map8Mod;
  }
}

function getShop8ModBasePrice(item: ShopMap8Mod) {
  const priceOverride = toValue(item.priceOverrideMap8Mod);
  return item.perItemAttributes.reduce((prev, individualItem) => {
    if (
      individualItem.properties.delirious &&
      individualItem.properties.originator
    ) {
      return prev + priceOverride.originatorDeli;
    } else if (individualItem.properties.delirious) {
      return prev + priceOverride.baseDeli;
    } else if (individualItem.properties.originator) {
      return prev + priceOverride.originator;
    } else {
      return prev + priceOverride.base;
    }
  }, 0);
}

function getIndividualPriceForDto(
  attributes: PerItemAttributes,
  item: BulkyShopItem
) {
  if (item.category !== "MAP_8_MOD" || !attributes.properties) return;

  const priceOverride = toValue(item.priceOverrideMap8Mod);

  if (attributes.properties.delirious && attributes.properties.originator) {
    return priceOverride.originatorDeli;
  } else if (attributes.properties.delirious) {
    return priceOverride.baseDeli;
  } else if (attributes.properties.originator) {
    return priceOverride.originator;
  } else {
    return priceOverride.base;
  }
}
