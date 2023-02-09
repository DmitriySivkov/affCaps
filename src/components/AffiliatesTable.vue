<template>
	<q-table
		class="sticky-header-table"
		style="height:90vh"
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
import StandardCell from "src/components/affiliateTableCells/StandardCell.vue"
import RegionCell from "src/components/affiliateTableCells/RegionCell.vue"
import CountryCell from "src/components/affiliateTableCells/CountryCell.vue"
import AffiliateCell from "src/components/affiliateTableCells/AffiliateCell.vue"
export default {
	components: {
		StandardCell,
		// RegionCell,
		CountryCell,
		AffiliateCell,
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
						refreshType: "affManager",
						offset,
						availableCountries: JSON.stringify(available_countries),
						fetchAffiliatesData: true
					}
				})
				if (response.data.caps.length > 0) {
					deals.value = [...deals.value, ...response.data.caps]
					offset += 40
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

<style lang="sass">
.sticky-header-table
	height: 310px

	.q-table__top,
	.q-table__bottom,
	thead tr:first-child th
		background-color: #c1f4cd

	thead tr th
		position: sticky
		z-index: 1
	thead tr:first-child th
		top: 0

	&.q-table--loading thead tr:last-child th
		top: 48px
</style>
