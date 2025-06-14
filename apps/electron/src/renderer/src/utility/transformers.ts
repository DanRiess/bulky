import { capitalize } from "lodash-es";
import { BULKY_ID } from "./typedId";
import {
  PoeItemDto,
  PoeItemProperty,
  PoeStashTabDto,
} from "@shared/types/dtoResponse.types";
import { PoeItem, PoeStashTab } from "@shared/types/poe.types";
import {
  BulkyShopItem,
  BulkyItemOverrideInstance,
  BulkyBazaarItemDto,
  BulkyItemOverrideOptions,
  PerItemAttributes,
} from "@shared/types/bulky.types";
import { UnwrapRef, toValue } from "vue";
import { BULKY_FACTORY } from "./factory";
import { deepToRaw } from "./deepToRaw";
import { BULKY_MAPS } from "@web/categories/map/map.transformers";

export const BULKY_TRANSFORM = {
  bulkyItemToOverrideItem,
  bulkyItemToBazaarItemDto,
  stringToDisplayValue,
  itemDtoToPoeItem,
  mapSubStashToPoeItem,
};

/**
 * Transform a given string into a value that can be displayed.
 * Remove underscores, capitalize words, etc.
 */
function stringToDisplayValue(string: string) {
  if (string.includes("MAP_8_MOD")) {
    string = string.replace("MAP_8_MOD", "8 Mod Maps");
  }

  const arr = string.split(/_|\s/g);
  const capitalizedArr = arr.map((word) => capitalize(word.toLowerCase()));
  return capitalizedArr.join(" ");
}

/**
 * Generate a PoeItem from its corresponding dto.
 */
function itemDtoToPoeItem(item: PoeItemDto, stashTab: PoeStashTab) {
  const poeItem: PoeItem = {
    id: BULKY_ID.generateTypedId(item.id),
    stashTabId: stashTab.id,
    name: item.name,
    baseType: item.baseType,
    icon: item.icon,
    itemLevel: item.itemLevel,
    ilvl: item.ilvl,
    stackSize: item.stackSize,
    maxStackSize: item.maxStackSize,
    implicitMods: item.implicitMods,
    explicitMods: item.explicitMods,
    ultimatumMods: item.ultimatumMods,
    logbookMods: item.logbookMods,
    enchantMods: item.enchantMods,
    properties: item.properties,
    w: item.w,
    h: item.h,
    x: item.x,
    y: item.y,
    corrupted: item.corrupted,
    split: item.split,
    duplicated: item.duplicated,
  };

  return poeItem;
}

function mapSubStashToPoeItem(dto: PoeStashTabDto): PoeItem | undefined {
  if (!dto.metadata.items || !dto.metadata.map) {
    return;
  }

  const properties: PoeItemProperty[] =
    dto.metadata.map.section === "special"
      ? []
      : [
          {
            name: "Map Tier",
            values: [[dto.metadata.map.tier.toString(), 0]],
          },
        ];

  return {
    id: BULKY_ID.generateTypedId(dto.id),
    stashTabId: BULKY_ID.generateTypedId(dto.parent ?? ""),
    name: dto.metadata.map.name,
    baseType: dto.metadata.map.name,
    icon: dto.metadata.map.image,
    itemLevel: 0,
    ilvl: 0,
    stackSize: dto.metadata.items,
    maxStackSize: 65536,
    properties,
    w: 1,
    h: 1,
  };
}

/**
 * Extract overridable properties from a BulkyItem.
 * Generates an object that can be used in the item override store in idb.
 */
function bulkyItemToOverrideItem(
  item: BulkyShopItem,
  overrides: BulkyItemOverrideOptions
): BulkyItemOverrideInstance {
  return {
    type: item.type,
    tier: item.tier,
    priceOverride: overrides.price ?? toValue(item.priceOverride),
    priceOverrideMap8Mod:
      overrides.priceMap8Mod ?? toValue(item.priceOverrideMap8Mod),
    league: item.league,
    category: item.category,
    selected: overrides.selected ?? toValue(item.selected),
    allowRegexFilter:
      overrides.allowRegexFilter ?? toValue(item.allowRegexFilter),
  };
}

function bulkyItemToBazaarItemDto(
  item: BulkyShopItem | UnwrapRef<BulkyShopItem>,
  priceMultiplier: number
): BulkyBazaarItemDto | undefined {
  const nameToIdxTypeMap = BULKY_FACTORY.getNameToIdxTypeMap(item.category);
  const nameToIdxTierMap = BULKY_FACTORY.getNameToIdxTierMap(item.category);

  if (nameToIdxTypeMap === undefined || nameToIdxTierMap === undefined) return;

  // Calculate the price.
  let price: number | undefined;

  if (item.priceOverrideMap8Mod) {
    // 8 mod maps need a prc prop on every item, not a global one.
    if (item.category === "MAP_8_MOD") {
      price = undefined;
    } else {
      price = toValue(item.priceOverrideMap8Mod).base;
    }
  } else {
    price =
      toValue(item.priceOverride) > 0
        ? toValue(item.priceOverride)
        : toValue(item.price) * priceMultiplier;
  }

  // If the item has no price, it should be filtered out.
  if (price === 0) return;

  const itemDto: BulkyBazaarItemDto = {
    type: nameToIdxTypeMap[item.type],
    tier: nameToIdxTierMap[item.tier],
    qnt: item.quantity,
    prc:
      price === undefined
        ? 0
        : Math.round(price * 10) / 10 === 0
        ? price
        : Math.round(price * 10) / 10,
  };

  // Extract perItemAttributes and convert them into the dto type.
  if (item.perItemAttributes) {
    const perItemAttributes: typeof itemDto.pia = item.perItemAttributes.map(
      (attrs: PerItemAttributes) => {
        return {
          ...(item.category === "MAP_8_MOD" && {
            prc: BULKY_MAPS.getIndividualPriceForDto(
              attrs,
              item as BulkyShopItem
            ),
          }),
          ...(attrs.modifiers && { mods: deepToRaw(attrs.modifiers) }),
          ...(attrs.properties && {
            props: {
              ...(attrs.properties.itemQuantity && {
                iQnt: attrs.properties.itemQuantity,
              }),
              // ...(attrs.properties.itemRarity && { iRar: attrs.properties.itemRarity }),
              ...(attrs.properties.packSize && {
                pckSz: attrs.properties.packSize,
              }),
              ...(attrs.properties.delirious && {
                deli: attrs.properties.delirious,
              }),
              ...(attrs.properties.originator && {
                orig: attrs.properties.originator,
              }),
            },
          }),
        };
      }
    );
    itemDto.pia = perItemAttributes;
  }

  // Extract regexes and convert them into the dto type.
  if (item.priceOverrideMap8Mod) {
    const override = toValue(item.priceOverrideMap8Mod);
    const quantityRegex = override.quantityRegex
      .map((regex) => (regex.available ? regex.addedPrice : undefined))
      .filter(Boolean);
    const packsizeRegex = override.packsizeRegex
      .map((regex) => (regex.available ? regex.addedPrice : undefined))
      .filter(Boolean);

    const regexes: typeof itemDto.rgx = {
      ...(override.avoidRegex.available && {
        avd: override.avoidRegex.addedPrice,
      }),
      ...(override.wantedRegex.available && {
        wnt: override.wantedRegex.addedPrice,
      }),
      ...(quantityRegex.length > 0 && { qnt: deepToRaw(quantityRegex) }),
      ...(packsizeRegex.length > 0 && { pckSz: deepToRaw(packsizeRegex) }),
    };

    itemDto.rgx = regexes;
  }

  return itemDto;
}
