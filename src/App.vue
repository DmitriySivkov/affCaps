<template>
	<router-view />
</template>

<script>
import { watch } from "vue"
import { echo } from "src/boot/ws"
import { useUserStore } from "src/stores/user"
import { usePublicChannels } from "src/composables/publicChannels"
export default {
	setup() {
		const user_store = useUserStore()
		const public_channels = usePublicChannels()

		const connectPublicChannels = () => {
			if (!window.Pusher.isConnected)
				echo.connect()

			if (user_store.data.id) {
				public_channels.connectDeals()
			}
		}

		connectPublicChannels()

		watch(() => user_store.data.id, (userId) => {
			if (userId) {
				connectPublicChannels()
			} else {
				echo.disconnect()
			}
		})
	},
}
</script>
