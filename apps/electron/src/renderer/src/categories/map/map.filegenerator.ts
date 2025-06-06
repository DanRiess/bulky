/**
 * This script can generate the map.const.ts file.
 * It grabs metadata from poedb.tw and generates the file from it.
 * Consider using pathofexile.com/api/trade/data/static instead if necessary.
 *
 * Technically, it could also generate the transformer and type files,
 * but that was more work than doing it manually. The const file is also the only
 * one that might need to be updated in the future.
 */

import { writeFileSync } from 'node:fs'

async function getPoeDbItemData() {
	const response = await fetch(
		`https://poedb.tw/json/autocomplete_us.json?${new Date().toISOString().slice(0, 10).replace(/-/g, '')}`
	)
	const data = (await response.json()) as { label: string; value: string; desc: string; class: string }[]

	const maps = data.filter(item => item.desc === 'Maps')

	return maps
		.map(item => item.value.replace(/_map/i, '').toUpperCase())
		.filter(Boolean)
		.sort()
}

getPoeDbItemData().then(items => {
	console.log({ items })
	console.log('Generate the map.const.ts content')

	// Imports
	const imports = "import { typedFromEntries, getKeys } from '@shared/types/utility.types'"

	// Map Types
	const types = `// ${items.length} different maps.\nexport const MAP_TYPE = {\n${items
		.map(item => `"${item}": "${item}",`)
		.join('\n')}\n} as const`
	const typeIdxToName = 'export const MAP_TYPE_IDX_TO_NAME = getKeys(MAP_TYPE)'
	const typeNameToIdx =
		'export const MAP_TYPE_NAME_TO_IDX = typedFromEntries(Object.entries(MAP_TYPE_IDX_TO_NAME).map(([key, value]) => [value, parseInt(key)]))'

	// Map Tiers
	const tiers = `export const MAP_TIER = {\n${new Array(17)
		.fill(0)
		.map((_, idx) => `TIER_${idx + 1}: 'TIER_${idx + 1}',`)
		.join('\n')}\n} as const`
	const tierIdxToName = 'export const MAP_TIER_IDX_TO_NAME = getKeys(MAP_TIER)'
	const tierNameToIdx =
		'export const MAP_TIER_NAME_TO_IDX = typedFromEntries(Object.entries(MAP_TIER_IDX_TO_NAME).map(([key, value]) => [value, parseInt(key)]))'

	// Combine the parts into the full file
	const fullFile = `${imports} \n\n ${types} \n\n ${typeIdxToName} \n\n ${typeNameToIdx} \n\n ${tiers} \n\n ${tierIdxToName} \n\n ${tierNameToIdx} \n\n ${getMapModifiers()} \n\n ${getMapModifierRegexes()}`

	console.log('Writing to file map.const.ts')
	writeFileSync('./map.const.ts', fullFile)
	console.log('Written file successfully. Please check, format and save it.')
})

function getMapModifiers() {
	const mods = regexMapModifierT17.map(mod => `"${mod.rawText}"\n`)
	return `// ${regexMapModifierT17.length} modifiers.\nexport const MAP_MODIFIERS = [\n${mods}]`
}

function getMapModifierRegexes() {
	const regexes = regexMapModifierT17.map(mod => `\n\t// ${mod.rawText}\n\t/${mod.regex}/im\n`)
	return `export const MAP_MODIFIER_REGEX = [\n${regexes}]`
}

/**
 * These map modifiers were shamefully yoinked from the poe.re repository:
 * https://github.com/veiset/poe-vendor-string/blob/171622b8bfd2783ecddc5aa5c995afa676240b83/src/generated/GeneratedMapModsT17.ts
 */
interface Token<T> {
	id: number
	regex: string
	rawText: string
	generalizedText: string
	options: T
}
// interface TokenOptimization {
//   ids: number[],
//   regex: string,
//   weight: number,
//   count: number,
// }
// interface Regex<T> {
//   tokens: Token<T>[],
//   optimizationTable: {[ids: string]: TokenOptimization },
// }

interface MapModifierT17TokenOption {
	tier17: boolean
	scary: number
}

const regexMapModifierT17: Token<MapModifierT17TokenOption>[] = [
	{
		id: -2106392014,
		regex: 'o al',
		rawText: 'Players have -20% to all maximum Resistances',
		generalizedText: '^players have -#% to all maximum resistances$',
		options: { tier17: true, scary: 2169 },
	},
	{
		id: -2103899765,
		regex: 'kes',
		rawText: 'Monsters take (36-40)% reduced Extra Damage from Critical Strikes',
		generalizedText: '^monsters take #% reduced extra damage from critical strikes$',
		options: { tier17: false, scary: 250 },
	},
	{
		id: -2068532865,
		regex: "'v",
		rawText: "Players have 3% reduced Action Speed for each time they've used a Skill Recently",
		generalizedText: "^players have #% reduced action speed for each time they've used a skill recently$",
		options: { tier17: true, scary: 1188 },
	},
	{
		id: -2066574800,
		regex: 'ra c',
		rawText: 'Monsters gain (80-100)% of their Physical Damage as Extra Chaos Damage',
		generalizedText: '^monsters gain #% of their physical damage as extra chaos damage$',
		options: { tier17: true, scary: 1666 },
	},
	{
		id: -2060936381,
		regex: 'poss',
		rawText: 'Unique Bosses are Possessed',
		generalizedText: '^unique bosses are possessed$',
		options: { tier17: true, scary: 240 },
	},
	{
		id: -1994088653,
		regex: 'r damage$',
		rawText: '(30-40)% increased Monster Damage',
		generalizedText: '^#% increased monster damage$',
		options: { tier17: true, scary: 1601 },
	},
	{
		id: -1952553467,
		regex: 'ks h',
		rawText: "Monsters' Attacks have 60% chance to Impale on Hit",
		generalizedText: "^monsters' attacks have #% chance to impale on hit$",
		options: { tier17: false, scary: 98 },
	},
	{
		id: -1942271057,
		regex: 'r damage$',
		rawText: '(22-25)% increased Monster Damage',
		generalizedText: '^#% increased monster damage$',
		options: { tier17: false, scary: 370 },
	},
	{
		id: -1926268187,
		regex: 'ms$',
		rawText: 'Area contains many Totems',
		generalizedText: '^area contains many totems$',
		options: { tier17: false, scary: 9 },
	},
	{
		id: -1869263008,
		regex: 'teal',
		rawText: 'Monsters steal Power, Frenzy and Endurance charges on Hit',
		generalizedText: '^monsters steal power, frenzy and endurance charges on hit$',
		options: { tier17: false, scary: 80 },
	},
	{
		id: -1842810065,
		regex: 'hap',
		rawText: 'Rare monsters in area are Shaper-Touched',
		generalizedText: '^rare monsters in area are shaper-touched$',
		options: { tier17: true, scary: 1184 },
	},
	{
		id: -1834985050,
		regex: 'vu',
		rawText:
			'Players are Cursed with Vulnerability|Players are Cursed with Temporal Chains|Players are Cursed with Elemental Weakness',
		generalizedText:
			'^players are cursed with vulnerability$|^players are cursed with temporal chains$|^players are cursed with elemental weakness$',
		options: { tier17: true, scary: 1556 },
	},
	{
		id: -1781581610,
		regex: 'bom',
		rawText: 'Area is inhabited by Abominations',
		generalizedText: '^area is inhabited by abominations$',
		options: { tier17: false, scary: 4 },
	},
	{
		id: -1772227908,
		regex: 'solar',
		rawText: 'Area is inhabited by Solaris fanatics',
		generalizedText: '^area is inhabited by solaris fanatics$',
		options: { tier17: false, scary: 4 },
	},
	{
		id: -1705341052,
		regex: 'enf',
		rawText: 'Players are Cursed with Enfeeble',
		generalizedText: '^players are cursed with enfeeble$',
		options: { tier17: false, scary: 360 },
	},
	{
		id: -1678942184,
		regex: 'nsec',
		rawText: 'Area has patches of Consecrated Ground',
		generalizedText: '^area has patches of consecrated ground$',
		options: { tier17: false, scary: 310 },
	},
	{
		id: -1660701657,
		regex: 'get',
		rawText: 'Players are targeted by a Meteor when they use a Flask',
		generalizedText: '^players are targeted by a meteor when they use a flask$',
		options: { tier17: true, scary: 1403 },
	},
	{
		id: -1636388574,
		regex: 'uct',
		rawText: '+50% Monster Physical Damage Reduction|+35% Monster Chaos Resistance|+55% Monster Elemental Resistances',
		generalizedText:
			'^#% monster physical damage reduction$|^#% monster chaos resistance$|^#% monster elemental resistances$',
		options: { tier17: true, scary: 1378 },
	},
	{
		id: -1621229119,
		regex: 'om$',
		rawText: 'Monsters cannot be Leeched from',
		generalizedText: '^monsters cannot be leeched from$',
		options: { tier17: false, scary: 600 },
	},
	{
		id: -1514062481,
		regex: 'mav',
		rawText: 'The Maven interferes with Players',
		generalizedText: '^the maven interferes with players$',
		options: { tier17: true, scary: 1183 },
	},
	{
		id: -1505174556,
		regex: 'of m',
		rawText: 'Monsters gain (70-80)% of Maximum Life as Extra Maximum Energy Shield',
		generalizedText: '^monsters gain #% of maximum life as extra maximum energy shield$',
		options: { tier17: true, scary: 1452 },
	},
	{
		id: -1462808973,
		regex: 'lier',
		rawText: 'Monsters have (360-400)% increased Critical Strike Chance|+(41-45)% to Monster Critical Strike Multiplier',
		generalizedText: '^monsters have #% increased critical strike chance$|^+#% to monster critical strike multiplier$',
		options: { tier17: false, scary: 500 },
	},
	{
		id: -1403235912,
		regex: 'ur$',
		rawText: 'Players have 30% less Armour|Players have 40% reduced Chance to Block',
		generalizedText: '^players have #% less armour$|^players have #% reduced chance to block$',
		options: { tier17: false, scary: 295 },
	},
	{
		id: -1331734856,
		regex: 'lid',
		rawText: "Monsters' skills Chain 3 additional times|Monsters' Projectiles can Chain when colliding with Terrain",
		generalizedText:
			"^monsters' skills chain # additional times$|^monsters' projectiles can chain when colliding with terrain$",
		options: { tier17: true, scary: 1639 },
	},
	{
		id: -1321541749,
		regex: 'acl',
		rawText: 'Area contains Unstable Tentacle Fiends',
		generalizedText: '^area contains unstable tentacle fiends$',
		options: { tier17: true, scary: 1221 },
	},
	{
		id: -1175378302,
		regex: 'hum',
		rawText: 'Area is inhabited by Humanoids',
		generalizedText: '^area is inhabited by humanoids$',
		options: { tier17: false, scary: 4 },
	},
	{
		id: -1129414698,
		regex: 'mum p',
		rawText: 'Monsters have +1 to Maximum Power Charges|Monsters gain a Power Charge on Hit',
		generalizedText: '^monsters have # to maximum power charges$|^monsters gain a power charge on hit$',
		options: { tier17: true, scary: 1287 },
	},
	{
		id: -1124347635,
		regex: 'rune',
		rawText: 'Area contains Runes of the Searing Exarch',
		generalizedText: '^area contains runes of the searing exarch$',
		options: { tier17: true, scary: 1222 },
	},
	{
		id: -1121411477,
		regex: 'old$',
		rawText: 'Monsters deal (90-110)% extra Physical Damage as Cold',
		generalizedText: '^monsters deal #% extra physical damage as cold$',
		options: { tier17: false, scary: 450 },
	},
	{
		id: -1121327683,
		regex: 'fire$',
		rawText: 'Monsters deal (90-110)% extra Physical Damage as Fire',
		generalizedText: '^monsters deal #% extra physical damage as fire$',
		options: { tier17: false, scary: 450 },
	},
	{
		id: -1036254613,
		regex: 'zy c',
		rawText: 'Monsters gain a Frenzy Charge on Hit',
		generalizedText: '^monsters gain a frenzy charge on hit$',
		options: { tier17: false, scary: 80 },
	},
	{
		id: -1033371824,
		regex: 'thr',
		rawText: 'Player Skills which Throw Mines throw 1 fewer Mine|Player Skills which Throw Traps throw 1 fewer Trap',
		generalizedText:
			'^player skills which throw mines throw # fewer mine$|^player skills which throw traps throw # fewer trap$',
		options: { tier17: true, scary: 1198 },
	},
	{
		id: -926892006,
		regex: 'of m',
		rawText: 'Monsters gain (40-49)% of Maximum Life as Extra Maximum Energy Shield',
		generalizedText: '^monsters gain #% of maximum life as extra maximum energy shield$',
		options: { tier17: false, scary: 240 },
	},
	{
		id: -894195682,
		regex: 'tiles$',
		rawText: 'Monsters have 100% increased Area of Effect|Monsters fire 2 additional Projectiles',
		generalizedText: '^monsters have #% increased area of effect$|^monsters fire # additional projectiles$',
		options: { tier17: true, scary: 1644 },
	},
	{
		id: -818452956,
		regex: 'gen',
		rawText: 'Players cannot Regenerate Life, Mana or Energy Shield',
		generalizedText: '^players cannot regenerate life, mana or energy shield$',
		options: { tier17: false, scary: 700 },
	},
	{
		id: -807590096,
		regex: 'tif',
		rawText: 'Unidentified Map',
		generalizedText: '^unidentified map$',
		options: { tier17: true, scary: 121 },
	},
	{
		id: -710235370,
		regex: 'wak',
		rawText: "Area has patches of Awakeners' Desolation",
		generalizedText: "^area has patches of awakeners' desolation$",
		options: { tier17: true, scary: 1530 },
	},
	{
		id: -704095924,
		regex: 'r li',
		rawText: '(90-100)% more Monster Life',
		generalizedText: '^#% more monster life$',
		options: { tier17: true, scary: 1329 },
	},
	{
		id: -696963131,
		regex: 'f el',
		rawText: 'Monsters reflect 18% of Elemental Damage',
		generalizedText: '^monsters reflect #% of elemental damage$',
		options: { tier17: false, scary: 1000 },
	},
	{
		id: -669857265,
		regex: 'efe',
		rawText: 'Players have (25-30)% less Defences',
		generalizedText: '^players have #% less defences$',
		options: { tier17: true, scary: 1191 },
	},
	{
		id: -620427144,
		regex: 'net',
		rawText: 'Monster Damage Penetrates 15% Elemental Resistances',
		generalizedText: '^monster damage penetrates #% elemental resistances$',
		options: { tier17: true, scary: 1216 },
	},
	{
		id: -529767307,
		regex: 'taun',
		rawText:
			"Monsters cannot be Taunted|Monsters' Action Speed cannot be modified to below Base Value|Monsters' Movement Speed cannot be modified to below Base Value",
		generalizedText:
			"^monsters cannot be taunted$|^monsters' action speed cannot be modified to below base value$|^monsters' movement speed cannot be modified to below base value$",
		options: { tier17: false, scary: 89 },
	},
	{
		id: -525989649,
		regex: 'ld f',
		rawText: 'Rare and Unique Monsters remove 5% of Life, Mana and Energy Shield from Players or their Minions on Hit',
		generalizedText:
			'^rare and unique monsters remove #% of life, mana and energy shield from players or their minions on hit$',
		options: { tier17: true, scary: 1185 },
	},
	{
		id: -500015770,
		regex: 'imes',
		rawText: "Monsters' skills Chain 2 additional times",
		generalizedText: "^monsters' skills chain # additional times$",
		options: { tier17: false, scary: 380 },
	},
	{
		id: -474049160,
		regex: 'mum f',
		rawText: 'Monsters have +1 to Maximum Frenzy Charges|Monsters gain a Frenzy Charge on Hit',
		generalizedText: '^monsters have # to maximum frenzy charges$|^monsters gain a frenzy charge on hit$',
		options: { tier17: true, scary: 1288 },
	},
	{
		id: -412180168,
		regex: 'f ph',
		rawText: 'Monsters reflect 20% of Physical Damage|Monsters reflect 20% of Elemental Damage',
		generalizedText: '^monsters reflect #% of physical damage$|^monsters reflect #% of elemental damage$',
		options: { tier17: true, scary: 2202 },
	},
	{
		id: -380667604,
		regex: 'pet',
		rawText: 'Area contains Petrification Statues',
		generalizedText: '^area contains petrification statues$',
		options: { tier17: true, scary: 1223 },
	},
	{
		id: -309278236,
		regex: 'blin',
		rawText: 'Monsters Blind on Hit',
		generalizedText: '^monsters blind on hit$',
		options: { tier17: false, scary: 50 },
	},
	{
		id: -208379648,
		regex: 'tun',
		rawText: '(25-30)% more Monster Life|Monsters cannot be Stunned',
		generalizedText: '^#% more monster life$|^monsters cannot be stunned$',
		options: { tier17: false, scary: 100 },
	},
	{
		id: -199953078,
		regex: 'd mag',
		rawText: '(20-30)% increased Magic Monsters',
		generalizedText: '^#% increased magic monsters$',
		options: { tier17: false, scary: 0 },
	},
	{
		id: -151531429,
		regex: 'deb',
		rawText: 'Debuffs on Monsters expire 100% faster',
		generalizedText: '^debuffs on monsters expire #% faster$',
		options: { tier17: true, scary: 1314 },
	},
	{
		id: -120302365,
		regex: 'nim',
		rawText: 'Area is inhabited by Animals',
		generalizedText: '^area is inhabited by animals$',
		options: { tier17: false, scary: 4 },
	},
	{
		id: -50320413,
		regex: 'uct',
		rawText: '+40% Monster Physical Damage Reduction',
		generalizedText: '^#% monster physical damage reduction$',
		options: { tier17: false, scary: 150 },
	},
	{
		id: -36534794,
		regex: 'cul',
		rawText: 'Area is inhabited by Cultists of Kitava',
		generalizedText: '^area is inhabited by cultists of kitava$',
		options: { tier17: false, scary: 4 },
	},
	{
		id: -34164001,
		regex: 'vola',
		rawText: 'Rare Monsters have Volatile Cores',
		generalizedText: '^rare monsters have volatile cores$',
		options: { tier17: true, scary: 1186 },
	},
	{
		id: -6327993,
		regex: 'o su',
		rawText: 'Monsters have +100% chance to Suppress Spell Damage',
		generalizedText: '^monsters have #% chance to suppress spell damage$',
		options: { tier17: true, scary: 1496 },
	},
	{
		id: 60084997,
		regex: 'ss ac',
		rawText: 'Players have 25% less Accuracy Rating',
		generalizedText: '^players have #% less accuracy rating$',
		options: { tier17: false, scary: 85 },
	},
	{
		id: 164309504,
		regex: 's rec',
		rawText: 'Players have 60% less Recovery Rate of Life and Energy Shield',
		generalizedText: '^players have #% less recovery rate of life and energy shield$',
		options: { tier17: false, scary: 650 },
	},
	{
		id: 190130927,
		regex: 'hock$',
		rawText: 'All Monster Damage can Ignite, Freeze and Shock|Monsters Ignite, Freeze and Shock on Hit',
		generalizedText: '^all monster damage can ignite, freeze and shock$|^monsters ignite, freeze and shock on hit$',
		options: { tier17: true, scary: 1225 },
	},
	{
		id: 200974414,
		regex: 'lw',
		rawText: 'All Monster Damage from Hits always Ignites',
		generalizedText: '^all monster damage from hits always ignites$',
		options: { tier17: false, scary: 99 },
	},
	{
		id: 229682870,
		regex: 'vu',
		rawText: 'Players are Cursed with Vulnerability',
		generalizedText: '^players are cursed with vulnerability$',
		options: { tier17: false, scary: 360 },
	},
	{
		id: 310013779,
		regex: 'rke',
		rawText: 'Players are Marked for Death for 10 seconds|after killing a Rare or Unique monster',
		generalizedText: '^players are marked for death for # seconds$|^after killing a rare or unique monster$',
		options: { tier17: true, scary: 1195 },
	},
	{
		id: 355492922,
		regex: 'fra',
		rawText: '25% chance for Rare Monsters to Fracture on death',
		generalizedText: '^#% chance for rare monsters to fracture on death$',
		options: { tier17: true, scary: 1226 },
	},
	{
		id: 465825356,
		regex: 'hind',
		rawText: 'Monsters Hinder on Hit with Spells',
		generalizedText: '^monsters hinder on hit with spells$',
		options: { tier17: false, scary: 50 },
	},
	{
		id: 493223943,
		regex: 'rses',
		rawText: '60% less effect of Curses on Monsters',
		generalizedText: '^#% less effect of curses on monsters$',
		options: { tier17: false, scary: 363 },
	},
	{
		id: 511980950,
		regex: 'tota',
		rawText: 'Players have (50-60)% reduced Maximum total Life, Mana and Energy Shield Recovery per second from Leech',
		generalizedText: '^players have #% reduced maximum total life, mana and energy shield recovery per second from leech$',
		options: { tier17: true, scary: 1190 },
	},
	{
		id: 525934570,
		regex: 'hil',
		rawText: 'Area has patches of Chilled Ground',
		generalizedText: '^area has patches of chilled ground$',
		options: { tier17: false, scary: 310 },
	},
	{
		id: 550943268,
		regex: 'r at',
		rawText:
			'(25-30)% increased Monster Movement Speed|(35-45)% increased Monster Attack Speed|(35-45)% increased Monster Cast Speed',
		generalizedText:
			'^#% increased monster movement speed$|^#% increased monster attack speed$|^#% increased monster cast speed$',
		options: { tier17: true, scary: 607 },
	},
	{
		id: 577057701,
		regex: 'kes',
		rawText: 'Monsters take (35-45)% reduced Extra Damage from Critical Strikes',
		generalizedText: '^monsters take #% reduced extra damage from critical strikes$',
		options: { tier17: true, scary: 1451 },
	},
	{
		id: 581472251,
		regex: 'tun',
		rawText:
			"Monsters cannot be Stunned|Monsters' Action Speed cannot be modified to below Base Value|Monsters' Movement Speed cannot be modified to below Base Value",
		generalizedText:
			"^monsters cannot be stunned$|^monsters' action speed cannot be modified to below base value$|^monsters' movement speed cannot be modified to below base value$",
		options: { tier17: true, scary: 1314 },
	},
	{
		id: 638612957,
		regex: 'prev',
		rawText: 'Monsters have 50% increased Accuracy Rating|Players have -20% to amount of Suppressed Spell Damage Prevented',
		generalizedText:
			'^monsters have #% increased accuracy rating$|^players have -#% to amount of suppressed spell damage prevented$',
		options: { tier17: false, scary: 365 },
	},
	{
		id: 667938191,
		regex: '^buf',
		rawText: 'Buffs on Players expire 70% faster',
		generalizedText: '^buffs on players expire #% faster$',
		options: { tier17: false, scary: 96 },
	},
	{
		id: 694566327,
		regex: 'r li',
		rawText: '(40-49)% more Monster Life',
		generalizedText: '^#% more monster life$',
		options: { tier17: false, scary: 100 },
	},
	{
		id: 719111530,
		regex: 'a pow',
		rawText: 'Monsters gain a Power Charge on Hit',
		generalizedText: '^monsters gain a power charge on hit$',
		options: { tier17: false, scary: 80 },
	},
	{
		id: 729842044,
		regex: 'coo',
		rawText: 'Players have 40% less Cooldown Recovery Rate',
		generalizedText: '^players have #% less cooldown recovery rate$',
		options: { tier17: false, scary: 94 },
	},
	{
		id: 755773474,
		regex: 'o ig',
		rawText: 'Monsters have a 20% chance to Ignite, Freeze and Shock on Hit',
		generalizedText: '^monsters have a #% chance to ignite, freeze and shock on hit$',
		options: { tier17: false, scary: 98 },
	},
	{
		id: 762130113,
		regex: 'ment$',
		rawText: 'Monsters gain (180-200)% of their Physical Damage as Extra Damage of a random Element',
		generalizedText: '^monsters gain #% of their physical damage as extra damage of a random element$',
		options: { tier17: true, scary: 1663 },
	},
	{
		id: 793356205,
		regex: 'f de',
		rawText: 'Area has patches of desecrated ground',
		generalizedText: '^area has patches of desecrated ground$',
		options: { tier17: false, scary: 310 },
	},
	{
		id: 856370140,
		regex: 'wni',
		rawText: 'Area contains Drowning Orbs',
		generalizedText: '^area contains drowning orbs$',
		options: { tier17: true, scary: 1224 },
	},
	{
		id: 884783454,
		regex: 'aim',
		rawText: 'Monsters Maim on Hit with Attacks',
		generalizedText: '^monsters maim on hit with attacks$',
		options: { tier17: false, scary: 50 },
	},
	{
		id: 894187505,
		regex: 'o al',
		rawText: 'Players have (-12--9)% to all maximum Resistances',
		generalizedText: '^players have -#% to all maximum resistances$',
		options: { tier17: false, scary: 980 },
	},
	{
		id: 920184875,
		regex: 'k at',
		rawText: 'Monsters have +50% Chance to Block Attack Damage',
		generalizedText: '^monsters have #% chance to block attack damage$',
		options: { tier17: true, scary: 1303 },
	},
	{
		id: 927184680,
		regex: 'iers$',
		rawText: '(35-45)% increased number of Rare Monsters|Rare Monsters each have 2 additional Modifiers',
		generalizedText: '^#% increased number of rare monsters$|^rare monsters each have # additional modifiers$',
		options: { tier17: true, scary: 1231 },
	},
	{
		id: 931213255,
		regex: 'oa',
		rawText: 'Area is inhabited by Goatmen',
		generalizedText: '^area is inhabited by goatmen$',
		options: { tier17: false, scary: 4 },
	},
	{
		id: 1006692915,
		regex: 'ered',
		rawText:
			'Monsters gain (31-35)% of their Physical Damage as Extra Chaos Damage|Monsters Inflict Withered for 2 seconds on Hit',
		generalizedText:
			'^monsters gain #% of their physical damage as extra chaos damage$|^monsters inflict withered for # seconds on hit$',
		options: { tier17: false, scary: 455 },
	},
	{
		id: 1088280684,
		regex: 'e charge o',
		rawText: 'Monsters gain an Endurance Charge on Hit',
		generalizedText: '^monsters gain an endurance charge on hit$',
		options: { tier17: false, scary: 80 },
	},
	{
		id: 1141186022,
		regex: 'son$',
		rawText: "Monsters Poison on Hit|All Damage from Monsters' Hits can Poison|Monsters have 100% increased Poison Duration",
		generalizedText:
			"^monsters poison on hit$|^all damage from monsters' hits can poison$|^monsters have #% increased poison duration$",
		options: { tier17: true, scary: 1605 },
	},
	{
		id: 1177412437,
		regex: 'fif',
		rawText:
			"Monsters' Attacks Impale on Hit When a fifth Impale is inflicted on a Player, Impales are removed to Reflect their Physical Damage multiplied by their remaining Hits to that Player and their Allies within 1.8 metres",
		generalizedText:
			"^monsters' attacks impale on hit when a fifth impale is inflicted on a player, impales are removed to reflect their physical damage multiplied by their remaining hits to that player and their allies within #.# metres$",
		options: { tier17: true, scary: 1200 },
	},
	{
		id: 1197254574,
		regex: 'kn',
		rawText: 'Players are Cursed with Elemental Weakness',
		generalizedText: '^players are cursed with elemental weakness$',
		options: { tier17: false, scary: 360 },
	},
	{
		id: 1204424670,
		regex: 'mmo',
		rawText: "15% of Damage Players' Totems take from Hits is taken from their Summoner's Life instead",
		generalizedText: "^#% of damage players' totems take from hits is taken from their summoner's life instead$",
		options: { tier17: true, scary: 1236 },
	},
	{
		id: 1245770343,
		regex: 'lun',
		rawText: 'Area is inhabited by Lunaris fanatics',
		generalizedText: '^area is inhabited by lunaris fanatics$',
		options: { tier17: false, scary: 4 },
	},
	{
		id: 1261702218,
		regex: 'mpo',
		rawText: 'Players are Cursed with Temporal Chains',
		generalizedText: '^players are cursed with temporal chains$',
		options: { tier17: false, scary: 360 },
	},
	{
		id: 1270766659,
		regex: '^buf',
		rawText: 'Buffs on Players expire 100% faster',
		generalizedText: '^buffs on players expire #% faster$',
		options: { tier17: true, scary: 1315 },
	},
	{
		id: 1275003885,
		regex: 'r el',
		rawText: '+25% Monster Chaos Resistance|+40% Monster Elemental Resistances',
		generalizedText: '^#% monster chaos resistance$|^#% monster elemental resistances$',
		options: { tier17: false, scary: 100 },
	},
	{
		id: 1303025587,
		regex: 'lm',
		rawText: 'Monsters have 70% chance to Avoid Elemental Ailments',
		generalizedText: '^monsters have #% chance to avoid elemental ailments$',
		options: { tier17: false, scary: 150 },
	},
	{
		id: 1320742524,
		regex: 'emons',
		rawText: 'Area is inhabited by Demons',
		generalizedText: '^area is inhabited by demons$',
		options: { tier17: false, scary: 4 },
	},
	{
		id: 1349832036,
		regex: 'yn',
		rawText: 'Map Boss is accompanied by a Synthesis Boss',
		generalizedText: '^map boss is accompanied by a synthesis boss$',
		options: { tier17: true, scary: 1217 },
	},
	{
		id: 1409464152,
		regex: 'osts',
		rawText: 'Area is inhabited by Ghosts',
		generalizedText: '^area is inhabited by ghosts$',
		options: { tier17: false, scary: 4 },
	},
	{
		id: 1424932226,
		regex: 'tiles$',
		rawText: 'Monsters fire 2 additional Projectiles',
		generalizedText: '^monsters fire # additional projectiles$',
		options: { tier17: false, scary: 440 },
	},
	{
		id: 1434328288,
		regex: 'e \\d+% increased ar',
		rawText: 'Monsters have 100% increased Area of Effect',
		generalizedText: '^monsters have #% increased area of effect$',
		options: { tier17: false, scary: 400 },
	},
	{
		id: 1449891900,
		regex: 'hex',
		rawText: 'Monsters are Hexproof',
		generalizedText: '^monsters are hexproof$',
		options: { tier17: false, scary: 150 },
	},
	{
		id: 1471007742,
		regex: 'rang',
		rawText: 'Area is inhabited by ranged monsters',
		generalizedText: '^area is inhabited by ranged monsters$',
		options: { tier17: false, scary: 4 },
	},
	{
		id: 1481746664,
		regex: 'two',
		rawText: 'Area contains two Unique Bosses',
		generalizedText: '^area contains two unique bosses$',
		options: { tier17: false, scary: 90 },
	},
	{
		id: 1514873663,
		regex: 'non',
		rawText: 'Players have 60% reduced effect of Non-Curse Auras from Skills',
		generalizedText: '^players have #% reduced effect of non-curse auras from skills$',
		options: { tier17: false, scary: 990 },
	},
	{
		id: 1515846394,
		regex: 'urn',
		rawText: 'Area has patches of Burning Ground',
		generalizedText: '^area has patches of burning ground$',
		options: { tier17: false, scary: 310 },
	},
	{
		id: 1523693331,
		regex: 'ss are',
		rawText: 'Players have (25-30)% less Area of Effect',
		generalizedText: '^players have #% less area of effect$',
		options: { tier17: true, scary: 1252 },
	},
	{
		id: 1537433645,
		regex: 'lier',
		rawText: 'Monsters have (650-700)% increased Critical Strike Chance|+(70-75)% to Monster Critical Strike Multiplier',
		generalizedText: '^monsters have #% increased critical strike chance$|^+#% to monster critical strike multiplier$',
		options: { tier17: true, scary: 1710 },
	},
	{
		id: 1546387363,
		regex: 'tn',
		rawText: 'Monsters deal (90-110)% extra Physical Damage as Lightning',
		generalizedText: '^monsters deal #% extra physical damage as lightning$',
		options: { tier17: false, scary: 450 },
	},
	{
		id: 1594594160,
		regex: 'ever',
		rawText: 'Players and their Minions deal no damage for 3 out of every 10 seconds',
		generalizedText: '^players and their minions deal no damage for # out of every # seconds$',
		options: { tier17: true, scary: 1197 },
	},
	{
		id: 1652154666,
		regex: 'o su',
		rawText: 'Monsters have +60% chance to Suppress Spell Damage',
		generalizedText: '^monsters have #% chance to suppress spell damage$',
		options: { tier17: false, scary: 290 },
	},
	{
		id: 1653061490,
		regex: 'ff$',
		rawText: 'Unique Monsters have a random Shrine Buff',
		generalizedText: '^unique monsters have a random shrine buff$',
		options: { tier17: true, scary: 1277 },
	},
	{
		id: 1687576035,
		regex: 'son o',
		rawText: 'Monsters Poison on Hit',
		generalizedText: '^monsters poison on hit$',
		options: { tier17: false, scary: 390 },
	},
	{
		id: 1691639998,
		regex: 'd li',
		rawText: 'Unique Boss has 35% increased Life|Unique Boss has 70% increased Area of Effect',
		generalizedText: '^unique boss has #% increased life$|^unique boss has #% increased area of effect$',
		options: { tier17: false, scary: 400 },
	},
	{
		id: 1734526203,
		regex: 'f ph',
		rawText: 'Monsters reflect 18% of Physical Damage',
		generalizedText: '^monsters reflect #% of physical damage$',
		options: { tier17: false, scary: 1000 },
	},
	{
		id: 1741763812,
		regex: 'ocke',
		rawText: 'Area has patches of Shocked Ground which increase Damage taken by 50%',
		generalizedText: '^area has patches of shocked ground which increase damage taken by #%$',
		options: { tier17: false, scary: 310 },
	},
	{
		id: 1769059225,
		regex: 'm end',
		rawText: 'Monsters have +1 to Maximum Endurance Charges|Monsters gain an Endurance Charge when hit',
		generalizedText: '^monsters have # to maximum endurance charges$|^monsters gain an endurance charge when hit$',
		options: { tier17: true, scary: 1209 },
	},
	{
		id: 1809097991,
		regex: 'xpo',
		rawText: 'Players cannot inflict Exposure',
		generalizedText: '^players cannot inflict exposure$',
		options: { tier17: false, scary: 150 },
	},
	{
		id: 1815471633,
		regex: 'ndea',
		rawText: 'Area is inhabited by Undead',
		generalizedText: '^area is inhabited by undead$',
		options: { tier17: false, scary: 4 },
	},
	{
		id: 1822260921,
		regex: 'on,',
		rawText: 'Monsters have a 50% chance to avoid Poison, Impale, and Bleeding',
		generalizedText: '^monsters have a #% chance to avoid poison, impale, and bleeding$',
		options: { tier17: false, scary: 390 },
	},
	{
		id: 1855646823,
		regex: 'nu',
		rawText: '(20-30)% increased number of Rare Monsters',
		generalizedText: '^#% increased number of rare monsters$',
		options: { tier17: false, scary: 1 },
	},
	{
		id: 1909893191,
		regex: 'd fl',
		rawText: 'Players gain 50% reduced Flask Charges',
		generalizedText: '^players gain #% reduced flask charges$',
		options: { tier17: false, scary: 210 },
	},
	{
		id: 1916229172,
		regex: 'pin',
		rawText: 'Monsters inflict 2 Grasping Vines on Hit',
		generalizedText: '^monsters inflict # grasping vines on hit$',
		options: { tier17: true, scary: 1203 },
	},
	{
		id: 1936863142,
		regex: 'ss are',
		rawText: 'Players have 25% less Area of Effect',
		generalizedText: '^players have #% less area of effect$',
		options: { tier17: false, scary: 60 },
	},
	{
		id: 1965894066,
		regex: 'ske',
		rawText: 'Area is inhabited by Skeletons',
		generalizedText: '^area is inhabited by skeletons$',
		options: { tier17: false, scary: 4 },
	},
	{
		id: 2023345436,
		regex: 'itc',
		rawText: 'Area is inhabited by Sea Witches and their Spawn',
		generalizedText: '^area is inhabited by sea witches and their spawn$',
		options: { tier17: false, scary: 4 },
	},
	{
		id: 2042799595,
		regex: 'ety',
		rawText: 'Area has increased monster variety',
		generalizedText: '^area has increased monster variety$',
		options: { tier17: false, scary: 8 },
	},
	{
		id: 2043204851,
		regex: 'd at',
		rawText: 'Unique Boss deals 25% increased Damage|Unique Boss has 30% increased Attack and Cast Speed',
		generalizedText: '^unique boss deals #% increased damage$|^unique boss has #% increased attack and cast speed$',
		options: { tier17: false, scary: 420 },
	},
	{
		id: 2075940345,
		regex: 'wb',
		rawText: 'Players are assaulted by Bloodstained Sawblades',
		generalizedText: '^players are assaulted by bloodstained sawblades$',
		options: { tier17: true, scary: 1194 },
	},
	{
		id: 2128933960,
		regex: "' mi",
		rawText:
			"Players' Minions have 50% less Attack Speed|Players' Minions have 50% less Cast Speed|Players' Minions have 50% less Movement Speed",
		generalizedText:
			"^players' minions have #% less attack speed$|^players' minions have #% less cast speed$|^players' minions have #% less movement speed$",
		options: { tier17: true, scary: 1607 },
	},
]
