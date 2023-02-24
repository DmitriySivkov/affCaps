<template>
	<SalesTableFilter ref="filter_component" />
	<q-table
		ref="table"
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
		:sort-method="sortSales"
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
				<template
					v-for="col in props.cols"
					:key="col.name"
				>
					<q-td
						:props="props"
					>
						<RegionCell
							v-if="col.name === 'region'"
							:row="props.row"
							:col="col"
							:key="props.row.id"
						/>
						<CountryCell
							v-else-if="col.name === 'country'"
							:row="props.row"
							:col="col"
							:key="props.row.id"
						/>
						<ScheduleCell
							v-else-if="col.name === 'working_hours'"
							:row="props.row"
							:col="col"
							:key="props.row.id"
						/>
						<ManagerCell
							v-else-if="col.name === 'manager'"
							:row="props.row"
							:col="col"
							:key="props.row.id"
						/>
						<BrokerCell
							v-else-if="col.name === 'broker'"
							:row="props.row"
							:col="col"
							:key="props.row.id"
						/>
						<CapsCell
							v-else-if="col.name === 'amount'"
							:row="props.row"
							:col="col"
							:key="props.row.id"
							@change="capsChanged"
						/>
						<StandardCell
							v-else
							:row="props.row"
							:col="col"
							:key="props.row.id"
						/>
					</q-td>
				</template>
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
		<template
			v-if="caps.length > 0"
			v-slot:bottom-row="{ cols }"
		>
			<q-tr class="bg-primary text-white">
				<template
					v-for="col in cols"
					:key="col.name"
				>
					<q-td
						auto-width
						class="text-left"
					>
						<span v-if="col.name === 'amount'">
							{{ cap_count }}
						</span>
						<span v-if="col.name === 'current_cap_count'">
							{{ current_cap_count }}
						</span>
					</q-td>
				</template>
				<q-td auto-width />
			</q-tr>
		</template>
		<template v-slot:bottom>
		</template>
	</q-table>
</template>

<script>
import { computed, ref } from "vue"
import { api } from "src/boot/axios"
import StandardCell from "src/components/sales/cells/StandardCell.vue"
import ScheduleCell from "src/components/sales/cells/ScheduleCell.vue"
import ManagerCell from "src/components/sales/cells/ManagerCell.vue"
import BrokerCell from "src/components/sales/cells/BrokerCell.vue"
import RegionCell from "src/components/sales/cells/RegionCell.vue"
import CountryCell from "src/components/sales/cells/CountryCell.vue"
import CapsCell from "src/components/sales/cells/CapsCell.vue"
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
		ManagerCell,
		BrokerCell,
		CapsCell,
		SalesTableFilter
	},
	setup() {
		const $q = useQuasar()
		const deals_store = useDealsStore()
		const sales_store = useSalesStore()
		const common_store = useCommonStore()
		const table = ref(null)

		const caps = ref([])
		const columns = [
			{ name: "id", label: "#ID", align: "left", field: "id", sortable: true, sort_type: "numeric" },
			{ name: "region", label: "Region", align: "left", sortable: true, sort_type: "string" },
			{ name: "country", label: "Country", align: "left", sortable: true, sort_type: "string" },
			{ name: "broker", label: "Broker", align: "left", sortable: true, sort_type: "numeric" },
			{ name: "payouts", label: "Payouts", align: "left", sortable: true, sort_type: "numeric" },
			{ name: "amount", label: "CAPs", align: "left", sortable: true, sort_type: "numeric" },
			{ name: "current_cap_count", label: "Current Count", align: "left", sortable: true, sort_type: "numeric" },
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
				country: [{
					id: row.country.id,
					text: row.country.iso + " - " + row.country.en_name
				}],
				split: response.data.items
			})

			common_store.setMetaField({
				field: "from_sales",
				value: {
					id: row.id,
					broker: {
						id: row.provider.id,
						name: row.provider.name
					}
				}
			})

			common_store.setSelectedTable("deals")

			Loading.hide()
		}

		const query = computed(() => sales_store.filter)

		const queryFilter = (rows, terms, cols, getCellValue) => {
			return _.filter(rows, (row) => {
				return (!!terms.id ? row.id.toString().includes(terms.id) : true) &&
					(!!terms.region && terms.region.length > 0 ? terms.region.map((r) => r.id).includes(row.provider.region.id) : true) &&
					(!!terms.country && terms.country.length > 0 ? terms.country.map((c) => c.id).includes(row.country.id) : true) &&
					(!!terms.provider && terms.provider.length > 0 ? terms.provider.map((p) => p.id).includes(row.provider.id) : true)
			})
		}

		const filter_component = ref(null)

		const table_height = computed(() =>
			$q.screen.height - (filter_component.value ? filter_component.value.$el.clientHeight : 0) - 46
		)

		const numeric_sort = columns.filter((c) => c.sortable && c.sort_type === "numeric")
			.map((c) => c.name)

		const string_sort = columns.filter((c) => c.sortable && c.sort_type === "string")
			.map((c) => c.name)

		const sortSales = (rows, sortBy, descending) => {
			const data = [...rows]

			if (sortBy) {
				data.sort((a, b) => {
					const x = descending ? b : a
					const y = descending ? a : b

					if (string_sort.includes(sortBy)) {
						if (sortBy === "region") {
							return x["provider"]["region"]["name"] > y["provider"]["region"]["name"] ?
								1 :
								x["provider"]["region"]["name"] < y["provider"]["region"]["name"] ? -1 : 0
						}
						if (sortBy === "country") {
							return x["country"]["en_name"] > y["country"]["en_name"] ?
								1 :
								x["country"]["en_name"] < y["country"]["en_name"] ? -1 : 0
						}
						return x[ sortBy ] > y[ sortBy ] ? 1 : x[ sortBy ] < y[ sortBy ] ? -1 : 0
					}

					if (numeric_sort.includes(sortBy)) {
						if (sortBy === "broker") {
							return parseFloat(x["provider_id"]) - parseFloat(y["provider_id"])
						}
						return parseFloat(x[ sortBy ]) - parseFloat(y[ sortBy ])
					}

				})
			}

			return data
		}

		const cap_count = computed(() => table.value ?
			table.value.computedRows.reduce((carry, c) => carry + c.amount, 0)
			: 0
		)

		const current_cap_count = computed(() => table.value ?
			table.value.computedRows.reduce((carry, c) => carry + c.current_cap_count, 0)
			: 0
		)

		const capsChanged = async ({ row, value }) => {
			Loading.show()

			const response = await api.post("/affiliateCaps/process", {
				field: "caps",
				row,
				value
			})

			const cap = caps.value.find((c) => c.id === row.id)

			cap.id = response.data.id
			cap.amount = response.data.amount

			Loading.hide()
		}

		return {
			loading,
			caps,
			pagination,
			columns,
			showDeals,
			table_height,
			filter_component,
			query,
			queryFilter,
			sortSales,
			table,
			cap_count,
			current_cap_count,
			capsChanged
		}
	}
}
</script>
