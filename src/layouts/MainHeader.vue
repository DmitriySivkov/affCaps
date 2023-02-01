<template>
	<q-header elevated>
		<q-toolbar>
			<div class="col-8">
				<q-btn
					flat
					round
					icon="menu"
					aria-label="Menu"
					@click="toggleLeftDrawer"
				/>
			</div>
			<div class="col-4">
				<q-btn
					v-if="router.currentRoute.value.name === 'home'"
					flat
					round
					icon="login"
					class="float-right"
					:to="{name:'auth'}"
				/>
				<q-btn
					v-if="router.currentRoute.value.name === 'auth'"
					flat
					round
					icon="home"
					class="float-right"
					:to="{name:'home'}"
				/>
			</div>
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
import { useRouter } from "vue-router"
export default {
	setup() {
		const router = useRouter()
		const leftDrawerOpen = ref(false)
		const toggleLeftDrawer = () =>
			leftDrawerOpen.value = !leftDrawerOpen.value

		return {
			leftDrawerOpen,
			toggleLeftDrawer,
			router
		}
	}
}
</script>
