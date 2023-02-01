<template>
	<q-td auto-width>
		<a :href="'/admin/providers/' + props.row.provider_id + '/edit/'">
			{{ props.row.provider_id }}
		</a>
	</q-td>
</template>

<script>
export default {
	props: {
		props: Object
	}
}
</script>
