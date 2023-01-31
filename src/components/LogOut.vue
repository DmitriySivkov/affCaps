<template>
	<q-btn
		label="Выйти"
		color="primary"
		class="q-pa-lg full-width"
		@click="logout"
	/>
</template>

<script>
import { useNotification } from "src/composables/notification"
import { useUserStore } from "src/stores/user"
export default {
	setup() {
		const user_store = useUserStore()
		const { notifySuccess } = useNotification()

		const logout = () => {
			user_store.logout()
			notifySuccess("Успешный логаут")
		}

		return {
			logout
		}
	}
}
</script>
