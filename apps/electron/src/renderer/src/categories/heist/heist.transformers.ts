import { PoeItem } from "@shared/types/poe.types";
import { Ref, computed } from "vue";
import {
  BulkyBazaarItemDto,
  BulkyItemOverrideRecord,
} from "@shared/types/bulky.types";
import { useConfigStore } from "@web/stores/configStore";
import { capitalize } from "lodash-es";
import {
  BazaarHeistItem,
  HeistTier,
  HeistType,
  ShopHeistItem,
} from "./heist.types";
import {
  HEIST_TIER,
  HEIST_TIER_IDX_TO_NAME,
  HEIST_TYPE,
  HEIST_TYPE_IDX_TO_NAME,
} from "./heist.const";

export const BULKY_HEIST = {
  generateTypeFromPoeItem,
  generateTierFromItemLevel,
  generateShopItemFromPoeItem,
  generateNameFromType,
  generateBazaarItemFromDto,
  getNameFromTypeAndTier,
};

function generateTypeFromPoeItem(poeItem: PoeItem): HeistType | undefined {
  // const transformedType = baseType.replace(/\s/g, '_').toUpperCase()
  // return HEIST_TYPE[transformedType]
  const properties = poeItem.properties;
  if (!properties) return undefined;

  if (poeItem.baseType.includes("Contract")) {
    // Find the required job in the properties
    const typeProp = properties.find(
      (prop) => prop.name === "Requires {1} (Level {0})"
    );
    if (!typeProp) return undefined;

    const type = typeProp.values[1][0].toUpperCase();
    return HEIST_TYPE[type];
  } else if (poeItem.baseType.includes("Blueprint")) {
    // Check the properties to determine if the blueprint is fully revealed.

    const wings = properties.find((prop) => prop.name === "Wings Revealed");
    const escapeRoutes = properties.find(
      (prop) => prop.name === "Escape Routes Revealed"
    );
    const rewardRooms = properties.find(
      (prop) => prop.name === "Reward Rooms Revealed"
    );

    if (!wings || !escapeRoutes || !rewardRooms) return undefined;

    const [revealedWings, totalWings] = wings.values[0][0]
      .split("/")
      .map((x) => +x);
    const [revealedEscapeRoutes, totalEscapeRoutes] = escapeRoutes.values[0][0]
      .split("/")
      .map((x) => +x);
    const [revealedRewardRooms, totalRewardRooms] = rewardRooms.values[0][0]
      .split("/")
      .map((x) => +x);

    // If all wings, escape routes and reward rooms are revealed, return fully revealed type
    if (
      revealedWings === totalWings &&
      revealedEscapeRoutes === totalEscapeRoutes &&
      revealedRewardRooms === totalRewardRooms
    ) {
      if (totalWings === 3) return HEIST_TYPE.BLUEPRINT_3_WINGS;
      else if (totalWings === 4) return HEIST_TYPE.BLUEPRINT_4_WINGS;
    } else {
      return HEIST_TYPE.BLUEPRINT;
    }
  } else if (poeItem.baseType === "Rogue's Marker") {
    return HEIST_TYPE["ROGUE'S_MARKER"];
  }

  return undefined;
}

function generateTierFromItemLevel(ilvl: number): HeistTier | undefined {
  // Rogue Markers
  if (!ilvl || ilvl === 0) return HEIST_TIER["0"];

  // Blueprints and contracts
  if (ilvl < 68) return undefined;
  else if (ilvl < 73) return HEIST_TIER["ILVL_68-72"];
  else if (ilvl < 78) return HEIST_TIER["ILVL_73-77"];
  else if (ilvl < 83) return HEIST_TIER["ILVL_78-82"];
  return HEIST_TIER["ILVL_83+"];
}

function generateShopItemFromPoeItem(
  poeItem: PoeItem,
  itemOverrides: Ref<BulkyItemOverrideRecord>
): ShopHeistItem | undefined {
  const configStore = useConfigStore();

  const type = generateTypeFromPoeItem(poeItem);
  const tier = generateTierFromItemLevel(poeItem.ilvl);

  if (!type || !tier) return;

  return {
    type: type,
    tier: tier,
    name:
      type === "ROGUE'S_MARKER"
        ? poeItem.baseType
        : `${generateNameFromType(type)} (${generateNameFromTier(tier)})`,
    icon: poeItem.icon,
    quantity: poeItem.stackSize ?? 1,
    price: 0,
    league: configStore.config.league,
    category: "HEIST",
    priceOverride: computed(() => {
      return (
        Math.round(
          (itemOverrides.value.get(`${type}_${tier}`)?.priceOverride ?? 0) *
            10000
        ) / 10000
      );
    }),
    selected: computed(() => {
      return itemOverrides.value.get(`${type}_${tier}`)?.selected ?? true;
    }),
  };
}

function generateBazaarItemFromDto(
  item: BulkyBazaarItemDto
): BazaarHeistItem | undefined {
  const type = HEIST_TYPE_IDX_TO_NAME[item.type];
  const tier = HEIST_TIER_IDX_TO_NAME[item.tier];
  if (!type || !tier) return;

  return {
    category: "HEIST",
    type,
    tier,
    name: generateNameFromType(type),
    quantity: item.qnt,
    computedQuantity: item.qnt,
    price: item.prc,
    icon: "",
  };
}

function generateNameFromTier(tier: HeistTier) {
  return tier.replace("_", " ").toLowerCase();
}

/**
 * Generate the display name from the type.
 */
function generateNameFromType(type: HeistType) {
  if (type === "BLUEPRINT") return "Blueprint";
  else if (type === "BLUEPRINT_3_WINGS") return "Blueprint (3/3 Wings)";
  else if (type === "BLUEPRINT_4_WINGS") return "Blueprint (4/4 Wings)";
  else if (type === "ROGUE'S_MARKER") return "Rogue's Marker";
  else
    return `Contract: ${type
      .split("_")
      .map((t) => capitalize(t))
      .join(" ")}`;
}

function getNameFromTypeAndTier(type: HeistType, tier: HeistTier) {
  return `${generateNameFromType(type)} (${generateNameFromTier(tier)})`;
}
