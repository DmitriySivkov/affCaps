<template>
	<q-header elevated>
		<q-toolbar>
			<q-btn
				flat
				dense
				round
				icon="menu"
				aria-label="Menu"
				@click="toggleLeftDrawer"
			/>
		</q-toolbar>
	</q-header>

	<q-drawer
		v-model="leftDrawerOpen"
		show-if-above
		bordered
	>
	</q-drawer>
</template>

<script>
import { ref } from "vue"
export default {
	setup() {
		const leftDrawerOpen = ref(false)
		const toggleLeftDrawer = () =>
			leftDrawerOpen.value = !leftDrawerOpen.value

		return {
			leftDrawerOpen,
			toggleLeftDrawer
		}
	}
}
</script>
