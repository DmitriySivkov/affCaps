import { defineStore } from "pinia"

export const useSalesStore = defineStore("sales", {
	state: () => ({
		is_initialized: false,
		filter: {},
		data: [],
	}),

	actions: {
		setFilter(filter) {
			this.filter = filter
		},

		setFilterField({field, value}) {
			this.filter[field] = value
		},

		commitSales(sales) {
			this.data = [...this.data, ...sales]
		},

		commitSalesField({ id, fields }) {
			let sale = this.data.find((s) => s.id === id)
			Object.assign(sale, fields)
		},

		commitIsInitialized(is_initialized) {
			this.is_initialized = is_initialized
		},

		commitClearSales() {
			this.data = []
		}

	}
})
