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
		<template v-slot:bottom>
			<div class="col">
				<q-btn
					color="secondary"
					icon="add"
					@click="showNewDealDialog"
				/>
			</div>
		</template>
	</q-table>
</template>

<script>
import { ref, computed } from "vue"
import { api } from "src/boot/axios"
import _ from "lodash"
import AdminDealsTableFilter from "components/deals/filters/AdminDealsTableFilter.vue"
import StandardCell from "src/components/deals/cells/StandardCell.vue"
import CountryCell from "src/components/deals/cells/CountryCell.vue"
import AffiliateCell from "src/components/deals/cells/AffiliateCell.vue"
import CurrentCountCell from "src/components/deals/cells/CurrentCountCell.vue"
import FreeCapCell from "components/deals/cells/FreeCapCell.vue"
import SplitCell from "src/components/deals/cells/SplitCell.vue"
import ManagerCell from "src/components/deals/cells/ManagerCell.vue"
import { useDealsStore } from "src/stores/deals"
import { Dialog } from "quasar"
import AddDealDialog from "components/dialogs/AddDealDialog.vue"
import { useNotification } from "src/composables/notification"
export default {
	components: {
		StandardCell,
		CountryCell,
		AffiliateCell,
		CurrentCountCell,
		FreeCapCell,
		SplitCell,
		ManagerCell,
		AdminDealsTableFilter
	},
	setup() {
		const deals_store = useDealsStore()
		const { notifySuccess } = useNotification()

		const deals = ref([])
		const columns = [
			{ name: "id", label: "#ID", align: "left", field: "id", sortable: true, sort_type: "numeric" },
			{ name: "region", label: "Region", field: "region", align: "left", sortable: true, sort_type: "string" },
			{ name: "country", label: "Country", field: "country", align: "left", sortable: true, sort_type: "string" },
			{ name: "affiliate", label: "Affiliate", field: "affiliate", align: "left", sortable: true, sort_type: "numeric" },
			{ name: "deduction", label: "Payouts", field: "deduction", align: "left", sortable: true, sort_type: "numeric" },
			{ name: "amount", label: "CAPs", field: "amount", align: "left", sortable: true, sort_type: "numeric" },
			{ name: "total_count", label: "Current Count", field: "total_count", align: "left", sortable: true, sort_type: "numeric" },
			{ name: "free_cap", label: "Free Country Cap", field: "free_cap", align: "left", sortable: true, sort_type: "numeric" },
			{ name: "total_country_cap", label: "Total Country Cap", field: "total_country_cap", align: "left", sortable: true, sort_type: "numeric" },
			{ name: "split", label: "Split", field: "split", align: "left" },
			{ name: "status_sale", label: "Status Sale", field: "status_sale", align: "left", sortable: true, sort_type: "string" },
			{ name: "manager", label: "Manager", field: "manager", align: "left" },
			{ name: "percent", label: "%", field: "percent", align:"left" },
			{ name: "source", label: "Source", field: "source", align:"left" },
			{ name: "funnel", label: "Funnel", field: "funnel", align:"left" },
			{ name: "experience", label: "Experience", field: "experience", align:"left" },
			{ name: "comment", label: "Comment", field: "comment", align:"left" }
		]

		const loading = ref(false)

		const pagination = ref({ rowsPerPage: 0 })

		const loadData = async() => {
			let offset = 0
			loading.value = true

			let available_countries = []

			const getAvailableCountries = async() => {
				const response = await api.get("/affiliateCaps/countries/available")
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
			case "manager":
				return "ManagerCell"
			default:
				return "StandardCell"
			}
		}

		const query = computed(() => deals_store.filter)

		const queryFilter = (rows, terms, cols, getCellValue) => {
			return _.filter(rows, (row) => {
				return (!!terms.id ? row.id.toString().includes(terms.id) : true) &&
					(!!terms.region && terms.region.length > 0 ? terms.region.map((r) => r.id).includes(row.region_id) : true) &&
					(!!terms.country && terms.country.length > 0 ? terms.country.map((c) => c.id).includes(row.country_id) : true) &&
					(!!terms.affiliate && terms.affiliate.length > 0 ? terms.affiliate.map((c) => c.id).includes(row.affiliate_id) : true) &&
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
							return parseInt(x["provider_id"]) - parseInt(y["provider_id"])
						}
						if (sortBy === "affiliate") {
							return parseInt(x["affiliate_id"]) - parseInt(y["affiliate_id"])
						}
						if (sortBy === "free_cap") {
							return (parseInt(x["total_country_cap"]) + parseInt(x["total_country_reserved"])) -
								(parseInt(y["total_country_cap"]) + parseInt(y["total_country_reserved"]))
						}
						return parseInt(x[ sortBy ]) - parseInt(y[ sortBy ])
					}

				})
			}

			return data
		}

		const showNewDealDialog = () => {
			Dialog.create({
				component: AddDealDialog
			}).onOk(async(new_deal) => {
				await addNewDeal(new_deal)
			})
		}

		const addNewDeal = async(new_deal) => {
			deals.value.unshift({
				affiliate_id: new_deal.affiliate.id,
				affiliate_info: "#" + new_deal.affiliate.id + ": " + new_deal.affiliate.fullname + " (" + new_deal.affiliate.email + ")",
				amount: new_deal.amount,
				comment: new_deal.comment,
				country_id: new_deal.country.id,
				country_iso: new_deal.country.iso,
				country_name: new_deal.country.en_name,
				created_at: new_deal.created_at,
				deduction: new_deal.deduction,
				experience: new_deal.experience,
				funnel: new_deal.funnel,
				id: new_deal.id,
				manager_id: null,
				percent: new_deal.percent,
				region: new_deal.region.name,
				source: new_deal.source,
				split: null,
				split_id: null,
				status_sale: new_deal.status_sale,
				total_country_cap: deals.value.find((d) => d.country_id === new_deal.country.id).total_country_cap,
				total_country_reserved: new_deal.total_country_reserved,
				updated_at: new_deal.updated_at
			})

			deals.value = deals.value.map((d) => {
				if (d.country_id === new_deal.country.id) {
					d.total_country_reserved = new_deal.total_country_reserved
				}

				return d
			})

			notifySuccess("Deal is added successfully")

		}

		return {
			loading,
			deals,
			pagination,
			columns,
			getCell,
			query,
			queryFilter,
			sortDeals,
			showNewDealDialog
		}
	}
}
</script>
