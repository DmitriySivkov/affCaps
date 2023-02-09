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
					flat
					round
					icon="login"
					class="float-right"
					@click="toggleAuthDrawer"
				/>
			</div>
		</q-toolbar>
	</q-header>

	<q-drawer
		v-model="leftDrawerOpen"
		bordered
	>
		<TableList />
		<q-separator />
	</q-drawer>
	<q-drawer
		:width="$q.screen.width"
		overlay
		side="right"
		v-model="authDrawerOpen"
		bordered
	>
		<UserAuth />
	</q-drawer>
</template>

<script>
import { ref, watch } from "vue"
import { useRouter } from "vue-router"
import { useUser } from "src/composables/user"
import UserAuth from "src/components/auth/UserAuth.vue"
import TableList from "src/components/leftDrawer/TableList.vue"
export default {
	components: {
		UserAuth,
		TableList
	},
	setup() {
		const { is_logged } = useUser()
		const router = useRouter()

		const leftDrawerOpen = ref(is_logged.value)
		const authDrawerOpen = ref(!is_logged.value)

		const toggleLeftDrawer = () => {
			if (authDrawerOpen.value === true)
				return

			leftDrawerOpen.value = !leftDrawerOpen.value
		}

		const toggleAuthDrawer = () => {
			if (!is_logged.value)
				return

			authDrawerOpen.value = !authDrawerOpen.value

			leftDrawerOpen.value = authDrawerOpen.value !== true
		}

		watch(() => is_logged.value, () => {
			toggleAuthDrawer()
		})

		return {
			leftDrawerOpen,
			authDrawerOpen,
			toggleLeftDrawer,
			toggleAuthDrawer,
			router
		}
	}
}
</script>
