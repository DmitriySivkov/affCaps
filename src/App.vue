<template>
	<router-view />
</template>

<script>
import { watch } from "vue"
import { echo } from "src/boot/ws"
import { useUserStore } from "src/stores/user"
import { usePrivateChannels } from "src/composables/privateChannels"
export default {
	setup() {
		const user_store = useUserStore()
		const private_channels = usePrivateChannels()

		const connectPrivateChannels = () => {
			if (!window.Pusher.isConnected)
				echo.connect()

			if (user_store.data.id) {
				private_channels.connectDeals()
			}
		}

		connectPrivateChannels()

		watch(() => user_store.data.id, (userId) => {
			if (userId) {
				connectPrivateChannels()
			} else {
				echo.disconnect()
			}
		})
	},
}
</script>
