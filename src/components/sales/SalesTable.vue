<template>
	<q-table
		class="sticky-header-table"
		style="height:94vh"
		:loading="loading"
		:rows="caps"
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
import StandardCell from "src/components/sales/cells/StandardCell.vue"
import ScheduleCell from "src/components/sales/cells/ScheduleCell.vue"
import PayoutsCell from "src/components/sales/cells/PayoutsCell.vue"
import ManagerCell from "src/components/sales/cells/ManagerCell.vue"
import BrokerCell from "src/components/sales/cells/BrokerCell.vue"
import RegionCell from "src/components/sales/cells/RegionCell.vue"
import CountryCell from "src/components/sales/cells/CountryCell.vue"
export default {
	components: {
		StandardCell,
		RegionCell,
		CountryCell,
		ScheduleCell,
		PayoutsCell,
		ManagerCell,
		BrokerCell
	},
	setup() {
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
			{ name: "manager", label: "Manager", align: "left" },
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

		return {
			loading,
			caps,
			pagination,
			columns,
			getCell
		}
	}
}
</script>