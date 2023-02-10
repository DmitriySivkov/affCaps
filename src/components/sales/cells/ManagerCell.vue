<template>
	<ul class="q-pl-none">
		<li
			v-for="(manager, index) in row.provider.managers"
			:key="index"
		>
			{{ manager.fullname }}
		</li>
	</ul>
</template>

<script>
export default {
	props: {
		row: Object,
		col: Object
	},
}
</script>
