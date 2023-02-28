import { echo } from "boot/ws"

export const usePublicChannels = () => {
	const connectDeals = () => {
		echo.channel("deals")
			.listen(".AffiliateLimitCreated", (e) => {
				console.log(e)
			})
	}

	return {
		connectDeals
	}
}
