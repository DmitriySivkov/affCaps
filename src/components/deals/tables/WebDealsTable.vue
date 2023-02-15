<template>
	<AdminDealsTableFilter ref="filter_component" />
	<q-table
		:style="{height: table_height + 'px'}"
		class="sticky-header-table"
		:loading="loading"
		:rows="deals"
		:columns="columns"
		row-key="id"
		:rows-per-page-options="[0]"
		:pagination="pagination"
		:filter="query"
		:filter-method="queryFilter"
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
import { useQuasar } from "quasar"
import AdminDealsTableFilter from "components/deals/filters/AdminDealsTableFilter.vue"
import StandardCell from "src/components/deals/cells/StandardCell.vue"
import RegionCell from "src/components/deals/cells/RegionCell.vue"
import CountryCell from "src/components/deals/cells/CountryCell.vue"
import AffiliateCell from "src/components/deals/cells/AffiliateCell.vue"
import CurrentCountCell from "src/components/deals/cells/CurrentCountCell.vue"
import FreeCapCell from "src/components/deals/cells/FreeCapCell.vue"
import SplitCell from "src/components/deals/cells/SplitCell.vue"
import { useDealsStore } from "src/stores/deals"
export default {
	components: {
		StandardCell,
		// RegionCell,
		CountryCell,
		AffiliateCell,
		CurrentCountCell,
		FreeCapCell,
		SplitCell,
		AdminDealsTableFilter
	},
	setup() {
		const $q = useQuasar()
		const deals_store = useDealsStore()

		const deals = ref([])
		const columns = [
			{ name: "id", label: "#ID", align: "left", field: "id", sortable: true },
			{ name: "region", label: "Region", field: "region", align: "left" },
			{ name: "country", label: "Country", field: "country", align: "left" },
			{ name: "affiliate", label: "Affiliate", field: "affiliate", align: "left" },
			{ name: "deduction", label: "Payouts", field: "deduction", align: "left" },
			{ name: "amount", label: "CAPs", field: "amount", align: "left" },
			{ name: "total_count", label: "Current Count", field: "total_count", align: "left" },
			{ name: "free_cap", label: "Free Cap", field: "free_cap", align: "left" },
			{ name: "split", label: "Split", field: "split", align: "left" },
			{ name: "status_sale", label: "Status Sale", field: "status_sale", align: "left" },
			{ name: "percent", label: "%*", field: "percent", align:"left" },
			{ name: "source", label: "Source*", field: "source", align:"left" },
			{ name: "funnel", label: "Funnel*", field: "funnel", align:"left" },
			{ name: "experience", label: "Experience*", field: "experience", align:"left" },
			{ name: "comment", label: "Comment*", field: "comment", align:"left" }
		]

		const filter_component = ref(null)

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
			case "free_cap":
				return "FreeCapCell"
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

		const table_height = computed(() =>
			$q.screen.height - (filter_component.value ? filter_component.value.$el.clientHeight : 0) - 46
		)

		return {
			loading,
			deals,
			pagination,
			columns,
			getCell,
			query,
			queryFilter,
			filter_component,
			table_height
		}
	}
}
</script>
