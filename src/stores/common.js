import { defineStore } from "pinia"

export const useCommonStore = defineStore("common", {
	state: () => ({
		selected_table: null,
		countries: [],
		regions: [],
	}),

	actions: {
		setSelectedTable(table_name) {
			this.selected_table = table_name
		},
		setCountries(countries) {
			this.countries = countries
		},
		setRegions(regions) {
			this.regions = regions
		},
	}
})
