import { typedFromEntries, getKeys } from '@shared/types/utility.types'

// 144 different maps.
export const MAP_TYPE = {
	ABOMINATION: 'ABOMINATION',
	ACADEMY: 'ACADEMY',
	"ACTON'S_NIGHTMARE": "ACTON'S_NIGHTMARE",
	'AL-HEZMIN,_THE_HUNTER': 'AL-HEZMIN,_THE_HUNTER',
	ALLEYWAYS: 'ALLEYWAYS',
	ALTERED_DISTANT_MEMORY: 'ALTERED_DISTANT_MEMORY',
	ANCIENT_CITY: 'ANCIENT_CITY',
	ARACHNID_TOMB: 'ARACHNID_TOMB',
	ARCADE: 'ARCADE',
	ARMOURY: 'ARMOURY',
	ASHEN_WOOD: 'ASHEN_WOOD',
	ATOLL: 'ATOLL',
	AUGMENTED_DISTANT_MEMORY: 'AUGMENTED_DISTANT_MEMORY',
	'BARAN,_THE_CRUSADER': 'BARAN,_THE_CRUSADER',
	BASILICA: 'BASILICA',
	BEACH: 'BEACH',
	BELFRY: 'BELFRY',
	BOG: 'BOG',
	BONE_CRYPT: 'BONE_CRYPT',
	BRAMBLE_VALLEY: 'BRAMBLE_VALLEY',
	BURIAL_CHAMBERS: 'BURIAL_CHAMBERS',
	"CAER_BLAIDD,_WOLFPACK'S_DEN": "CAER_BLAIDD,_WOLFPACK'S_DEN",
	CAGE: 'CAGE',
	CALDERA: 'CALDERA',
	CARCASS: 'CARCASS',
	CASTLE_RUINS: 'CASTLE_RUINS',
	CELLS: 'CELLS',
	CEMETERY: 'CEMETERY',
	CHANNEL: 'CHANNEL',
	CHATEAU: 'CHATEAU',
	CITADEL: 'CITADEL',
	CITY_SQUARE: 'CITY_SQUARE',
	COLD_RIVER: 'COLD_RIVER',
	COLONNADE: 'COLONNADE',
	COLOSSEUM: 'COLOSSEUM',
	CORAL_RUINS: 'CORAL_RUINS',
	CORTEX: 'CORTEX',
	COURTHOUSE: 'COURTHOUSE',
	COURTYARD: 'COURTYARD',
	COVES: 'COVES',
	CRATER: 'CRATER',
	CRIMSON_TOWNSHIP: 'CRIMSON_TOWNSHIP',
	CRYSTAL_ORE: 'CRYSTAL_ORE',
	CURSED_CRYPT: 'CURSED_CRYPT',
	DARK_FOREST: 'DARK_FOREST',
	DEATH_AND_TAXES: 'DEATH_AND_TAXES',
	DEFILED_CATHEDRAL: 'DEFILED_CATHEDRAL',
	DESERT: 'DESERT',
	DESERT_SPRING: 'DESERT_SPRING',
	DIG: 'DIG',
	"DORYANI'S_MACHINARIUM": "DORYANI'S_MACHINARIUM",
	'DROX,_THE_WARLORD': 'DROX,_THE_WARLORD',
	DRY_SEA: 'DRY_SEA',
	DUNES: 'DUNES',
	DUNGEON: 'DUNGEON',
	ESTUARY: 'ESTUARY',
	FIELDS: 'FIELDS',
	FLOODED_MINE: 'FLOODED_MINE',
	FORBIDDEN_WOODS: 'FORBIDDEN_WOODS',
	FORGE_OF_THE_PHOENIX: 'FORGE_OF_THE_PHOENIX',
	FORTRESS: 'FORTRESS',
	FOUNDRY: 'FOUNDRY',
	FUNGAL_HOLLOW: 'FUNGAL_HOLLOW',
	GARDENS: 'GARDENS',
	GEODE: 'GEODE',
	GLACIER: 'GLACIER',
	GRAVEYARD: 'GRAVEYARD',
	GROTTO: 'GROTTO',
	HALLOWED_GROUND: 'HALLOWED_GROUND',
	HALL_OF_GRANDMASTERS: 'HALL_OF_GRANDMASTERS',
	HAUNTED_MANSION: 'HAUNTED_MANSION',
	INFESTED_VALLEY: 'INFESTED_VALLEY',
	JUNGLE_VALLEY: 'JUNGLE_VALLEY',
	LAIR: 'LAIR',
	LAIR_OF_THE_HYDRA: 'LAIR_OF_THE_HYDRA',
	LAVA_LAKE: 'LAVA_LAKE',
	LEYLINE: 'LEYLINE',
	LIGHTHOUSE: 'LIGHTHOUSE',
	LOOKOUT: 'LOOKOUT',
	MAELSTRÖM_OF_CHAOS: 'MAELSTRÖM_OF_CHAOS',
	MALFORMATION: 'MALFORMATION',
	MAO_KUN: 'MAO_KUN',
	MARSHES: 'MARSHES',
	MAUSOLEUM: 'MAUSOLEUM',
	MAZE: 'MAZE',
	MAZE_OF_THE_MINOTAUR: 'MAZE_OF_THE_MINOTAUR',
	MESA: 'MESA',
	MOON_TEMPLE: 'MOON_TEMPLE',
	MUSEUM: 'MUSEUM',
	NECROPOLIS: 'NECROPOLIS',
	"OBA'S_CURSED_TROVE": "OBA'S_CURSED_TROVE",
	"OLMEC'S_SANCTUM": "OLMEC'S_SANCTUM",
	ORCHARD: 'ORCHARD',
	OVERGROWN_SHRINE: 'OVERGROWN_SHRINE',
	PALACE: 'PALACE',
	PIER: 'PIER',
	PILLARS_OF_ARUN: 'PILLARS_OF_ARUN',
	PIT: 'PIT',
	PIT_OF_THE_CHIMERA: 'PIT_OF_THE_CHIMERA',
	PLATEAU: 'PLATEAU',
	"POORJOY'S_ASYLUM": "POORJOY'S_ASYLUM",
	PORT: 'PORT',
	PROMENADE: 'PROMENADE',
	RACECOURSE: 'RACECOURSE',
	RAMPARTS: 'RAMPARTS',
	RELIC_CHAMBERS: 'RELIC_CHAMBERS',
	REPLICA_CORTEX: 'REPLICA_CORTEX',
	REPLICA_PILLARS_OF_ARUN: 'REPLICA_PILLARS_OF_ARUN',
	"REPLICA_POORJOY'S_ASYLUM": "REPLICA_POORJOY'S_ASYLUM",
	RESIDENCE: 'RESIDENCE',
	REWRITTEN_DISTANT_MEMORY: 'REWRITTEN_DISTANT_MEMORY',
	SANCTUARY: 'SANCTUARY',
	SCRIPTORIUM: 'SCRIPTORIUM',
	SEPULCHRE: 'SEPULCHRE',
	SHORE: 'SHORE',
	SIEGE: 'SIEGE',
	SILO: 'SILO',
	SPIDER_FOREST: 'SPIDER_FOREST',
	SPIDER_LAIR: 'SPIDER_LAIR',
	STRAND: 'STRAND',
	SULPHUR_VENTS: 'SULPHUR_VENTS',
	SUMMIT: 'SUMMIT',
	TEMPLE: 'TEMPLE',
	TERRACE: 'TERRACE',
	THE_CONSTRICTOR: 'THE_CONSTRICTOR',
	"THE_COWARD'S_TRIAL": "THE_COWARD'S_TRIAL",
	THE_ENSLAVER: 'THE_ENSLAVER',
	THE_ERADICATOR: 'THE_ERADICATOR',
	THE_PURIFIER: 'THE_PURIFIER',
	THE_PUTRID_CLOISTER: 'THE_PUTRID_CLOISTER',
	THE_TWILIGHT_TEMPLE: 'THE_TWILIGHT_TEMPLE',
	THE_VINKTAR_SQUARE: 'THE_VINKTAR_SQUARE',
	TOXIC_SEWER: 'TOXIC_SEWER',
	TROPICAL_ISLAND: 'TROPICAL_ISLAND',
	TWISTED_DISTANT_MEMORY: 'TWISTED_DISTANT_MEMORY',
	UNDERGROUND_RIVER: 'UNDERGROUND_RIVER',
	UNDERGROUND_SEA: 'UNDERGROUND_SEA',
	VAAL_PYRAMID: 'VAAL_PYRAMID',
	VAAL_TEMPLE: 'VAAL_TEMPLE',
	VAULT: 'VAULT',
	VAULTS_OF_ATZIRI: 'VAULTS_OF_ATZIRI',
	'VERITANIA,_THE_REDEEMER': 'VERITANIA,_THE_REDEEMER',
	WHAKAWAIRUA_TUAHU: 'WHAKAWAIRUA_TUAHU',
	ZIGGURAT: 'ZIGGURAT',
} as const

export const MAP_TYPE_IDX_TO_NAME = getKeys(MAP_TYPE)

export const MAP_TYPE_NAME_TO_IDX = typedFromEntries(
	Object.entries(MAP_TYPE_IDX_TO_NAME).map(([key, value]) => [value, parseInt(key)])
)

export const MAP_TIER = {
	TIER_1: 'TIER_1',
	TIER_2: 'TIER_2',
	TIER_3: 'TIER_3',
	TIER_4: 'TIER_4',
	TIER_5: 'TIER_5',
	TIER_6: 'TIER_6',
	TIER_7: 'TIER_7',
	TIER_8: 'TIER_8',
	TIER_9: 'TIER_9',
	TIER_10: 'TIER_10',
	TIER_11: 'TIER_11',
	TIER_12: 'TIER_12',
	TIER_13: 'TIER_13',
	TIER_14: 'TIER_14',
	TIER_15: 'TIER_15',
	TIER_16: 'TIER_16',
	TIER_17: 'TIER_17',
} as const

export const MAP_TIER_IDX_TO_NAME = getKeys(MAP_TIER)

export const MAP_TIER_NAME_TO_IDX = typedFromEntries(
	Object.entries(MAP_TIER_IDX_TO_NAME).map(([key, value]) => [value, parseInt(key)])
)

// 129 modifiers.
export const MAP_MODIFIERS = [
	'Players have -20% to all maximum Resistances',
	'Monsters take (36-40)% reduced Extra Damage from Critical Strikes',
	"Players have 3% reduced Action Speed for each time they've used a Skill Recently",
	'Monsters gain (80-100)% of their Physical Damage as Extra Chaos Damage',
	'Unique Bosses are Possessed',
	'(30-40)% increased Monster Damage',
	"Monsters' Attacks have 60% chance to Impale on Hit",
	'(22-25)% increased Monster Damage',
	'Area contains many Totems',
	'Monsters steal Power, Frenzy and Endurance charges on Hit',
	'Rare monsters in area are Shaper-Touched',
	'Players are Cursed with Vulnerability|Players are Cursed with Temporal Chains|Players are Cursed with Elemental Weakness',
	'Area is inhabited by Abominations',
	'Area is inhabited by Solaris fanatics',
	'Players are Cursed with Enfeeble',
	'Area has patches of Consecrated Ground',
	'Players are targeted by a Meteor when they use a Flask',
	'+50% Monster Physical Damage Reduction|+35% Monster Chaos Resistance|+55% Monster Elemental Resistances',
	'Monsters cannot be Leeched from',
	'The Maven interferes with Players',
	'Monsters gain (70-80)% of Maximum Life as Extra Maximum Energy Shield',
	'Monsters have (360-400)% increased Critical Strike Chance|+(41-45)% to Monster Critical Strike Multiplier',
	'Players have 30% less Armour|Players have 40% reduced Chance to Block',
	"Monsters' skills Chain 3 additional times|Monsters' Projectiles can Chain when colliding with Terrain",
	'Area contains Unstable Tentacle Fiends',
	'Area is inhabited by Humanoids',
	'Monsters have +1 to Maximum Power Charges|Monsters gain a Power Charge on Hit',
	'Area contains Runes of the Searing Exarch',
	'Monsters deal (90-110)% extra Physical Damage as Cold',
	'Monsters deal (90-110)% extra Physical Damage as Fire',
	'Monsters gain a Frenzy Charge on Hit',
	'Player Skills which Throw Mines throw 1 fewer Mine|Player Skills which Throw Traps throw 1 fewer Trap',
	'Monsters gain (40-49)% of Maximum Life as Extra Maximum Energy Shield',
	'Monsters have 100% increased Area of Effect|Monsters fire 2 additional Projectiles',
	'Players cannot Regenerate Life, Mana or Energy Shield',
	'Unidentified Map',
	"Area has patches of Awakeners' Desolation",
	'(90-100)% more Monster Life',
	'Monsters reflect 18% of Elemental Damage',
	'Players have (25-30)% less Defences',
	'Monster Damage Penetrates 15% Elemental Resistances',
	"Monsters cannot be Taunted|Monsters' Action Speed cannot be modified to below Base Value|Monsters' Movement Speed cannot be modified to below Base Value",
	'Rare and Unique Monsters remove 5% of Life, Mana and Energy Shield from Players or their Minions on Hit',
	"Monsters' skills Chain 2 additional times",
	'Monsters have +1 to Maximum Frenzy Charges|Monsters gain a Frenzy Charge on Hit',
	'Monsters reflect 20% of Physical Damage|Monsters reflect 20% of Elemental Damage',
	'Area contains Petrification Statues',
	'Monsters Blind on Hit',
	'(25-30)% more Monster Life|Monsters cannot be Stunned',
	'(20-30)% increased Magic Monsters',
	'Debuffs on Monsters expire 100% faster',
	'Area is inhabited by Animals',
	'+40% Monster Physical Damage Reduction',
	'Area is inhabited by Cultists of Kitava',
	'Rare Monsters have Volatile Cores',
	'Monsters have +100% chance to Suppress Spell Damage',
	'Players have 25% less Accuracy Rating',
	'Players have 60% less Recovery Rate of Life and Energy Shield',
	'All Monster Damage can Ignite, Freeze and Shock|Monsters Ignite, Freeze and Shock on Hit',
	'All Monster Damage from Hits always Ignites',
	'Players are Cursed with Vulnerability',
	'Players are Marked for Death for 10 seconds|after killing a Rare or Unique monster',
	'25% chance for Rare Monsters to Fracture on death',
	'Monsters Hinder on Hit with Spells',
	'60% less effect of Curses on Monsters',
	'Players have (50-60)% reduced Maximum total Life, Mana and Energy Shield Recovery per second from Leech',
	'Area has patches of Chilled Ground',
	'(25-30)% increased Monster Movement Speed|(35-45)% increased Monster Attack Speed|(35-45)% increased Monster Cast Speed',
	'Monsters take (35-45)% reduced Extra Damage from Critical Strikes',
	"Monsters cannot be Stunned|Monsters' Action Speed cannot be modified to below Base Value|Monsters' Movement Speed cannot be modified to below Base Value",
	'Monsters have 50% increased Accuracy Rating|Players have -20% to amount of Suppressed Spell Damage Prevented',
	'Buffs on Players expire 70% faster',
	'(40-49)% more Monster Life',
	'Monsters gain a Power Charge on Hit',
	'Players have 40% less Cooldown Recovery Rate',
	'Monsters have a 20% chance to Ignite, Freeze and Shock on Hit',
	'Monsters gain (180-200)% of their Physical Damage as Extra Damage of a random Element',
	'Area has patches of desecrated ground',
	'Area contains Drowning Orbs',
	'Monsters Maim on Hit with Attacks',
	'Players have (-12--9)% to all maximum Resistances',
	'Monsters have +50% Chance to Block Attack Damage',
	'(35-45)% increased number of Rare Monsters|Rare Monsters each have 2 additional Modifiers',
	'Area is inhabited by Goatmen',
	'Monsters gain (31-35)% of their Physical Damage as Extra Chaos Damage|Monsters Inflict Withered for 2 seconds on Hit',
	'Monsters gain an Endurance Charge on Hit',
	"Monsters Poison on Hit|All Damage from Monsters' Hits can Poison|Monsters have 100% increased Poison Duration",
	"Monsters' Attacks Impale on Hit When a fifth Impale is inflicted on a Player, Impales are removed to Reflect their Physical Damage multiplied by their remaining Hits to that Player and their Allies within 1.8 metres",
	'Players are Cursed with Elemental Weakness',
	"15% of Damage Players' Totems take from Hits is taken from their Summoner's Life instead",
	'Area is inhabited by Lunaris fanatics',
	'Players are Cursed with Temporal Chains',
	'Buffs on Players expire 100% faster',
	'+25% Monster Chaos Resistance|+40% Monster Elemental Resistances',
	'Monsters have 70% chance to Avoid Elemental Ailments',
	'Area is inhabited by Demons',
	'Map Boss is accompanied by a Synthesis Boss',
	'Area is inhabited by Ghosts',
	'Monsters fire 2 additional Projectiles',
	'Monsters have 100% increased Area of Effect',
	'Monsters are Hexproof',
	'Area is inhabited by ranged monsters',
	'Area contains two Unique Bosses',
	'Players have 60% reduced effect of Non-Curse Auras from Skills',
	'Area has patches of Burning Ground',
	'Players have (25-30)% less Area of Effect',
	'Monsters have (650-700)% increased Critical Strike Chance|+(70-75)% to Monster Critical Strike Multiplier',
	'Monsters deal (90-110)% extra Physical Damage as Lightning',
	'Players and their Minions deal no damage for 3 out of every 10 seconds',
	'Monsters have +60% chance to Suppress Spell Damage',
	'Unique Monsters have a random Shrine Buff',
	'Monsters Poison on Hit',
	'Unique Boss has 35% increased Life|Unique Boss has 70% increased Area of Effect',
	'Monsters reflect 18% of Physical Damage',
	'Area has patches of Shocked Ground which increase Damage taken by 50%',
	'Monsters have +1 to Maximum Endurance Charges|Monsters gain an Endurance Charge when hit',
	'Players cannot inflict Exposure',
	'Area is inhabited by Undead',
	'Monsters have a 50% chance to avoid Poison, Impale, and Bleeding',
	'(20-30)% increased number of Rare Monsters',
	'Players gain 50% reduced Flask Charges',
	'Monsters inflict 2 Grasping Vines on Hit',
	'Players have 25% less Area of Effect',
	'Area is inhabited by Skeletons',
	'Area is inhabited by Sea Witches and their Spawn',
	'Area has increased monster variety',
	'Unique Boss deals 25% increased Damage|Unique Boss has 30% increased Attack and Cast Speed',
	'Players are assaulted by Bloodstained Sawblades',
	"Players' Minions have 50% less Attack Speed|Players' Minions have 50% less Cast Speed|Players' Minions have 50% less Movement Speed",
]

export const MAP_MODIFIER_REGEX = [
	// Players have -20% to all maximum Resistances
	/o al/im,
	// Monsters take (36-40)% reduced Extra Damage from Critical Strikes
	/kes/im,
	// Players have 3% reduced Action Speed for each time they've used a Skill Recently
	/'v/im,
	// Monsters gain (80-100)% of their Physical Damage as Extra Chaos Damage
	/ra c/im,
	// Unique Bosses are Possessed
	/poss/im,
	// (30-40)% increased Monster Damage
	/r damage$/im,
	// Monsters' Attacks have 60% chance to Impale on Hit
	/ks h/im,
	// (22-25)% increased Monster Damage
	/r damage$/im,
	// Area contains many Totems
	/ms$/im,
	// Monsters steal Power, Frenzy and Endurance charges on Hit
	/teal/im,
	// Rare monsters in area are Shaper-Touched
	/hap/im,
	// Players are Cursed with Vulnerability|Players are Cursed with Temporal Chains|Players are Cursed with Elemental Weakness
	/vu/im,
	// Area is inhabited by Abominations
	/bom/im,
	// Area is inhabited by Solaris fanatics
	/solar/im,
	// Players are Cursed with Enfeeble
	/enf/im,
	// Area has patches of Consecrated Ground
	/nsec/im,
	// Players are targeted by a Meteor when they use a Flask
	/get/im,
	// +50% Monster Physical Damage Reduction|+35% Monster Chaos Resistance|+55% Monster Elemental Resistances
	/uct/im,
	// Monsters cannot be Leeched from
	/om$/im,
	// The Maven interferes with Players
	/mav/im,
	// Monsters gain (70-80)% of Maximum Life as Extra Maximum Energy Shield
	/of m/im,
	// Monsters have (360-400)% increased Critical Strike Chance|+(41-45)% to Monster Critical Strike Multiplier
	/lier/im,
	// Players have 30% less Armour|Players have 40% reduced Chance to Block
	/ur$/im,
	// Monsters' skills Chain 3 additional times|Monsters' Projectiles can Chain when colliding with Terrain
	/lid/im,
	// Area contains Unstable Tentacle Fiends
	/acl/im,
	// Area is inhabited by Humanoids
	/hum/im,
	// Monsters have +1 to Maximum Power Charges|Monsters gain a Power Charge on Hit
	/mum p/im,
	// Area contains Runes of the Searing Exarch
	/rune/im,
	// Monsters deal (90-110)% extra Physical Damage as Cold
	/old$/im,
	// Monsters deal (90-110)% extra Physical Damage as Fire
	/fire$/im,
	// Monsters gain a Frenzy Charge on Hit
	/zy c/im,
	// Player Skills which Throw Mines throw 1 fewer Mine|Player Skills which Throw Traps throw 1 fewer Trap
	/thr/im,
	// Monsters gain (40-49)% of Maximum Life as Extra Maximum Energy Shield
	/of m/im,
	// Monsters have 100% increased Area of Effect|Monsters fire 2 additional Projectiles
	/tiles$/im,
	// Players cannot Regenerate Life, Mana or Energy Shield
	/gen/im,
	// Unidentified Map
	/tif/im,
	// Area has patches of Awakeners' Desolation
	/wak/im,
	// (90-100)% more Monster Life
	/r li/im,
	// Monsters reflect 18% of Elemental Damage
	/f el/im,
	// Players have (25-30)% less Defences
	/efe/im,
	// Monster Damage Penetrates 15% Elemental Resistances
	/net/im,
	// Monsters cannot be Taunted|Monsters' Action Speed cannot be modified to below Base Value|Monsters' Movement Speed cannot be modified to below Base Value
	/taun/im,
	// Rare and Unique Monsters remove 5% of Life, Mana and Energy Shield from Players or their Minions on Hit
	/ld f/im,
	// Monsters' skills Chain 2 additional times
	/imes/im,
	// Monsters have +1 to Maximum Frenzy Charges|Monsters gain a Frenzy Charge on Hit
	/mum f/im,
	// Monsters reflect 20% of Physical Damage|Monsters reflect 20% of Elemental Damage
	/f ph/im,
	// Area contains Petrification Statues
	/pet/im,
	// Monsters Blind on Hit
	/blin/im,
	// (25-30)% more Monster Life|Monsters cannot be Stunned
	/tun/im,
	// (20-30)% increased Magic Monsters
	/d mag/im,
	// Debuffs on Monsters expire 100% faster
	/deb/im,
	// Area is inhabited by Animals
	/nim/im,
	// +40% Monster Physical Damage Reduction
	/uct/im,
	// Area is inhabited by Cultists of Kitava
	/cul/im,
	// Rare Monsters have Volatile Cores
	/vola/im,
	// Monsters have +100% chance to Suppress Spell Damage
	/o su/im,
	// Players have 25% less Accuracy Rating
	/ss ac/im,
	// Players have 60% less Recovery Rate of Life and Energy Shield
	/s rec/im,
	// All Monster Damage can Ignite, Freeze and Shock|Monsters Ignite, Freeze and Shock on Hit
	/hock$/im,
	// All Monster Damage from Hits always Ignites
	/lw/im,
	// Players are Cursed with Vulnerability
	/vu/im,
	// Players are Marked for Death for 10 seconds|after killing a Rare or Unique monster
	/rke/im,
	// 25% chance for Rare Monsters to Fracture on death
	/fra/im,
	// Monsters Hinder on Hit with Spells
	/hind/im,
	// 60% less effect of Curses on Monsters
	/rses/im,
	// Players have (50-60)% reduced Maximum total Life, Mana and Energy Shield Recovery per second from Leech
	/tota/im,
	// Area has patches of Chilled Ground
	/hil/im,
	// (25-30)% increased Monster Movement Speed|(35-45)% increased Monster Attack Speed|(35-45)% increased Monster Cast Speed
	/r at/im,
	// Monsters take (35-45)% reduced Extra Damage from Critical Strikes
	/kes/im,
	// Monsters cannot be Stunned|Monsters' Action Speed cannot be modified to below Base Value|Monsters' Movement Speed cannot be modified to below Base Value
	/tun/im,
	// Monsters have 50% increased Accuracy Rating|Players have -20% to amount of Suppressed Spell Damage Prevented
	/prev/im,
	// Buffs on Players expire 70% faster
	/^buf/im,
	// (40-49)% more Monster Life
	/r li/im,
	// Monsters gain a Power Charge on Hit
	/a pow/im,
	// Players have 40% less Cooldown Recovery Rate
	/coo/im,
	// Monsters have a 20% chance to Ignite, Freeze and Shock on Hit
	/o ig/im,
	// Monsters gain (180-200)% of their Physical Damage as Extra Damage of a random Element
	/ment$/im,
	// Area has patches of desecrated ground
	/f de/im,
	// Area contains Drowning Orbs
	/wni/im,
	// Monsters Maim on Hit with Attacks
	/aim/im,
	// Players have (-12--9)% to all maximum Resistances
	/o al/im,
	// Monsters have +50% Chance to Block Attack Damage
	/k at/im,
	// (35-45)% increased number of Rare Monsters|Rare Monsters each have 2 additional Modifiers
	/iers$/im,
	// Area is inhabited by Goatmen
	/oa/im,
	// Monsters gain (31-35)% of their Physical Damage as Extra Chaos Damage|Monsters Inflict Withered for 2 seconds on Hit
	/ered/im,
	// Monsters gain an Endurance Charge on Hit
	/e charge o/im,
	// Monsters Poison on Hit|All Damage from Monsters' Hits can Poison|Monsters have 100% increased Poison Duration
	/son$/im,
	// Monsters' Attacks Impale on Hit When a fifth Impale is inflicted on a Player, Impales are removed to Reflect their Physical Damage multiplied by their remaining Hits to that Player and their Allies within 1.8 metres
	/fif/im,
	// Players are Cursed with Elemental Weakness
	/kn/im,
	// 15% of Damage Players' Totems take from Hits is taken from their Summoner's Life instead
	/mmo/im,
	// Area is inhabited by Lunaris fanatics
	/lun/im,
	// Players are Cursed with Temporal Chains
	/mpo/im,
	// Buffs on Players expire 100% faster
	/^buf/im,
	// +25% Monster Chaos Resistance|+40% Monster Elemental Resistances
	/r el/im,
	// Monsters have 70% chance to Avoid Elemental Ailments
	/lm/im,
	// Area is inhabited by Demons
	/emons/im,
	// Map Boss is accompanied by a Synthesis Boss
	/yn/im,
	// Area is inhabited by Ghosts
	/osts/im,
	// Monsters fire 2 additional Projectiles
	/tiles$/im,
	// Monsters have 100% increased Area of Effect
	/e \d+% increased ar/im,
	// Monsters are Hexproof
	/hex/im,
	// Area is inhabited by ranged monsters
	/rang/im,
	// Area contains two Unique Bosses
	/two/im,
	// Players have 60% reduced effect of Non-Curse Auras from Skills
	/non/im,
	// Area has patches of Burning Ground
	/urn/im,
	// Players have (25-30)% less Area of Effect
	/ss are/im,
	// Monsters have (650-700)% increased Critical Strike Chance|+(70-75)% to Monster Critical Strike Multiplier
	/lier/im,
	// Monsters deal (90-110)% extra Physical Damage as Lightning
	/tn/im,
	// Players and their Minions deal no damage for 3 out of every 10 seconds
	/ever/im,
	// Monsters have +60% chance to Suppress Spell Damage
	/o su/im,
	// Unique Monsters have a random Shrine Buff
	/ff$/im,
	// Monsters Poison on Hit
	/son o/im,
	// Unique Boss has 35% increased Life|Unique Boss has 70% increased Area of Effect
	/d li/im,
	// Monsters reflect 18% of Physical Damage
	/f ph/im,
	// Area has patches of Shocked Ground which increase Damage taken by 50%
	/ocke/im,
	// Monsters have +1 to Maximum Endurance Charges|Monsters gain an Endurance Charge when hit
	/m end/im,
	// Players cannot inflict Exposure
	/xpo/im,
	// Area is inhabited by Undead
	/ndea/im,
	// Monsters have a 50% chance to avoid Poison, Impale, and Bleeding
	/on,/im,
	// (20-30)% increased number of Rare Monsters
	/nu/im,
	// Players gain 50% reduced Flask Charges
	/d fl/im,
	// Monsters inflict 2 Grasping Vines on Hit
	/pin/im,
	// Players have 25% less Area of Effect
	/ss are/im,
	// Area is inhabited by Skeletons
	/ske/im,
	// Area is inhabited by Sea Witches and their Spawn
	/itc/im,
	// Area has increased monster variety
	/ety/im,
	// Unique Boss deals 25% increased Damage|Unique Boss has 30% increased Attack and Cast Speed
	/d at/im,
	// Players are assaulted by Bloodstained Sawblades
	/wb/im,
	// Players' Minions have 50% less Attack Speed|Players' Minions have 50% less Cast Speed|Players' Minions have 50% less Movement Speed
	/' mi/im,
]
