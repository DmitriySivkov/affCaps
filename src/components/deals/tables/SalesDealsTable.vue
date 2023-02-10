<template>
	<q-table
		class="sticky-header-table"
		style="height:94vh"
		:loading="loading"
		:rows="deals"
		:columns="columns"
		row-key="id"
		:rows-per-page-options="[0]"
		:pagination="pagination"
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
import { ref } from "vue"
import { api } from "src/boot/axios"
import StandardCell from "src/components/deals/cells/StandardCell.vue"
import RegionCell from "src/components/deals/cells/RegionCell.vue"
import CountryCell from "src/components/deals/cells/CountryCell.vue"
import AffiliateCell from "src/components/deals/cells/AffiliateCell.vue"
import CurrentCountCell from "src/components/deals/cells/CurrentCountCell.vue"
export default {
	components: {
		StandardCell,
		// RegionCell,
		CountryCell,
		AffiliateCell,
		CurrentCountCell
	},
	setup() {
		const deals = ref([])
		const columns = [
			{ name: "id", label: "#ID", align: "left", field: "id", sortable: true },
			{ name: "region", label: "Region", align: "left" },
			{ name: "country", label: "Country", align: "left" },
			{ name: "affiliate", label: "Affiliate", align: "left" },
			{ name: "deduction", label: "Payouts", align: "left" },
			{ name: "amount", label: "CAPs", align: "left" },
			{ name: "total_count", label: "Current Count", align: "left" },
			{ name: "status_sale", label: "Status Sale", align: "left" },
			{ name: "percent", label: "%*", align:"left" },
			{ name: "source", label: "Source*", align:"left" },
			{ name: "funnel", label: "Funnel*", align:"left" },
			{ name: "experience", label: "Experience*", align:"left" },
			{ name: "comment", label: "Comment*", align:"left" },
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

			const fetchData = async() => {
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
					await fetchData()
				} else {
					offset = 0
				}
			}

			await getAvailableCountries()
			await fetchData()

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
			default:
				return "StandardCell"
			}
		}

		return {
			loading,
			deals,
			pagination,
			columns,
			getCell
		}
	}
}
</script>
