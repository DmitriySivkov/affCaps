<template>
	<a :href="backend_url + '/admin/providers/' + row.provider.id + '/edit/'">
		{{ "#" + row.provider.id + " - " + row.provider.name }}
	</a>
</template>

<script>
export default {
	props: {
		row: Object,
		col: Object
	},
	setup() {
		const backend_url = process.env.BACKEND_SERVER
		return {
			backend_url
		}
	}
}
</script>
