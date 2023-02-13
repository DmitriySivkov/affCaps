<template>
	<SalesTableFilter ref="filter_component" />
	<q-table
		:style="{height: table_height + 'px'}"
		class="sticky-header-table"
		:loading="loading"
		:rows="caps"
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
					v-for="col in props.cols"
					:key="col.name"
					auto-width
					:props="props"
				>
					{{ col.label }}
				</q-th>
				<q-th auto-width />
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
				<q-td>
					<q-list dense>
						<q-item
							clickable
							class="bg-primary text-white"
							@click="showDeals(props.row)"
						>
							<q-item-section avatar>
								<q-avatar icon="view_list"/>
							</q-item-section>
							<q-item-section>Deals</q-item-section>
						</q-item>
					</q-list>
				</q-td>
			</q-tr>
		</template>
	</q-table>
</template>

<script>
import { computed, ref } from "vue"
import { api } from "src/boot/axios"
import StandardCell from "src/components/sales/cells/StandardCell.vue"
import ScheduleCell from "src/components/sales/cells/ScheduleCell.vue"
import PayoutsCell from "src/components/sales/cells/PayoutsCell.vue"
import ManagerCell from "src/components/sales/cells/ManagerCell.vue"
import BrokerCell from "src/components/sales/cells/BrokerCell.vue"
import RegionCell from "src/components/sales/cells/RegionCell.vue"
import CountryCell from "src/components/sales/cells/CountryCell.vue"
import { useCommonStore } from "src/stores/common"
import { useDealsStore } from "src/stores/deals"
import { useQuasar, Loading } from "quasar"
import SalesTableFilter from "src/components/sales/filters/SalesTableFilter.vue"
import _ from "lodash"
import { useSalesStore } from "src/stores/sales"
export default {
	components: {
		StandardCell,
		RegionCell,
		CountryCell,
		ScheduleCell,
		PayoutsCell,
		ManagerCell,
		BrokerCell,
		SalesTableFilter
	},
	setup() {
		const $q = useQuasar()
		const deals_store = useDealsStore()
		const sales_store = useSalesStore()
		const common_store = useCommonStore()

		const caps = ref([])
		const columns = [
			{ name: "id", label: "#ID", align: "left", field: "id", sortable: true },
			{ name: "region", label: "Region", align: "left" },
			{ name: "country", label: "Country", align: "left" },
			{ name: "broker", label: "Broker", align: "left" },
			{ name: "payouts", label: "Payouts", align: "left" },
			{ name: "amount", label: "CAPs", align: "left" },
			{ name: "current_cap_count", label: "Current Count", align: "left" },
			{ name: "working_hours", label: "Working Hours (today)", align: "left" },
			{ name: "manager", label: "Manager", align: "left" }
		]

		const loading = ref(false)

		const pagination = ref({ rowsPerPage: 0 })

		const loadData = async() => {
			let offset = 0
			loading.value = true

			const fetchData = async() => {
				const response = await api.get("/affiliateCaps", {
					params: {
						fetch: "sales",
						offset,
					}
				})
				if (response.data.length > 0) {
					caps.value = [...caps.value, ...response.data]
					offset += 80
					await fetchData()
				}
			}

			await fetchData()

			loading.value = false
		}

		loadData()

		const getCell = (col) => {
			switch (col) {
			case "region":
				return "RegionCell"
			case "country":
				return "CountryCell"
			case "working_hours":
				return "ScheduleCell"
			case "payouts":
				return "PayoutsCell"
			case "manager":
				return "ManagerCell"
			case "broker":
				return "BrokerCell"
			default:
				return "StandardCell"
			}
		}

		const showDeals = async (row) => {
			Loading.show()
			const response = await api.get("/affiliateCaps/splits", {
				params: {
					providers: [row.provider_id],
					countries: [row.country_id],
					limit: 999
				}
			})
			deals_store.setFilter({
				country: row.country.iso + " - " + row.country.en_name,
				split: response.data.items
			})
			common_store.setSelectedTable("deals")
			Loading.hide()
		}

		const query = computed(() => sales_store.filter)

		const queryFilter = (rows, terms, cols, getCellValue) => {
			return _.filter(rows, (row) => {
				return (!!terms.id ? row.id.toString().includes(terms.id) : true) &&
					(!!terms.region ? row.provider.region.name.toLowerCase().includes(terms.region.toLowerCase()) : true) &&
					(!!terms.country ? (row.country.iso + " - " + row.country.en_name).toLowerCase().includes(terms.country.toLowerCase()) : true) &&
					(!!terms.provider && terms.provider.length > 0 ? terms.provider.map((p) => p.id).includes(row.provider.id) : true)
			})
		}

		const filter_component = ref(null)

		const table_height = computed(() =>
			$q.screen.height - (filter_component.value ? filter_component.value.$el.clientHeight : 0) - 42
		)

		return {
			loading,
			caps,
			pagination,
			columns,
			getCell,
			showDeals,
			table_height,
			filter_component,
			query,
			queryFilter
		}
	}
}
</script>
