import { defineStore } from "pinia"

export const useCommonStore = defineStore("common", {
	state: () => ({
		selected_table: "sales",
		is_auth_screen_open: false
	}),

	actions: {
		setSelectedTable(table_name) {
			this.selected_table = table_name
		},

		setAuthScreenOpen(is_open) {
			this.is_auth_screen_open = is_open
		}
	}
})
