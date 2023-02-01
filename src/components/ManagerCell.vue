<template>
	<q-td auto-width>
		<ul class="q-pl-none">
			<li
				v-for="(manager, index) in props.row.provider.managers"
				:key="index"
			>
				{{ manager.fullname }}
			</li>
		</ul>
	</q-td>
</template>

<script>
export default {
	props: {
		props: Object
	}
}
</script>
