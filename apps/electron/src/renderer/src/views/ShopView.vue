<template>
	<SingleColumnLayout>
		<header class="header">
			<h1 class="no-select">My Shop</h1>
		</header>
		<ShopOfferCollectionOrganism />
		<ShopOfferCreateButtonMolecule />
	</SingleColumnLayout>
</template>

<script setup lang="ts">
import SingleColumnLayout from '@web/components/layouts/SingleColumnLayout.vue'
import ShopOfferCreateButtonMolecule from '@web/components/molecules/ShopOfferCreateButtonMolecule.vue'
import ShopOfferCollectionOrganism from '@web/components/organisms/ShopOfferCollectionOrganism.vue'
</script>

<style scoped>
.header {
	height: 2rem;
	text-align: center;
}
</style>
