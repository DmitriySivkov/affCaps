import { defineStore } from "pinia"

export const useCommonStore = defineStore("common", {
	state: () => ({
		selected_table: null,
		meta: {},
		countries: [],
		regions: [],
	}),

	actions: {
		setSelectedTable(table_name) {
			this.selected_table = table_name
		},

		setMetaField({field, value}) {
			this.meta[field] = value
		},

		removeMetaField(field) {
			delete this.meta[field]
		},

		setCountries(countries) {
			this.countries = countries
		},

		setRegions(regions) {
			this.regions = regions
		},

	}
})
