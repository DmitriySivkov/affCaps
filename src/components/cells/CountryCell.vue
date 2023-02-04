<template>
	{{ row.country.iso + " - " + row.country.en_name }}
</template>

<script>
export default {
	props: {
		row: Object,
		col: Object
	},
}
</script>
