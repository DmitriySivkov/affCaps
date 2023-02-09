<template>
	{{ row.country_iso + " - " + row.country_name }}
</template>

<script>
export default {
	props: {
		row: Object,
		col: Object
	},
}
</script>
