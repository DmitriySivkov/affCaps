<template>
	{{ row.provider.region.name }}
</template>

<script>
export default {
	props: {
		row: Object,
		col: Object
	},
}
</script>
