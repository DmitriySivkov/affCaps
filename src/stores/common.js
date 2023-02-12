import { defineStore } from "pinia"

export const useCommonStore = defineStore("common", {
	state: () => ({
		selected_table: null,
	}),

	actions: {
		setSelectedTable(table_name) {
			this.selected_table = table_name
		},
	}
})
