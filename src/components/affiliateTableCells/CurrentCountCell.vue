<template>
	{{ row[col.name] ?? 0 }}
</template>

<script>
export default {
	props: {
		row: Object,
		col: Object
	},
}
</script>
