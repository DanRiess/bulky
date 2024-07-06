## Checklist when you want to add a new category

-   Add the category to the CATEGORY constant
-   Create the category's folder with the const, type, and transformer scripts
-   Add the new types to bulky.types (BazaarItem, ShopItem and FilterField)
-   Add new item to the CategoryMolecule component
-   Add the stores to the category's folder
-   Add the store types to the type file and bulky.types
-   Update functions in factory.ts
-   Update functions in category.ts
-   Add item in category and imgCategory components
-   Update the category conversion function in usePoeNinja.ts
-   Update the add and remove filter field functions in useComputedFilterStore.ts
-   Add mock APIs to nodeApi and poeApi for browser testing
