<template>
	{{ row.split ? row.split.name : "" }}
</template>

<script>
export default {
	props: {
		row: Object,
		col: Object
	},
}
</script>
