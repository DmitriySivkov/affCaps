<template>
	<span v-if="row.total_country_cap">
		{{ row.total_country_cap }}
	</span>
	<q-inner-loading
		v-else
		:showing="!row.total_country_cap"
	>
		<q-spinner
			color="primary"
			size="2em"
		/>
	</q-inner-loading>
</template>

<script>
export default {
	props: {
		row: Object,
		col: Object
	},
}
</script>
