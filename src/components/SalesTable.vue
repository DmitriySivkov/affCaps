<template>
	<q-table
		class="sticky-header-table"
		style="height:90vh"
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
import StandardCell from "src/components/salesTableCells/StandardCell.vue"
import ScheduleCell from "src/components/salesTableCells/ScheduleCell.vue"
import PayoutsCell from "src/components/salesTableCells/PayoutsCell.vue"
import ManagerCell from "src/components/salesTableCells/ManagerCell.vue"
import BrokerCell from "src/components/salesTableCells/BrokerCell.vue"
import RegionCell from "src/components/salesTableCells/RegionCell.vue"
import CountryCell from "src/components/salesTableCells/CountryCell.vue"
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
						refreshType: "advManager",
						offset,
					}
				})
				if (response.data.caps.length > 0) {
					caps.value = [...caps.value, ...response.data.caps]
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
