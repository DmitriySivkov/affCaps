<template>
	<a :href="backend_url + '/admin/providers/' + row.provider_id + '/edit/'">
		{{ row.provider_id }}
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
