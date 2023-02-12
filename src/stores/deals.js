import { defineStore } from "pinia"

export const useDealsStore = defineStore("deals", {
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
