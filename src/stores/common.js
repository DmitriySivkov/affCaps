import { defineStore } from "pinia"

export const useCommonStore = defineStore("common", {
	state: () => ({
		selected_table: "sales"
	}),

	actions: {
		setSelectedTable(table_name) {
			this.selected_table = table_name
		}
	}
})
