<template>
	<AdminDealsTableFilter />
	<q-table
		class="sticky-header-table"
		:loading="loading"
		:rows="deals"
		:columns="columns"
		row-key="id"
		:rows-per-page-options="[0]"
		:pagination="pagination"
		:filter="query"
		:filter-method="queryFilter"
		:sort-method="sortDeals"
		virtual-scroll
	>
		<template v-slot:header="props">
			<q-tr :props="props">
				<q-th
					auto-width
					v-for="col in props.cols"
					:key="col.name"
					:props="props"
				>
					{{ col.label }}
				</q-th>
			</q-tr>
		</template>
		<template v-slot:body="props">
			<q-tr
				:props="props"
			>
				<q-td
					auto-width
					v-for="col in props.cols"
					:key="col.name"
					:props="props"
				>
					<component
						:is="getCell(col.name)"
						:row="props.row"
						:col="col"
						:key="props.row.id"
					/>
				</q-td>
			</q-tr>
		</template>
	</q-table>
</template>

<script>
import { ref, computed } from "vue"
import { api } from "src/boot/axios"
import _ from "lodash"
import AdminDealsTableFilter from "src/components/deals/filters/AdminDealsTableFilter.vue"
import StandardCell from "src/components/deals/cells/StandardCell.vue"
import RegionCell from "src/components/deals/cells/RegionCell.vue"
import CountryCell from "src/components/deals/cells/CountryCell.vue"
import AffiliateCell from "src/components/deals/cells/AffiliateCell.vue"
import CurrentCountCell from "src/components/deals/cells/CurrentCountCell.vue"
import SplitCell from "src/components/deals/cells/SplitCell.vue"
import { useDealsStore } from "src/stores/deals"
export default {
	components: {
		StandardCell,
		// RegionCell,
		CountryCell,
		AffiliateCell,
		CurrentCountCell,
		SplitCell,
		AdminDealsTableFilter
	},
	setup() {
		const deals_store = useDealsStore()

		const deals = ref([])
		const columns = [
			{ name: "id", label: "#ID", align: "left", field: "id", sortable: true, sort_type: "numeric" },
			{ name: "region", label: "Region", field: "region", align: "left" },
			{ name: "country", label: "Country", field: "country", align: "left", sortable: true, sort_type: "string" },
			{ name: "affiliate", label: "Affiliate", field: "affiliate", align: "left", sortable: true, sort_type: "numeric" },
			{ name: "deduction", label: "Payouts", field: "deduction", align: "left", sortable: true, sort_type: "numeric" },
			{ name: "amount", label: "CAPs", field: "amount", align: "left", sortable: true, sort_type: "numeric" },
			{ name: "total_count", label: "Current Count", field: "total_count", align: "left", sortable: true, sort_type: "numeric" },
			{ name: "total_country_cap", label: "Total Country Cap", field: "total_country_cap", align: "left", sortable: true, sort_type: "numeric" },
			{ name: "split", label: "Split", field: "split", align: "left" },
			{ name: "status_sale", label: "Status Sale", field: "status_sale", align: "left", sortable: true, sort_type: "string" },
			{ name: "percent", label: "%*", field: "percent", align:"left" },
			{ name: "source", label: "Source*", field: "source", align:"left" },
			{ name: "funnel", label: "Funnel*", field: "funnel", align:"left" },
			{ name: "experience", label: "Experience*", field: "experience", align:"left" },
			{ name: "comment", label: "Comment*", field: "comment", align:"left" }
		]

		const loading = ref(false)

		const pagination = ref({ rowsPerPage: 0 })

		const loadData = async() => {
			let offset = 0
			loading.value = true

			let available_countries = []

			const getAvailableCountries = async() => {
				const response = await api.get("/affiliateCaps/countries")
				available_countries = response.data
			}

			const fetchDeals = async() => {
				const response = await api.get("/affiliateCaps", {
					params: {
						offset,
						availableCountries: JSON.stringify(available_countries),
						fetch: "deals"
					}
				})

				if (response.data.length > 0) {
					deals.value = [...deals.value, ...response.data]

					offset += 80
					await fetchDeals()
				}
			}

			await getAvailableCountries()
			await fetchDeals()

			loading.value = false
		}

		loadData()

		const getCell = (col) => {
			switch (col) {
			// case "region":
			// 	return "RegionCell"
			case "country":
				return "CountryCell"
			case "affiliate":
				return "AffiliateCell"
			case "total_count":
				return "CurrentCountCell"
			case "split":
				return "SplitCell"
			default:
				return "StandardCell"
			}
		}

		const query = computed(() => deals_store.filter)

		const queryFilter = (rows, terms, cols, getCellValue) => {
			return _.filter(rows, (row) => {
				return (!!terms.id ? row.id.toString().includes(terms.id) : true) &&
					(!!terms.region ? row.region.toLowerCase().includes(terms.region.toLowerCase()) : true) &&
					(!!terms.country ? (row.country_iso + " - " + row.country_name).toLowerCase().includes(terms.country.toLowerCase()) : true) &&
					(!!terms.affiliate ? row.affiliate_info.toLowerCase().includes(terms.affiliate.toLowerCase()) : true) &&
					(!!terms.split && terms.split.length > 0 ? (row.split ? terms.split.map((t) => t.text).includes(row.split.name) : false) : true) &&
					(!!terms.status_sale ? row.status_sale === terms.status_sale : true)
			})
		}

		const numeric_sort = columns.filter((c) => c.sortable && c.sort_type === "numeric")
			.map((c) => c.name)

		const string_sort = columns.filter((c) => c.sortable && c.sort_type === "string")
			.map((c) => c.name)

		const sortDeals = (rows, sortBy, descending) => {
			const data = [...rows]

			if (sortBy) {
				data.sort((a, b) => {
					const x = descending ? b : a
					const y = descending ? a : b

					if (string_sort.includes(sortBy)) {
						if (sortBy === "country") {
							return x["country_name"] > y["country_name"] ?
								1 :
								x["country_name"] < y["country_name"] ? -1 : 0
						}
						return x[ sortBy ] > y[ sortBy ] ? 1 : x[ sortBy ] < y[ sortBy ] ? -1 : 0
					}

					if (numeric_sort.includes(sortBy)) {
						if (sortBy === "broker") {
							return parseFloat(x["provider_id"]) - parseFloat(y["provider_id"])
						}
						if (sortBy === "affiliate") {
							return parseFloat(x["affiliate_id"]) - parseFloat(y["affiliate_id"])
						}
						return parseFloat(x[ sortBy ]) - parseFloat(y[ sortBy ])
					}

				})
			}

			return data
		}

		return {
			loading,
			deals,
			pagination,
			columns,
			getCell,
			query,
			queryFilter,
			sortDeals
		}
	}
}
</script>
