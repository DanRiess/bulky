const staticList = [
	{
		id: 'reliquary-scarab',
		text: 'Reliquary Scarab',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJVbmlxdWUiLCJzY2FsZSI6MX1d/9ed658ddba/LesserScarabUnique.png',
	},
	{
		id: 'reliquary-scarab-of-overlords',
		text: 'Reliquary Scarab of Overlords',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJVbmlxdWUiLCJzY2FsZSI6MX1d/e2945f5878/NormalScarabUnique.png',
	},
	{
		id: 'reliquary-scarab-of-vision',
		text: 'Reliquary Scarab of Vision',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiVW5pcXVlIiwic2NhbGUiOjF9XQ/0194f878a0/GreaterScarabUnique.png',
	},
	{
		id: 'sulphite-scarab',
		text: 'Sulphite Scarab',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJTdWxwaGl0ZSIsInNjYWxlIjoxfV0/9bdde2cec0/LesserScarabSulphite.png',
	},
	{
		id: 'sulphite-scarab-of-greed',
		text: 'Sulphite Scarab of Greed',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJTdWxwaGl0ZSIsInNjYWxlIjoxfV0/8121093ec0/NormalScarabSulphite.png',
	},
	{
		id: 'sulphite-scarab-of-fumes',
		text: 'Sulphite Scarab of Fumes',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiU3VscGhpdGUiLCJzY2FsZSI6MX1d/55c0fed4b6/GreaterScarabSulphite.png',
	},
	{
		id: 'divination-scarab',
		text: 'Divination Scarab',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJEaXZpbmF0aW9uIiwic2NhbGUiOjF9XQ/20ff060a8d/LesserScarabDivination.png',
	},
	{
		id: 'divination-scarab-of-curation',
		text: 'Divination Scarab of Curation',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiRGl2aW5hdGlvbiIsInNjYWxlIjoxfV0/73ab11f6bd/GreaterScarabDivination.png',
	},
	{
		id: 'divination-scarab-of-completion',
		text: 'Divination Scarab of Completion',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYkRpdmluYXRpb24iLCJzY2FsZSI6MX1d/4e3adfaafb/Tier4ScarabDivination.png',
	},
	{
		id: 'torment-scarab',
		text: 'Torment Scarab',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJUb3JtZW50Iiwic2NhbGUiOjF9XQ/8c43bf8c64/LesserScarabTorment.png',
	},
	{
		id: 'torment-scarab-of-peculiarity',
		text: 'Torment Scarab of Peculiarity',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJUb3JtZW50Iiwic2NhbGUiOjF9XQ/4c94a84fd8/NormalScarabTorment.png',
	},
	{
		id: 'torment-scarab-of-release',
		text: 'Torment Scarab of Release',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiVG9ybWVudCIsInNjYWxlIjoxfV0/548c57abc3/GreaterScarabTorment.png',
	},
	{
		id: 'torment-scarab-of-possession',
		text: 'Torment Scarab of Possession',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYlRvcm1lbnQiLCJzY2FsZSI6MX1d/5b3bed9d3d/Tier4ScarabTorment.png',
	},
	{
		id: 'anarchy-scarab',
		text: 'Anarchy Scarab',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJBbmFyY2h5Iiwic2NhbGUiOjF9XQ/73d1ee9b23/LesserScarabAnarchy.png',
	},
	{
		id: 'anarchy-scarab-of-gigantification',
		text: 'Anarchy Scarab of Gigantification',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJBbmFyY2h5Iiwic2NhbGUiOjF9XQ/d391e90e68/NormalScarabAnarchy.png',
	},
	{
		id: 'anarchy-scarab-of-partnership',
		text: 'Anarchy Scarab of Partnership',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiQW5hcmNoeSIsInNjYWxlIjoxfV0/4697e57871/GreaterScarabAnarchy.png',
	},
	{
		id: 'ritual-scarab-of-selectiveness',
		text: 'Ritual Scarab of Selectiveness',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJSaXR1YWwiLCJzY2FsZSI6MX1d/08f82dab28/LesserScarabRitual.png',
	},
	{
		id: 'ritual-scarab-of-recognition',
		text: 'Ritual Scarab of Recognition',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJSaXR1YWwiLCJzY2FsZSI6MX1d/f2c3231213/NormalScarabRitual.png',
	},
	{
		id: 'ritual-scarab-of-abundance',
		text: 'Ritual Scarab of Abundance',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiUml0dWFsIiwic2NhbGUiOjF9XQ/a990c91de5/GreaterScarabRitual.png',
	},
	{
		id: 'harvest-scarab',
		text: 'Harvest Scarab',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJIYXJ2ZXN0Iiwic2NhbGUiOjF9XQ/976dcf6526/LesserScarabHarvest.png',
	},
	{
		id: 'harvest-scarab-of-doubling',
		text: 'Harvest Scarab of Doubling',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiSGFydmVzdCIsInNjYWxlIjoxfV0/6077972903/GreaterScarabHarvest.png',
	},
	{
		id: 'harvest-scarab-of-cornucopia',
		text: 'Harvest Scarab of Cornucopia',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYkhhcnZlc3QiLCJzY2FsZSI6MX1d/35e8847de2/Tier4ScarabHarvest.png',
	},
	{
		id: 'bestiary-scarab',
		text: 'Bestiary Scarab',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJCZWFzdHMiLCJzY2FsZSI6MX1d/a13711c8ed/LesserScarabBeasts.png',
	},
	{
		id: 'bestiary-scarab-of-the-herd',
		text: 'Bestiary Scarab of the Herd',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJCZWFzdHMiLCJzY2FsZSI6MX1d/0d5c9d2d30/NormalScarabBeasts.png',
	},
	{
		id: 'bestiary-scarab-of-duplicating',
		text: 'Bestiary Scarab of Duplicating',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiQmVhc3RzIiwic2NhbGUiOjF9XQ/09caa391c6/GreaterScarabBeasts.png',
	},
	{
		id: 'bestiary-scarab-of-the-shadowed-crow',
		text: 'Bestiary Scarab of the Shadowed Crow',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYkJlYXN0cyIsInNjYWxlIjoxfV0/c8a03d1108/Tier4ScarabBeasts.png',
	},
	{
		id: 'influencing-scarab-of-the-shaper',
		text: 'Influencing Scarab of the Shaper',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJTaGFwZXIiLCJzY2FsZSI6MX1d/caf0ac9307/LesserScarabShaper.png',
	},
	{
		id: 'influencing-scarab-of-the-elder',
		text: 'Influencing Scarab of the Elder',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJFbGRlciIsInNjYWxlIjoxfV0/8828d3f4eb/LesserScarabElder.png',
	},
	{
		id: 'influencing-scarab-of-hordes',
		text: 'Influencing Scarab of Hordes',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiRWxkZXIiLCJzY2FsZSI6MX1d/660528eb40/GreaterScarabElder.png',
	},
	{
		id: 'influencing-scarab-of-conversion',
		text: 'Influencing Scarab of Conversion',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYlNoYXBlciIsInNjYWxlIjoxfV0/320c05daeb/Tier4ScarabShaper.png',
	},
	{
		id: 'harbinger-scarab',
		text: 'Harbinger Scarab',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJIYXJiaW5nZXJzIiwic2NhbGUiOjF9XQ/cc33d9f639/LesserScarabHarbingers.png',
	},
	{
		id: 'harbinger-scarab-of-discernment',
		text: 'Harbinger Scarab of Discernment',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJIYXJiaW5nZXJzIiwic2NhbGUiOjF9XQ/dc5f44e261/NormalScarabHarbingers.png',
	},
	{
		id: 'harbinger-scarab-of-regency',
		text: 'Harbinger Scarab of Regency',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiSGFyYmluZ2VycyIsInNjYWxlIjoxfV0/335df4321f/GreaterScarabHarbingers.png',
	},
	{
		id: 'harbinger-scarab-of-warhoards',
		text: 'Harbinger Scarab of Warhoards',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYkhhcmJpbmdlcnMiLCJzY2FsZSI6MX1d/58a4c0d3f8/Tier4ScarabHarbingers.png',
	},
	{
		id: 'abyss-scarab',
		text: 'Abyss Scarab',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJBYnlzcyIsInNjYWxlIjoxfV0/05f3ac3c5c/LesserScarabAbyss.png',
	},
	{
		id: 'abyss-scarab-of-multitudes',
		text: 'Abyss Scarab of Multitudes',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJBYnlzcyIsInNjYWxlIjoxfV0/e28a53e1a0/NormalScarabAbyss.png',
	},
	{
		id: 'abyss-scarab-of-emptiness',
		text: 'Abyss Scarab of Emptiness',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9BbHROb3JtYWxTY2FyYWJBYnlzcyIsInNjYWxlIjoxfV0/1dbd071787/AltNormalScarabAbyss.png',
	},
	{
		id: 'abyss-scarab-of-edifice',
		text: 'Abyss Scarab of Edifice',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiQWJ5c3MiLCJzY2FsZSI6MX1d/84851bd122/GreaterScarabAbyss.png',
	},
	{
		id: 'abyss-scarab-of-profound-depth',
		text: 'Abyss Scarab of Profound Depth',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9BbHRUaWVyNFNjYXJhYkFieXNzIiwic2NhbGUiOjF9XQ/b40fb2422b/AltTier4ScarabAbyss.png',
	},
	{
		id: 'essence-scarab',
		text: 'Essence Scarab',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJFc3NlbmNlIiwic2NhbGUiOjF9XQ/4c99af0610/LesserScarabEssence.png',
	},
	{
		id: 'essence-scarab-of-ascent',
		text: 'Essence Scarab of Ascent',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJFc3NlbmNlIiwic2NhbGUiOjF9XQ/3a091b8052/NormalScarabEssence.png',
	},
	{
		id: 'essence-scarab-of-stability',
		text: 'Essence Scarab of Stability',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiRXNzZW5jZSIsInNjYWxlIjoxfV0/28e74041a5/GreaterScarabEssence.png',
	},
	{
		id: 'essence-scarab-of-calcification',
		text: 'Essence Scarab of Calcification',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYkVzc2VuY2UiLCJzY2FsZSI6MX1d/d7e7534a07/Tier4ScarabEssence.png',
	},
	{
		id: 'essence-scarab-of-adaptation',
		text: 'Essence Scarab of Adaptation',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9BbHRUaWVyNFNjYXJhYkVzc2VuY2UiLCJzY2FsZSI6MX1d/56560d691e/AltTier4ScarabEssence.png',
	},
	{
		id: 'domination-scarab',
		text: 'Domination Scarab',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJEb21pbmF0aW9uIiwic2NhbGUiOjF9XQ/76cedf832c/LesserScarabDomination.png',
	},
	{
		id: 'domination-scarab-of-abnormality',
		text: 'Domination Scarab of Abnormality',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJEb21pbmF0aW9uIiwic2NhbGUiOjF9XQ/c907d44dec/NormalScarabDomination.png',
	},
	{
		id: 'domination-scarab-of-teachings',
		text: 'Domination Scarab of Teachings',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiRG9taW5hdGlvbiIsInNjYWxlIjoxfV0/8913234164/GreaterScarabDomination.png',
	},
	{
		id: 'domination-scarab-of-terrors',
		text: 'Domination Scarab of Terrors',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYkRvbWluYXRpb24iLCJzY2FsZSI6MX1d/0d55e72414/Tier4ScarabDomination.png',
	},
	{
		id: 'incursion-scarab',
		text: 'Incursion Scarab',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJJbmN1cnNpb24iLCJzY2FsZSI6MX1d/4afd758a13/LesserScarabIncursion.png',
	},
	{
		id: 'incursion-scarab-of-invasion',
		text: 'Incursion Scarab of Invasion',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJJbmN1cnNpb24iLCJzY2FsZSI6MX1d/a38b517f35/NormalScarabIncursion.png',
	},
	{
		id: 'incursion-scarab-of-champions',
		text: 'Incursion Scarab of Champions',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiSW5jdXJzaW9uIiwic2NhbGUiOjF9XQ/ff92bda004/GreaterScarabIncursion.png',
	},
	{
		id: 'incursion-scarab-of-timelines',
		text: 'Incursion Scarab of Timelines',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYkluY3Vyc2lvbiIsInNjYWxlIjoxfV0/748b10e2cf/Tier4ScarabIncursion.png',
	},
	{
		id: 'betrayal-scarab',
		text: 'Betrayal Scarab',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJCZXRyYXlhbCIsInNjYWxlIjoxfV0/d53970be47/LesserScarabBetrayal.png',
	},
	{
		id: 'betrayal-scarab-of-intelligence',
		text: 'Betrayal Scarab of Intelligence',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJCZXRyYXlhbCIsInNjYWxlIjoxfV0/3e4a843098/NormalScarabBetrayal.png',
	},
	{
		id: 'betrayal-scarab-of-reinforcements',
		text: 'Betrayal Scarab of Reinforcements',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiQmV0cmF5YWwiLCJzY2FsZSI6MX1d/7dd831f857/GreaterScarabBetrayal.png',
	},
	{
		id: 'betrayal-scarab-of-perpetuation',
		text: 'Betrayal Scarab of Perpetuation',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYkJldHJheWFsIiwic2NhbGUiOjF9XQ/4290457e94/Tier4ScarabBetrayal.png',
	},
	{
		id: 'blight-scarab',
		text: 'Blight Scarab',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJCbGlnaHQiLCJzY2FsZSI6MX1d/401222e4f4/LesserScarabBlight.png',
	},
	{
		id: 'blight-scarab-of-bounty',
		text: 'Blight Scarab of Bounty',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJCbGlnaHQiLCJzY2FsZSI6MX1d/de78905e90/NormalScarabBlight.png',
	},
	{
		id: 'blight-scarab-of-oils',
		text: 'Blight Scarab of Oils',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiQmxpZ2h0Iiwic2NhbGUiOjF9XQ/d0aa6a6d55/GreaterScarabBlight.png',
	},
	{
		id: 'blight-scarab-of-blooming',
		text: 'Blight Scarab of Blooming',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYkJsaWdodCIsInNjYWxlIjoxfV0/7ecd3dcebc/Tier4ScarabBlight.png',
	},
	{
		id: 'blight-scarab-of-invigoration',
		text: 'Blight Scarab of Invigoration',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9BbHRUaWVyNFNjYXJhYkJsaWdodCIsInNjYWxlIjoxfV0/34e07da01c/AltTier4ScarabBlight.png',
	},
	{
		id: 'breach-scarab',
		text: 'Breach Scarab',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJCcmVhY2giLCJzY2FsZSI6MX1d/769139d13b/LesserScarabBreach.png',
	},
	{
		id: 'breach-scarab-of-the-dreamer',
		text: 'Breach Scarab of the Dreamer',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJCcmVhY2giLCJzY2FsZSI6MX1d/d8bc60711f/NormalScarabBreach.png',
	},
	{
		id: 'breach-scarab-of-lordship',
		text: 'Breach Scarab of Lordship',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiQnJlYWNoIiwic2NhbGUiOjF9XQ/b129897f73/GreaterScarabBreach.png',
	},
	{
		id: 'breach-scarab-of-splintering',
		text: 'Breach Scarab of Splintering',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9BbHRHcmVhdGVyU2NhcmFiQnJlYWNoIiwic2NhbGUiOjF9XQ/99f8bb0c06/AltGreaterScarabBreach.png',
	},
	{
		id: 'breach-scarab-of-snares',
		text: 'Breach Scarab of Snares',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYkJyZWFjaCIsInNjYWxlIjoxfV0/2e4da41035/Tier4ScarabBreach.png',
	},
	{
		id: 'breach-scarab-of-resonant-cascade',
		text: 'Breach Scarab of Resonant Cascade',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9BbHRUaWVyNFNjYXJhYkJyZWFjaCIsInNjYWxlIjoxfV0/d6fe5cdce6/AltTier4ScarabBreach.png',
	},
	{
		id: 'legion-scarab',
		text: 'Legion Scarab',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJMZWdpb24iLCJzY2FsZSI6MX1d/e7b6e5659c/LesserScarabLegion.png',
	},
	{
		id: 'legion-scarab-of-officers',
		text: 'Legion Scarab of Officers',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJMZWdpb24iLCJzY2FsZSI6MX1d/986b842d3f/NormalScarabLegion.png',
	},
	{
		id: 'legion-scarab-of-command',
		text: 'Legion Scarab of Command',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9BbHROb3JtYWxTY2FyYWJMZWdpb24iLCJzY2FsZSI6MX1d/5d88c1f891/AltNormalScarabLegion.png',
	},
	{
		id: 'legion-scarab-of-the-sekhema',
		text: 'Legion Scarab of The Sekhema',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiTGVnaW9uIiwic2NhbGUiOjF9XQ/d687801212/GreaterScarabLegion.png',
	},
	{
		id: 'legion-scarab-of-eternal-conflict',
		text: 'Legion Scarab of Eternal Conflict',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYkxlZ2lvbiIsInNjYWxlIjoxfV0/4a56211137/Tier4ScarabLegion.png',
	},
	{
		id: 'cartography-scarab',
		text: 'Cartography Scarab',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJNYXBzIiwic2NhbGUiOjF9XQ/e7d11bcc5b/LesserScarabMaps.png',
	},
	{
		id: 'cartography-scarab-of-ascension',
		text: 'Cartography Scarab of Ascension',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJNYXBzIiwic2NhbGUiOjF9XQ/b41df1ff07/NormalScarabMaps.png',
	},
	{
		id: 'cartography-scarab-of-singularity',
		text: 'Cartography Scarab of Singularity',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9BbHROb3JtYWxTY2FyYWJNYXBzIiwic2NhbGUiOjF9XQ/41c689bbef/AltNormalScarabMaps.png',
	},
	{
		id: 'cartography-scarab-of-corruption',
		text: 'Cartography Scarab of Corruption',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiTWFwcyIsInNjYWxlIjoxfV0/7c589dbe02/GreaterScarabMaps.png',
	},
	{
		id: 'cartography-scarab-of-duplication',
		text: 'Cartography Scarab of Duplication',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYk1hcHMiLCJzY2FsZSI6MX1d/2207df61a5/Tier4ScarabMaps.png',
	},
	{
		id: 'beyond-scarab',
		text: 'Beyond Scarab',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJCZXlvbmQiLCJzY2FsZSI6MX1d/28f0c03cf7/LesserScarabBeyond.png',
	},
	{
		id: 'beyond-scarab-of-haemophilia',
		text: 'Beyond Scarab of Haemophilia',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJCZXlvbmQiLCJzY2FsZSI6MX1d/6d3487e108/NormalScarabBeyond.png',
	},
	{
		id: 'beyond-scarab-of-corruption',
		text: 'Beyond Scarab of Corruption',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiQmV5b25kIiwic2NhbGUiOjF9XQ/a7736e43ae/GreaterScarabBeyond.png',
	},
	{
		id: 'beyond-scarab-of-resurgence',
		text: 'Beyond Scarab of Resurgence',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9BbHRHcmVhdGVyU2NhcmFiQmV5b25kIiwic2NhbGUiOjF9XQ/4e3cafe44b/AltGreaterScarabBeyond.png',
	},
	{
		id: 'beyond-scarab-of-the-invasion',
		text: 'Beyond Scarab of the Invasion',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYkJleW9uZCIsInNjYWxlIjoxfV0/a1d0b3e27b/Tier4ScarabBeyond.png',
	},
	{
		id: 'ambush-scarab',
		text: 'Ambush Scarab',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJTdHJvbmdib3hlcyIsInNjYWxlIjoxfV0/137917584a/LesserScarabStrongboxes.png',
	},
	{
		id: 'ambush-scarab-of-hidden-compartments',
		text: 'Ambush Scarab of Hidden Compartments',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJTdHJvbmdib3hlcyIsInNjYWxlIjoxfV0/2654dacfee/NormalScarabStrongboxes.png',
	},
	{
		id: 'ambush-scarab-of-potency',
		text: 'Ambush Scarab of Potency',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiU3Ryb25nYm94ZXMiLCJzY2FsZSI6MX1d/c2cb4efc18/GreaterScarabStrongboxes.png',
	},
	{
		id: 'ambush-scarab-of-containment',
		text: 'Ambush Scarab of Containment',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYlN0cm9uZ2JveGVzIiwic2NhbGUiOjF9XQ/da665a65ee/Tier4ScarabStrongboxes.png',
	},
	{
		id: 'ambush-scarab-of-discernment',
		text: 'Ambush Scarab of Discernment',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9BbHRUaWVyNFNjYXJhYlN0cm9uZ2JveGVzIiwic2NhbGUiOjF9XQ/72722370df/AltTier4ScarabStrongboxes.png',
	},
	{
		id: 'ultimatum-scarab',
		text: 'Ultimatum Scarab',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJVbHRpbWF0dW0iLCJzY2FsZSI6MX1d/b1b423625d/LesserScarabUltimatum.png',
	},
	{
		id: 'ultimatum-scarab-of-bribing',
		text: 'Ultimatum Scarab of Bribing',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJVbHRpbWF0dW0iLCJzY2FsZSI6MX1d/d688264f91/NormalScarabUltimatum.png',
	},
	{
		id: 'ultimatum-scarab-of-dueling',
		text: 'Ultimatum Scarab of Dueling',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiVWx0aW1hdHVtIiwic2NhbGUiOjF9XQ/be3b513bfe/GreaterScarabUltimatum.png',
	},
	{
		id: 'ultimatum-scarab-of-catalysing',
		text: 'Ultimatum Scarab of Catalysing',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYlVsdGltYXR1bSIsInNjYWxlIjoxfV0/abfc80cf45/Tier4ScarabUltimatum.png',
	},
	{
		id: 'ultimatum-scarab-of-inscription',
		text: 'Ultimatum Scarab of Inscription',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9BbHRUaWVyNFNjYXJhYlVsdGltYXR1bSIsInNjYWxlIjoxfV0/080e60e969/AltTier4ScarabUltimatum.png',
	},
	{
		id: 'expedition-scarab',
		text: 'Expedition Scarab',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJFeHBlZGl0aW9uIiwic2NhbGUiOjF9XQ/fa49f53ac8/LesserScarabExpedition.png',
	},
	{
		id: 'expedition-scarab-of-runefinding',
		text: 'Expedition Scarab of Runefinding',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJFeHBlZGl0aW9uIiwic2NhbGUiOjF9XQ/a751f91a8e/NormalScarabExpedition.png',
	},
	{
		id: 'expedition-scarab-of-verisium-powder',
		text: 'Expedition Scarab of Verisium Powder',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiRXhwZWRpdGlvbiIsInNjYWxlIjoxfV0/1bf78dd20a/GreaterScarabExpedition.png',
	},
	{
		id: 'expedition-scarab-of-the-skald',
		text: 'Expedition Scarab of the Skald',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9BbHRHcmVhdGVyU2NhcmFiRXhwZWRpdGlvbiIsInNjYWxlIjoxfV0/cbeb3c974b/AltGreaterScarabExpedition.png',
	},
	{
		id: 'expedition-scarab-of-archaeology',
		text: 'Expedition Scarab of Archaeology',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYkV4cGVkaXRpb24iLCJzY2FsZSI6MX1d/6bd03eec75/Tier4ScarabExpedition.png',
	},
	{
		id: 'delirium-scarab',
		text: 'Delirium Scarab',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJEZWxpcml1bSIsInNjYWxlIjoxfV0/0b8b887e88/LesserScarabDelirium.png',
	},
	{
		id: 'delirium-scarab-of-mania',
		text: 'Delirium Scarab of Mania',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJEZWxpcml1bSIsInNjYWxlIjoxfV0/9de6ce65c5/NormalScarabDelirium.png',
	},
	{
		id: 'delirium-scarab-of-paranoia',
		text: 'Delirium Scarab of Paranoia',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiRGVsaXJpdW0iLCJzY2FsZSI6MX1d/e6730494ae/GreaterScarabDelirium.png',
	},
	{
		id: 'delirium-scarab-of-neuroses',
		text: 'Delirium Scarab of Neuroses',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9BbHRHcmVhdGVyU2NhcmFiRGVsaXJpdW0iLCJzY2FsZSI6MX1d/5690762715/AltGreaterScarabDelirium.png',
	},
	{
		id: 'delirium-scarab-of-delusions',
		text: 'Delirium Scarab of Delusions',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYkRlbGlyaXVtIiwic2NhbGUiOjF9XQ/aa8241bb6c/Tier4ScarabDelirium.png',
	},
	{
		id: 'scarab-of-monstrous-lineage',
		text: 'Scarab of Monstrous Lineage',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9MZXNzZXJTY2FyYWJNaXNjIiwic2NhbGUiOjF9XQ/9196715e8d/LesserScarabMisc.png',
	},
	{
		id: 'scarab-of-adversaries',
		text: 'Scarab of Adversaries',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9BbHRMZXNzZXJTY2FyYWJNaXNjIiwic2NhbGUiOjF9XQ/ab24a34cd1/AltLesserScarabMisc.png',
	},
	{
		id: 'mysterious-scarab',
		text: 'Mysterious Scarab',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9Ob3JtYWxTY2FyYWJNaXNjIiwic2NhbGUiOjF9XQ/6d4755a692/NormalScarabMisc.png',
	},
	{
		id: 'scarab-of-hunted-traitors',
		text: 'Scarab of Hunted Traitors',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiTWlzYyIsInNjYWxlIjoxfV0/7a40f7ea9f/GreaterScarabMisc.png',
	},
	{
		id: 'scarab-of-stability',
		text: 'Scarab of Stability',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYk1pc2MiLCJzY2FsZSI6MX1d/c80f553284/Tier4ScarabMisc.png',
	},
	{
		id: 'scarab-of-wisps',
		text: 'Scarab of Wisps',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9HcmVhdGVyU2NhcmFiTWlzYzEiLCJzY2FsZSI6MX1d/303001a475/GreaterScarabMisc1.png',
	},
	{
		id: 'scarab-of-radiant-stroms',
		text: 'Scarab of Radiant Storms',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9UaWVyNFNjYXJhYk1pc2MyIiwic2NhbGUiOjF9XQ/d19b59b6b8/Tier4ScarabMisc2.png',
	},
	{
		id: 'horned-scarab-of-bloodlines',
		text: 'Horned Scarab of Bloodlines',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9TdXBlclNjYXJhYjEiLCJzY2FsZSI6MX1d/acc1b258a3/SuperScarab1.png',
	},
	{
		id: 'horned-scarab-of-nemeses',
		text: 'Horned Scarab of Nemeses',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9TdXBlclNjYXJhYjIiLCJzY2FsZSI6MX1d/c4f92c444d/SuperScarab2.png',
	},
	{
		id: 'horned-scarab-of-preservation',
		text: 'Horned Scarab of Preservation',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9TdXBlclNjYXJhYjMiLCJzY2FsZSI6MX1d/64d9f06e78/SuperScarab3.png',
	},
	{
		id: 'horned-scarab-of-awakening',
		text: 'Horned Scarab of Awakening',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9TdXBlclNjYXJhYjQiLCJzY2FsZSI6MX1d/c939905663/SuperScarab4.png',
	},
	{
		id: 'horned-scarab-of-tradition',
		text: 'Horned Scarab of Tradition',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9TdXBlclNjYXJhYjUiLCJzY2FsZSI6MX1d/cbdd57fa7e/SuperScarab5.png',
	},
	{
		id: 'horned-scarab-of-glittering',
		text: 'Horned Scarab of Glittering',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9TdXBlclNjYXJhYjYiLCJzY2FsZSI6MX1d/f74c2fdd4f/SuperScarab6.png',
	},
	{
		id: 'horned-scarab-of-pandemonium',
		text: 'Horned Scarab of Pandemonium',
		image: '/gen/image/WzI1LDE0LHsiZiI6IjJESXRlbXMvQ3VycmVuY3kvU2NhcmFicy9TdXBlclNjYXJhYjciLCJzY2FsZSI6MX1d/28b95bae7b/SuperScarab7.png',
	},
]

const names = staticList.map(el => el.text)

const uppercaseNames = names.map(name => name.replaceAll(' ', '_').toUpperCase())

// copy the output into the scarab.const.ts scarab_type
const scarabTypes = uppercaseNames.reduce((prev, curr) => {
	prev[curr] = curr
	return prev
}, {})
console.log(scarabTypes)

// copy the output into the scarab.static.ts name generator function
const staticNameToTypedConditionals = uppercaseNames
	.map((upp, idx) => {
		return `if (baseType === '${names[idx]}') return SCARAB_TYPE.${upp}`
	})
	.join('\n')
console.log(staticNameToTypedConditionals)
