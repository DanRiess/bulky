import { PoeItem } from '@shared/types/poe.types'
import { SCARAB_TYPE } from './scarab.const'
import { ScarabTier, ScarabType, ShopScarab } from './scarab.types'
import { Ref, computed } from 'vue'
import { NinjaPriceRecord } from '@shared/types/ninja.types'
import { BulkyItemOverrideRecord } from '@shared/types/bulky.types'
import { useConfigStore } from '@web/stores/configStore'
import { capitalize } from 'lodash'

export const BULKY_SCARABS = {
	generateScarabTypeFromBaseType,
	generateScarabTier,
	generateScarabFromPoeItem,
	generateScarabNameFromType,
}

function generateScarabTypeFromBaseType(baseType: string): ScarabType | undefined {
	if (baseType === 'Reliquary Scarab') return SCARAB_TYPE.RELIQUARY_SCARAB
	if (baseType === 'Reliquary Scarab of Overlords') return SCARAB_TYPE.RELIQUARY_SCARAB_OF_OVERLORDS
	if (baseType === 'Reliquary Scarab of Vision') return SCARAB_TYPE.RELIQUARY_SCARAB_OF_VISION
	if (baseType === 'Sulphite Scarab') return SCARAB_TYPE.SULPHITE_SCARAB
	if (baseType === 'Sulphite Scarab of Greed') return SCARAB_TYPE.SULPHITE_SCARAB_OF_GREED
	if (baseType === 'Sulphite Scarab of Fumes') return SCARAB_TYPE.SULPHITE_SCARAB_OF_FUMES
	if (baseType === 'Divination Scarab') return SCARAB_TYPE.DIVINATION_SCARAB
	if (baseType === 'Divination Scarab of Curation') return SCARAB_TYPE.DIVINATION_SCARAB_OF_CURATION
	if (baseType === 'Divination Scarab of Completion') return SCARAB_TYPE.DIVINATION_SCARAB_OF_COMPLETION
	if (baseType === 'Torment Scarab') return SCARAB_TYPE.TORMENT_SCARAB
	if (baseType === 'Torment Scarab of Peculiarity') return SCARAB_TYPE.TORMENT_SCARAB_OF_PECULIARITY
	if (baseType === 'Torment Scarab of Release') return SCARAB_TYPE.TORMENT_SCARAB_OF_RELEASE
	if (baseType === 'Torment Scarab of Possession') return SCARAB_TYPE.TORMENT_SCARAB_OF_POSSESSION
	if (baseType === 'Anarchy Scarab') return SCARAB_TYPE.ANARCHY_SCARAB
	if (baseType === 'Anarchy Scarab of Gigantification') return SCARAB_TYPE.ANARCHY_SCARAB_OF_GIGANTIFICATION
	if (baseType === 'Anarchy Scarab of Partnership') return SCARAB_TYPE.ANARCHY_SCARAB_OF_PARTNERSHIP
	if (baseType === 'Ritual Scarab of Selectiveness') return SCARAB_TYPE.RITUAL_SCARAB_OF_SELECTIVENESS
	if (baseType === 'Ritual Scarab of Recognition') return SCARAB_TYPE.RITUAL_SCARAB_OF_RECOGNITION
	if (baseType === 'Ritual Scarab of Abundance') return SCARAB_TYPE.RITUAL_SCARAB_OF_ABUNDANCE
	if (baseType === 'Harvest Scarab') return SCARAB_TYPE.HARVEST_SCARAB
	if (baseType === 'Harvest Scarab of Doubling') return SCARAB_TYPE.HARVEST_SCARAB_OF_DOUBLING
	if (baseType === 'Harvest Scarab of Cornucopia') return SCARAB_TYPE.HARVEST_SCARAB_OF_CORNUCOPIA
	if (baseType === 'Bestiary Scarab') return SCARAB_TYPE.BESTIARY_SCARAB
	if (baseType === 'Bestiary Scarab of the Herd') return SCARAB_TYPE.BESTIARY_SCARAB_OF_THE_HERD
	if (baseType === 'Bestiary Scarab of Duplicating') return SCARAB_TYPE.BESTIARY_SCARAB_OF_DUPLICATING
	if (baseType === 'Bestiary Scarab of the Shadowed Crow') return SCARAB_TYPE.BESTIARY_SCARAB_OF_THE_SHADOWED_CROW
	if (baseType === 'Influencing Scarab of the Shaper') return SCARAB_TYPE.INFLUENCING_SCARAB_OF_THE_SHAPER
	if (baseType === 'Influencing Scarab of the Elder') return SCARAB_TYPE.INFLUENCING_SCARAB_OF_THE_ELDER
	if (baseType === 'Influencing Scarab of Hordes') return SCARAB_TYPE.INFLUENCING_SCARAB_OF_HORDES
	if (baseType === 'Influencing Scarab of Conversion') return SCARAB_TYPE.INFLUENCING_SCARAB_OF_CONVERSION
	if (baseType === 'Harbinger Scarab') return SCARAB_TYPE.HARBINGER_SCARAB
	if (baseType === 'Harbinger Scarab of Discernment') return SCARAB_TYPE.HARBINGER_SCARAB_OF_DISCERNMENT
	if (baseType === 'Harbinger Scarab of Regency') return SCARAB_TYPE.HARBINGER_SCARAB_OF_REGENCY
	if (baseType === 'Harbinger Scarab of Warhoards') return SCARAB_TYPE.HARBINGER_SCARAB_OF_WARHOARDS
	if (baseType === 'Abyss Scarab') return SCARAB_TYPE.ABYSS_SCARAB
	if (baseType === 'Abyss Scarab of Multitudes') return SCARAB_TYPE.ABYSS_SCARAB_OF_MULTITUDES
	if (baseType === 'Abyss Scarab of Emptiness') return SCARAB_TYPE.ABYSS_SCARAB_OF_EMPTINESS
	if (baseType === 'Abyss Scarab of Edifice') return SCARAB_TYPE.ABYSS_SCARAB_OF_EDIFICE
	if (baseType === 'Abyss Scarab of Profound Depth') return SCARAB_TYPE.ABYSS_SCARAB_OF_PROFOUND_DEPTH
	if (baseType === 'Essence Scarab') return SCARAB_TYPE.ESSENCE_SCARAB
	if (baseType === 'Essence Scarab of Ascent') return SCARAB_TYPE.ESSENCE_SCARAB_OF_ASCENT
	if (baseType === 'Essence Scarab of Stability') return SCARAB_TYPE.ESSENCE_SCARAB_OF_STABILITY
	if (baseType === 'Essence Scarab of Calcification') return SCARAB_TYPE.ESSENCE_SCARAB_OF_CALCIFICATION
	if (baseType === 'Essence Scarab of Adaptation') return SCARAB_TYPE.ESSENCE_SCARAB_OF_ADAPTATION
	if (baseType === 'Domination Scarab') return SCARAB_TYPE.DOMINATION_SCARAB
	if (baseType === 'Domination Scarab of Abnormality') return SCARAB_TYPE.DOMINATION_SCARAB_OF_ABNORMALITY
	if (baseType === 'Domination Scarab of Teachings') return SCARAB_TYPE.DOMINATION_SCARAB_OF_TEACHINGS
	if (baseType === 'Domination Scarab of Terrors') return SCARAB_TYPE.DOMINATION_SCARAB_OF_TERRORS
	if (baseType === 'Incursion Scarab') return SCARAB_TYPE.INCURSION_SCARAB
	if (baseType === 'Incursion Scarab of Invasion') return SCARAB_TYPE.INCURSION_SCARAB_OF_INVASION
	if (baseType === 'Incursion Scarab of Champions') return SCARAB_TYPE.INCURSION_SCARAB_OF_CHAMPIONS
	if (baseType === 'Incursion Scarab of Timelines') return SCARAB_TYPE.INCURSION_SCARAB_OF_TIMELINES
	if (baseType === 'Betrayal Scarab') return SCARAB_TYPE.BETRAYAL_SCARAB
	if (baseType === 'Betrayal Scarab of Intelligence') return SCARAB_TYPE.BETRAYAL_SCARAB_OF_INTELLIGENCE
	if (baseType === 'Betrayal Scarab of Reinforcements') return SCARAB_TYPE.BETRAYAL_SCARAB_OF_REINFORCEMENTS
	if (baseType === 'Betrayal Scarab of Perpetuation') return SCARAB_TYPE.BETRAYAL_SCARAB_OF_PERPETUATION
	if (baseType === 'Blight Scarab') return SCARAB_TYPE.BLIGHT_SCARAB
	if (baseType === 'Blight Scarab of Bounty') return SCARAB_TYPE.BLIGHT_SCARAB_OF_BOUNTY
	if (baseType === 'Blight Scarab of Oils') return SCARAB_TYPE.BLIGHT_SCARAB_OF_OILS
	if (baseType === 'Blight Scarab of Blooming') return SCARAB_TYPE.BLIGHT_SCARAB_OF_BLOOMING
	if (baseType === 'Blight Scarab of Invigoration') return SCARAB_TYPE.BLIGHT_SCARAB_OF_INVIGORATION
	if (baseType === 'Breach Scarab') return SCARAB_TYPE.BREACH_SCARAB
	if (baseType === 'Breach Scarab of the Dreamer') return SCARAB_TYPE.BREACH_SCARAB_OF_THE_DREAMER
	if (baseType === 'Breach Scarab of Lordship') return SCARAB_TYPE.BREACH_SCARAB_OF_LORDSHIP
	if (baseType === 'Breach Scarab of Splintering') return SCARAB_TYPE.BREACH_SCARAB_OF_SPLINTERING
	if (baseType === 'Breach Scarab of Snares') return SCARAB_TYPE.BREACH_SCARAB_OF_SNARES
	if (baseType === 'Breach Scarab of Resonant Cascade') return SCARAB_TYPE.BREACH_SCARAB_OF_RESONANT_CASCADE
	if (baseType === 'Legion Scarab') return SCARAB_TYPE.LEGION_SCARAB
	if (baseType === 'Legion Scarab of Officers') return SCARAB_TYPE.LEGION_SCARAB_OF_OFFICERS
	if (baseType === 'Legion Scarab of Command') return SCARAB_TYPE.LEGION_SCARAB_OF_COMMAND
	if (baseType === 'Legion Scarab of The Sekhema') return SCARAB_TYPE.LEGION_SCARAB_OF_THE_SEKHEMA
	if (baseType === 'Legion Scarab of Eternal Conflict') return SCARAB_TYPE.LEGION_SCARAB_OF_ETERNAL_CONFLICT
	if (baseType === 'Cartography Scarab') return SCARAB_TYPE.CARTOGRAPHY_SCARAB
	if (baseType === 'Cartography Scarab of Ascension') return SCARAB_TYPE.CARTOGRAPHY_SCARAB_OF_ASCENSION
	if (baseType === 'Cartography Scarab of Singularity') return SCARAB_TYPE.CARTOGRAPHY_SCARAB_OF_SINGULARITY
	if (baseType === 'Cartography Scarab of Corruption') return SCARAB_TYPE.CARTOGRAPHY_SCARAB_OF_CORRUPTION
	if (baseType === 'Cartography Scarab of Duplication') return SCARAB_TYPE.CARTOGRAPHY_SCARAB_OF_DUPLICATION
	if (baseType === 'Beyond Scarab') return SCARAB_TYPE.BEYOND_SCARAB
	if (baseType === 'Beyond Scarab of Haemophilia') return SCARAB_TYPE.BEYOND_SCARAB_OF_HAEMOPHILIA
	if (baseType === 'Beyond Scarab of Corruption') return SCARAB_TYPE.BEYOND_SCARAB_OF_CORRUPTION
	if (baseType === 'Beyond Scarab of Resurgence') return SCARAB_TYPE.BEYOND_SCARAB_OF_RESURGENCE
	if (baseType === 'Beyond Scarab of the Invasion') return SCARAB_TYPE.BEYOND_SCARAB_OF_THE_INVASION
	if (baseType === 'Ambush Scarab') return SCARAB_TYPE.AMBUSH_SCARAB
	if (baseType === 'Ambush Scarab of Hidden Compartments') return SCARAB_TYPE.AMBUSH_SCARAB_OF_HIDDEN_COMPARTMENTS
	if (baseType === 'Ambush Scarab of Potency') return SCARAB_TYPE.AMBUSH_SCARAB_OF_POTENCY
	if (baseType === 'Ambush Scarab of Containment') return SCARAB_TYPE.AMBUSH_SCARAB_OF_CONTAINMENT
	if (baseType === 'Ambush Scarab of Discernment') return SCARAB_TYPE.AMBUSH_SCARAB_OF_DISCERNMENT
	if (baseType === 'Ultimatum Scarab') return SCARAB_TYPE.ULTIMATUM_SCARAB
	if (baseType === 'Ultimatum Scarab of Bribing') return SCARAB_TYPE.ULTIMATUM_SCARAB_OF_BRIBING
	if (baseType === 'Ultimatum Scarab of Dueling') return SCARAB_TYPE.ULTIMATUM_SCARAB_OF_DUELING
	if (baseType === 'Ultimatum Scarab of Catalysing') return SCARAB_TYPE.ULTIMATUM_SCARAB_OF_CATALYSING
	if (baseType === 'Ultimatum Scarab of Inscription') return SCARAB_TYPE.ULTIMATUM_SCARAB_OF_INSCRIPTION
	if (baseType === 'Expedition Scarab') return SCARAB_TYPE.EXPEDITION_SCARAB
	if (baseType === 'Expedition Scarab of Runefinding') return SCARAB_TYPE.EXPEDITION_SCARAB_OF_RUNEFINDING
	if (baseType === 'Expedition Scarab of Verisium Powder') return SCARAB_TYPE.EXPEDITION_SCARAB_OF_VERISIUM_POWDER
	if (baseType === 'Expedition Scarab of the Skald') return SCARAB_TYPE.EXPEDITION_SCARAB_OF_THE_SKALD
	if (baseType === 'Expedition Scarab of Archaeology') return SCARAB_TYPE.EXPEDITION_SCARAB_OF_ARCHAEOLOGY
	if (baseType === 'Delirium Scarab') return SCARAB_TYPE.DELIRIUM_SCARAB
	if (baseType === 'Delirium Scarab of Mania') return SCARAB_TYPE.DELIRIUM_SCARAB_OF_MANIA
	if (baseType === 'Delirium Scarab of Paranoia') return SCARAB_TYPE.DELIRIUM_SCARAB_OF_PARANOIA
	if (baseType === 'Delirium Scarab of Neuroses') return SCARAB_TYPE.DELIRIUM_SCARAB_OF_NEUROSES
	if (baseType === 'Delirium Scarab of Delusions') return SCARAB_TYPE.DELIRIUM_SCARAB_OF_DELUSIONS
	if (baseType === 'Scarab of Monstrous Lineage') return SCARAB_TYPE.SCARAB_OF_MONSTROUS_LINEAGE
	if (baseType === 'Scarab of Adversaries') return SCARAB_TYPE.SCARAB_OF_ADVERSARIES
	if (baseType === 'Mysterious Scarab') return SCARAB_TYPE.MYSTERIOUS_SCARAB
	if (baseType === 'Scarab of Hunted Traitors') return SCARAB_TYPE.SCARAB_OF_HUNTED_TRAITORS
	if (baseType === 'Scarab of Stability') return SCARAB_TYPE.SCARAB_OF_STABILITY
	if (baseType === 'Scarab of Wisps') return SCARAB_TYPE.SCARAB_OF_WISPS
	if (baseType === 'Scarab of Radiant Storms') return SCARAB_TYPE.SCARAB_OF_RADIANT_STORMS
	if (baseType === 'Horned Scarab of Bloodlines') return SCARAB_TYPE.HORNED_SCARAB_OF_BLOODLINES
	if (baseType === 'Horned Scarab of Nemeses') return SCARAB_TYPE.HORNED_SCARAB_OF_NEMESES
	if (baseType === 'Horned Scarab of Preservation') return SCARAB_TYPE.HORNED_SCARAB_OF_PRESERVATION
	if (baseType === 'Horned Scarab of Awakening') return SCARAB_TYPE.HORNED_SCARAB_OF_AWAKENING
	if (baseType === 'Horned Scarab of Tradition') return SCARAB_TYPE.HORNED_SCARAB_OF_TRADITION
	if (baseType === 'Horned Scarab of Glittering') return SCARAB_TYPE.HORNED_SCARAB_OF_GLITTERING
	if (baseType === 'Horned Scarab of Pandemonium') return SCARAB_TYPE.HORNED_SCARAB_OF_PANDEMONIUM
	else return undefined
}

function generateScarabTier(): ScarabTier {
	return '0'
}

function generateScarabFromPoeItem(
	poeItem: PoeItem,
	prices: Ref<NinjaPriceRecord>,
	priceOverrides: Ref<BulkyItemOverrideRecord>
): ShopScarab | undefined {
	const configStore = useConfigStore()

	const type = generateScarabTypeFromBaseType(poeItem.baseType)
	const tier = generateScarabTier()

	if (!type || !tier || !poeItem.stackSize) return

	return {
		type: type,
		tier: tier,
		name: poeItem.baseType,
		icon: poeItem.icon,
		quantity: poeItem.stackSize,
		price: computed(() => {
			return Math.round((prices.value.get(poeItem.baseType)?.chaos ?? 0) * 10) / 10
		}),
		league: configStore.config.league,
		category: 'SCARAB',
		priceOverride: computed(() => {
			return Math.round((priceOverrides.value.get(`${type}_${tier}`)?.priceOverride ?? 0) * 10) / 10
		}),
		selected: computed(() => {
			return priceOverrides.value.get(`${type}_${tier}`)?.selected ?? true
		}),
	}
}

/**
 * Generate the display name from the type
 * E. g. SCARAB_OF_WISPS -> Scarab Of Wisps
 */
function generateScarabNameFromType(type: ScarabType) {
	return type
		.split('_')
		.map(t => capitalize(t))
		.join(' ')
}
