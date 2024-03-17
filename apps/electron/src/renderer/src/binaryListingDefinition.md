# Bulky binary listing definition

A listing has the same structure regardless of category. For example a compass listing:

```json
{
	"uuid": "8f10b61e-bf10-1051-a001-7ae3186fe621",
	"ign": "CharacterName",
	"account": "PoeAccountName",
	"league": "Affliction",
	"category": "Compass",
	"created": 1654932784,
	"expireAt": 1654934567, // created + 15 minutes
	"chaosPerDiv": 110,
	"multiplier": 1.3,
	"minimumBuyout": 1100,
	"items": [
		{
			"type": "abyss",
			"tier": 1,
			"quantity": 219,
			"price": 130
		},
		{
			"type": "beyond",
			"tier": 1,
			"quantity": 45,
			"price": 250
		}
	]
}
```

The items property, like the rest of the listing, follows a standard structure. This means, that we can represent it as binary.

"Name": 1 byte, mapped to the name in the category's .const.ts file. (e. g. SEXTANT_MODIFIER_IDX_TO_NAME[18])
"Tier": 1 byte, mapped to the tier in the category's .const.ts file.
"Quantity": 2 bytes, coded as UInt16.
"Price": 2 bytes, coded as UInt16.

We can reduce the size of one item to a constant 6 bytes, as opposed to the about 60 bytes in json notation.
The length of the listing excluding items is about 300 bytes large, depending mostly on the names.
The byte order will be little endian.

## Full item binary definition

| Name/Function  | Bytes used | Byte sequence        | Explanation                                     |
| -------------- | ---------- | -------------------- | ----------------------------------------------- |
| IDENTIFIER     | 4          | 66 67 70 32 ("BCF ") | Bulky Compression Format                        |
| VERSION        | 1          |                      | Version of the file compression                 |
| ITEMLENGTH     | 2          |                      | Number of items in the array                    |
| DATAIDENTIFIER | 4          | 68 65 84 65 ("DATA") | Identifier to specify that the items follow now |
| ITEM: Type     | 1          |                      | see above                                       |
| ITEM: Tier     | 1          |                      | see above                                       |
| ITEM: Quant    | 2          |                      | see above                                       |
| ITEM: Price    | 2          |                      | see above                                       |
| ITEMBREAK      | 2          | 66 82 ("BR")         | a fixed sequence between 2 items                |
| Repeat Item    | 8          |                      | full item plus break sequence                   |

This will result in a constant overhead of 11 bytes + 2 bytes per item.

Each item plus the break sequence will be 8 bytes long. However, data has to be transmitted as base64.
// TODO: figure out if data is stored as b64 or not.

With an average 350 bytes per listing excluding the items, this schema should provide space for 75+ listing items before hitting the 1kb threshold, which should be good enough for most listings.
