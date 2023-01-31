import { defineStore } from "pinia"
import { api } from "src/boot/axios"
import { LocalStorage } from "quasar"

export const useUserStore = defineStore("user", {
	state: () => ({
		data: {}
	}),

	actions: {
		async login(api_token) {
			return api.get("user/affCaps", {
				headers: {
					Authorization: "Bearer " + api_token
				}
			})
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
