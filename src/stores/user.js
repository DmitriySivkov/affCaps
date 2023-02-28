import { defineStore } from "pinia"
import { api } from "src/boot/axios"
import { LocalStorage } from "quasar"
import { useSalesStore } from "src/stores/sales"
import { useDealsStore } from "src/stores/deals"

export const useUserStore = defineStore("user", {
	state: () => ({
		data: {}
	}),

	actions: {
		login(api_token) {
			api.defaults.headers["Authorization"] = "Bearer " + api_token
			return api.get("/affiliateCaps/user")
		},

		logout() {
			const sales_store = useSalesStore()
			const deals_store = useDealsStore()

			this.setUserData({})

			sales_store.commitClearSales()
			sales_store.setFilter({})
			sales_store.commitIsInitialized(false)

			deals_store.commitClearDeals()
			deals_store.setFilter({})
			deals_store.commitIsInitialized(false)

			LocalStorage.remove("api_token")
		},

		setUserData(data) {
			this.data = data
		}
	}
})
