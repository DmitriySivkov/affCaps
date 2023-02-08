<template>
	<div class="row justify-center full-height">
		<div class="col-4 self-center">
			<LogIn v-if="!is_logged" />
			<LogOut v-else />
		</div>
	</div>
</template>

<script>
import { useUser } from "src/composables/user"
import LogIn from "src/components/auth/LogIn.vue"
import LogOut from "src/components/auth/LogOut.vue"
export default {
	components: { LogIn, LogOut },
	setup() {
		const { is_logged } = useUser()
		return {
			is_logged
		}
	}
}
</script>
