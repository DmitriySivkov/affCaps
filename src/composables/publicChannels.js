import { echo } from "boot/ws"
import { useUser } from "src/composables/user"
import { useSalesStore } from "src/stores/sales"
import { useDealsStore } from "src/stores/deals"
import { useNotification } from "src/composables/notification"
import { useDeals } from "src/composables/deals"
import { useUserStore } from "src/stores/user"

export const usePublicChannels = () => {
	const sales_store = useSalesStore()
	const deals_store = useDealsStore()
	const user_store = useUserStore()

	const { hasRole } = useUser()
	const { notifySuccess } = useNotification()
	const { addDeal } = useDeals()

	const connectDeals = () => {
		echo.channel("deals")
			.listen(".AffiliateLimitCreated", (e) => {
				// admin
				if (!!hasRole(1) || !!hasRole(7)) {
					addDeal(e)

					notifySuccess("New deal #" + e.model.id + " has been added")

					return
				}

				// adv
				if (!!hasRole(4)) {
					addDeal(e)

					notifySuccess("New deal #" + e.model.id + " has been added")

					return
				}

				// web
				if (!!hasRole(5)) {
					if (e.model.affiliate.manager_id !== user_store.data.id)
						return

					addDeal(e)

					notifySuccess("New deal #" + e.model.id + " has been added")
				}
			})
	}

	return {
		connectDeals
	}
}
