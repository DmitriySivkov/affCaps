import { defineStore } from "pinia"
import { api } from "src/boot/axios"
import { LocalStorage } from "quasar"

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
			this.setUserData({})
			LocalStorage.remove("api_token")
		},

		setUserData(data) {
			this.data = data
		}
	}
})
