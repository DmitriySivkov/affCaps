<template>
	{{ parseInt(row.total_country_cap) + parseInt(row.total_country_reserved) }}
</template>

<script>
export default {
	props: {
		row: Object,
		col: Object
	},
}
</script>
