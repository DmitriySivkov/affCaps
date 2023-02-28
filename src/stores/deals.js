import { defineStore } from "pinia"

export const useDealsStore = defineStore("deals", {
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

		commitDeals(deals) {
			this.data = [...deals, ...this.data]
		},

		commitDealsField({ id, fields }) {
			let deal = this.data.find((s) => s.id === id)

			Object.assign(deal, fields)
		},

		commitIsInitialized(is_initialized) {
			this.is_initialized = is_initialized
		},

		commitClearDeals() {
			this.data = []
		},

		commitRecountReservedCap({ country_id, total_reserved }) {
			this.data = this.data.map((d) => {
				if (d.country_id === country_id) {
					d.total_country_reserved = total_reserved
				}

				return d
			})
		}
	}
})
