import { defineStore } from "pinia"

export const useSalesStore = defineStore("sales", {
	state: () => ({
		filter: {}
	}),

	actions: {
		setFilter(filter) {
			this.filter = filter
		},
		setFilterField({field, value}) {
			this.filter[field] = value
		}
	}
})
