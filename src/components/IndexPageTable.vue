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
					v-for="col in props.cols"
					:key="col.name"
					:props="props"
				>
					{{ col.label }}
				</q-th>
			</q-tr>
		</template>

		<template v-slot:body-cell="props">
			<component
				:is="setCellComponent(props)"
				:props="props"
			></component>
		</template>
	</q-table>
</template>

<script>
import { ref } from "vue"
import { api } from "src/boot/axios"
import StandardCell from "src/components/StandardCell.vue"
import ScheduleCell from "src/components/ScheduleCell.vue"
import PayoutsCell from "src/components/PayoutsCell.vue"
import ManagerCell from "src/components/ManagerCell.vue"
import BrokerCell from "src/components/BrokerCell.vue"
export default {
	components: {
		StandardCell,
		ScheduleCell,
		PayoutsCell,
		ManagerCell,
		BrokerCell
	},
	setup() {
		const caps = ref([])
		const columns = [
			{ name: "id", label: "#ID", field: row => row.id, align: "left", sortable: true },
			{ name: "region", label: "Region", field: row => row.provider.region.name, align: "left", sortable: true },
			{ name: "country", label: "Country", field: row => row.country.iso + " - " + row.country.en_name, align: "left", sortable: true },
			{ name: "broker", label: "Broker", field: "broker", align: "left" },
			{ name: "payouts", label: "Payouts", field: "payouts", align: "left" },
			{ name: "caps", label: "CAPs", field: row => row.amount, align: "left" },
			{ name: "current_count", label: "Current Count", field: row => row.current_cap_count, align: "left" },
			{ name: "working_hours", label: "Working Hours (today)", field: "working_hours", align: "left" },
			{ name: "manager", label: "Manager", field: row => row.amount, align: "left" },
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
					offset += 20
					await fetchData()
				}
			}

			await fetchData()

			loading.value = false
		}

		loadData()

		const setCellComponent = (props) => {
			if (props.col.name === "working_hours") {
				return "ScheduleCell"
			}
			if (props.col.name === "payouts") {
				return "PayoutsCell"
			}
			if (props.col.name === "manager") {
				return "ManagerCell"
			}
			if (props.col.name === "broker") {
				return "BrokerCell"
			}
			return "StandardCell"
		}


		return {
			loading,
			caps,
			pagination,
			columns,
			setCellComponent
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
