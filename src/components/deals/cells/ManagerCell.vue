<template>
	{{ row.manager ? "#" + row.manager.id + " " + row.manager.fullname : "" }}
</template>

<script>
export default {
	props: {
		row: Object,
		col: Object
	},
}
</script>
