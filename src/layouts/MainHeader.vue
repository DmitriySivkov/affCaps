<template>
	<q-header>
		<q-toolbar class="q-electron-drag">
			<div class="col-2">
				<q-btn
					flat
					icon="menu"
					aria-label="Menu"
					@click="toggleLeftDrawer"
				/>
			</div>
			<div class="col">
				<q-btn
					flat
					icon="login"
					class="float-right"
					@click="toggleAuthDrawer"
				/>
			</div>
			<q-bar
				v-if="is_electron"
				class="q-ml-md"
			>
				<q-btn
					dense
					flat
					icon="minimize"
					@click="minimize"
				/>
				<q-btn
					dense
					flat
					icon="crop_square"
					@click="toggleMaximize"
				/>
				<q-btn
					dense
					flat
					icon="close"
					@click="closeApp"
				/>
			</q-bar>
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

		const is_electron = process.env.MODE === "electron"

		const minimize = () => {
			if (is_electron) {
				window.myWindowAPI.minimize()
			}
		}

		const toggleMaximize = () => {
			if (is_electron) {
				window.myWindowAPI.toggleMaximize()
			}
		}

		const closeApp = () => {
			if (is_electron) {
				window.myWindowAPI.close()
			}
		}

		return {
			leftDrawerOpen,
			authDrawerOpen,
			toggleLeftDrawer,
			toggleAuthDrawer,
			router,
			is_electron,
			minimize,
			toggleMaximize,
			closeApp
		}
	}
}
</script>
