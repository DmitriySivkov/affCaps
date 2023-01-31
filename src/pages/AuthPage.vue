<template>
	<q-page class="column justify-center">
		<div class="row justify-center">
			<div class="col-4">
				<LogIn v-if="!user_store.$state.data.api_token" />
				<LogOut v-else />
			</div>
		</div>
	</q-page>

</template>

<script>
import { useUserStore } from "src/stores/user"
import LogIn from "src/components/LogIn.vue"
import LogOut from "src/components/LogOut.vue"
export default {
	components: { LogIn, LogOut },
	setup() {
		const user_store = useUserStore()
		return {
			user_store
		}
	}
}
</script>
