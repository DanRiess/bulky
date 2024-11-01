## Checklist when you want to add a new category

-   Add the category to the CATEGORY constant in shared/bulky.types
-   Create the category's folder with the const, type, and transformer scripts
-   Add the new types to bulky.types (BazaarItem, ShopItem and FilterField)
-   Add new item to the CategoryMolecule and ImgCategoryAtom components
-   Add the stores to the category's folder
-   Add the store types to the type file and bulky.types
-   Update functions in factory.ts
-   Update functions in category.ts
-   Update function in uuid.ts
-   Update the category conversion function in usePoeNinja.ts (function bulkyToNinjaCategory)
-   Update the add and remove filter field functions in useComputedFilterStore.ts
-   Update the calculateBaseItemPrice function in useComputedOffersStore.ts
-   Add mock APIs to nodeApi and poeApi for browser testing
-   Generate an offer, create a new file (mocks/offersCategory.json) and copy it in there.
-   Update the getTestData function in the offer store and call it in BazaarView.vue

Next steps
create expedition offer page, separate by currencies and logbooks
logbooks need a list entry for each tier (e.g. ilvl_73-77) with pricing options for each faction
when listing, choose the highest priced faction and recast the logbook to that type

same has still to be done for heist things. rogue markers have to be added as well

fix stashlistitems with peritemattributes when deselecting/selecting a stash tab
