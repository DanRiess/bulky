# Main application categories

Bazaar: To buy things. Contains offers of other players.
Shop: To sell things. Contains your offers.
Auth: For signing in.
Settings: obvious.

## 2nd level categories

These are the organisms that make a main category.

Offer: An offer contains one or more collections of Bulky items with prices with additional metadata, like ign, minBuyout, full or partial buyout, etc.

### 3rd level categories

BulkyItem: An abstraction of a collection of PoE items. This is best illustrated by an example. Imagine a stash tab with a couple of stacks of Deafening Essences of Dread. They have all of their normal PoE item properties, each stack has a unique id. A bulky item equivalent would only have the type (Essence), the name (Dread) and the tier (Deafening), the total quantity and a price. Any listable item should be able to be abstracted into a Bulky item to provide consistency.

#### 4th level categories

PoeItem: A modified item from a stash tab. Compared to its ancestor, it has far fewer properties. It also has additional properties that were not present before. This is what is saved into the local idb.

StashTab: A modified item from a stash tab list request. Compared to its ancestor, it has fewer categories. This is what is saved into the local idb.

##### Base categories

PoeItemDto: A PoE item that was taken from a stash tab. It has all properties supplied by the PoE API. The lifetime of this is very short, as it will immediately be transformed into a PoE item.

StashTabDto: A stash tab taken directly from the corresponding request. Be aware that a stash tab list request does not contain the stashes' items. The lifetime of this is very short, as it will be either immediately transformed to a StashTab (list request) or discarded (singular stash request, we only care about items here).
