/**
 * This component provides static functions to in regards to Compasses.
 */

import { SEXTANT_MODIFIER, SEXTANT_TIER_IDX_TO_NAME } from '@web/categories/compass/compass.const'
import { Compass, SextantModifier } from '@web/categories/compass/compass.types'
import { GenericListingItemDto } from '@web/types/dto.types'

// TODO: check modifier string matches when getting actual data

/** Type a returned Compass type DTO and turn it into an Compass type */
function generateSextantModifierFromDto(modifier: string): SextantModifier {
	// DELIRIUM
	if (modifier.match(/mirror/i)) return SEXTANT_MODIFIER.MIRROR_OF_DELIRIUM
	else if (modifier.match(/reward/i)) return SEXTANT_MODIFIER.DELIRIUM_REWARD
	// RITUAL
	else if (modifier.match(/altars/i)) return SEXTANT_MODIFIER.RITUAL_ALTARS
	else if (modifier.match(/reroll/i)) return SEXTANT_MODIFIER.RITUAL_REROLLING
	// HEIST
	else if (modifier.match(/cache/i)) return SEXTANT_MODIFIER.SMUGGLERS_CACHE
	else if (modifier.match(/contracts/i)) return SEXTANT_MODIFIER.CONTRACTS_IMPLICIT
	// BEYOND
	else if (modifier.match(/beyond/i)) return SEXTANT_MODIFIER.BEYOND
	// ABYSS
	else if (modifier.match(/abyss/i)) return SEXTANT_MODIFIER.ABYSS
	// SHRINES
	else if (modifier.match(/resonating/i)) return SEXTANT_MODIFIER.RESONATING_SHRINE
	else if (modifier.match(/gloom/i)) return SEXTANT_MODIFIER.GLOOM_SHRINE
	// BLIGHT
	else if (modifier.match(/blight/i)) return SEXTANT_MODIFIER.BLIGHT
	else if (modifier.match(/oils/i)) return SEXTANT_MODIFIER.OILS_TIER
	// BREACH
	else if (modifier.match(/breach/i)) return SEXTANT_MODIFIER.BREACH
	else if (modifier.match(/esh/i)) return SEXTANT_MODIFIER.ESH
	else if (modifier.match(/xoph/i)) return SEXTANT_MODIFIER.XOPH
	else if (modifier.match(/tul/i)) return SEXTANT_MODIFIER.TUL
	else if (modifier.match(/uul/i)) return SEXTANT_MODIFIER.UUL_NETOL
	else if (modifier.match(/chayula/i)) return SEXTANT_MODIFIER.CHAYULA
	// HARVEST
	else if (modifier.match(/grove/i)) return SEXTANT_MODIFIER.SACRED_GROVE
	else if (modifier.match(/blue/i)) return SEXTANT_MODIFIER.BLUE_PLANTS
	else if (modifier.match(/purple/i)) return SEXTANT_MODIFIER.PURPLE_PLANTS
	else if (modifier.match(/yellow/i)) return SEXTANT_MODIFIER.YELLOW_PLANTS
	// ESSENCE
	else if (modifier.match(/remnant/i)) return SEXTANT_MODIFIER.REMNANT_OF_CORRUPTION
	// ULTIMATUM
	else if (modifier.match(/ultimatum/i)) return SEXTANT_MODIFIER.ULTIMATUM
	// HARBINGER
	else if (modifier.match(/harbinger/i)) return SEXTANT_MODIFIER.MYSTERIOUS_HARBINGER
	// LEGION
	else if (modifier.match(/legion/i)) return SEXTANT_MODIFIER.LEGION
	else if (modifier.match(/emblems/i)) return SEXTANT_MODIFIER.SPLINTERS_EMBLEMS_DUPLICATE
	// STRONGBOXES
	else if (modifier.match(/strongboxCorrupted/i)) return SEXTANT_MODIFIER.STRONGBOX_CORRUPTED
	else if (modifier.match(/enraged/i)) return SEXTANT_MODIFIER.STRONGBOX_ENRAGED
	// EXPEDITION
	else if (modifier.match(/runic/i)) return SEXTANT_MODIFIER.RUNIC_MONSTER_MARKERS
	// BEASTIARY
	else if (modifier.match(/einhar/i)) return SEXTANT_MODIFIER.EINHAR
	else if (modifier.match(/copy/i)) return SEXTANT_MODIFIER.COPY_OF_BEASTS
	// DELVE
	else if (modifier.match(/niko/i)) return SEXTANT_MODIFIER.NIKO
	// INCURSION
	else if (modifier.match(/alva/i)) return SEXTANT_MODIFIER.ALVA
	// SYNDICATE
	else if (modifier.match(/jun/i)) return SEXTANT_MODIFIER.JUN
	else if (modifier.match(/syndicate/i)) return SEXTANT_MODIFIER.SYNDICATE_INTELLIGENCE
	// MAPS
	else if (modifier.match(/8mod/i)) return SEXTANT_MODIFIER.MAP_8_MODIFIERS
	else if (modifier.match(/20quality/i)) return SEXTANT_MODIFIER.MAP_20_QUALITY
	else if (modifier.match(/magicPackSize/i)) return SEXTANT_MODIFIER.MAGIC_PACK_SIZE
	else if (modifier.match(/packSizeUnid/i)) return SEXTANT_MODIFIER.PACK_SIZE_UNIDENTIFIED
	else if (modifier.match(/qualityToRarity/i)) return SEXTANT_MODIFIER.MAP_QUALITY_TO_RARITY
	else if (modifier.match(/rarePacks/i)) return SEXTANT_MODIFIER.RARE_PACKS
	// BOSS
	else if (modifier.match(/bossDropUnique/i)) return SEXTANT_MODIFIER.BOSS_DROP_UNIQUE
	else if (modifier.match(/bossDropVaal/i)) return SEXTANT_MODIFIER.BOSS_DROP_VAAL
	else if (modifier.match(/bodyguards/i)) return SEXTANT_MODIFIER.BODYGUARDS
	else if (modifier.match(/conqueror/i)) return SEXTANT_MODIFIER.CONQUEROR_MAP
	else if (modifier.match(/elderGuardian/i)) return SEXTANT_MODIFIER.ELDER_GUARDIAN_MAP
	else if (modifier.match(/shaperGuardian/i)) return SEXTANT_MODIFIER.SHAPER_GUARDIAN_MAP
	// TORMENTED SPIRITS
	else if (modifier.match(/rusted/i)) return SEXTANT_MODIFIER.SPIRIT_RUSTED_SCARAB
	else if (modifier.match(/polished/i)) return SEXTANT_MODIFIER.SPIRIT_POLISHED_SCARAB
	else if (modifier.match(/gilded/i)) return SEXTANT_MODIFIER.SPIRIT_GILDED_SCARAB
	else if (modifier.match(/spiritAdditionalUnique/i)) return SEXTANT_MODIFIER.SPIRIT_UNIQUE
	else if (modifier.match(/additionalMap/i)) return SEXTANT_MODIFIER.SPIRIT_MAP
	// ROGUE EXILES
	else if (modifier.match(/exiles/i)) return SEXTANT_MODIFIER.ROGUE_EXILES
	// ADDITIONAL PACKS
	else if (modifier.match(/flasks/i)) return SEXTANT_MODIFIER.INSTANT_FLASKS
	else if (modifier.match(/convert/i)) return SEXTANT_MODIFIER.CONVERT_MONSTERS
	else if (modifier.match(/gifts/i)) return SEXTANT_MODIFIER.CORRUPTED_GIFTS
	else if (modifier.match(/vaalMonstersCorrupted/i)) return SEXTANT_MODIFIER.VAAL_MONSTERS_CORRUPTED
	else if (modifier.match(/chaos/i)) return SEXTANT_MODIFIER.CHAOS_MONSTERS
	else if (modifier.match(/physical/i)) return SEXTANT_MODIFIER.PHYSICAL_MONSTERS
	else if (modifier.match(/lightning/i)) return SEXTANT_MODIFIER.LIGHTNING_MONSTERS
	else if (modifier.match(/cold/i)) return SEXTANT_MODIFIER.COLD_MONSTERS
	else if (modifier.match(/fire/i)) return SEXTANT_MODIFIER.FIRE_MONSTERS
	else if (modifier.match(/reflected/i)) return SEXTANT_MODIFIER.REFLECTED
	// VAAL SKILLS
	else if (modifier.match(/soulGain/i)) return SEXTANT_MODIFIER.SOUL_GAIN_PREVENTION
	else if (modifier.match(/soulOnKill/i)) return SEXTANT_MODIFIER.SOUL_ON_KILL
	// UNCATEGORIZED
	else if (modifier.match(/barrels/i)) return SEXTANT_MODIFIER.MYSTERIOUS_BARRELS
	else if (modifier.match(/uniqueMonstersCorrupted/i)) return SEXTANT_MODIFIER.UNIQUE_MONSTERS_CORRUPTED
	else if (modifier.match(/traitors/i)) return SEXTANT_MODIFIER.HUNTED_TRAITORS
	else if (modifier.match(/alluring/i)) return SEXTANT_MODIFIER.ALLURING
	// UNSUPPORTED
	else return SEXTANT_MODIFIER.UNSUPPORTED
}

/** Type a returned item DTO and turn it into a Compass item */
function generateCompassItemFromDto(itemDto: GenericListingItemDto): Compass | null {
	if (!itemDto.tier || itemDto.tier < 0 || itemDto.tier > 2) return null

	return {
		tier: SEXTANT_TIER_IDX_TO_NAME[itemDto.tier],
		quantity: itemDto.quantity,
		price: itemDto.price,
	}
}

export const BULKY_SEXTANTS = {
	generateSextantModifierFromDto,
	generateCompassItemFromDto,
}
