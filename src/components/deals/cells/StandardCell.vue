<template>
	{{ row[col.name] }}
</template>

<script>
export default {
	props: {
		row: Object,
		col: Object
	},
}
</script>
