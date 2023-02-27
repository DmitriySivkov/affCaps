import { echo } from "boot/ws"
import { useUserStore } from "src/stores/user"

export const usePrivateChannels = () => {
	const user_store = useUserStore()

	const connectDeals = () => {
		echo.private("deals." + user_store.data.id)
			.listen(".AffiliateLimitCreated", (e) => {
				console.log(e)
			})
	}

	return {
		connectDeals
	}
}
