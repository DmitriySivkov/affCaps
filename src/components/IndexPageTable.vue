<template>
	<q-table
		style="height:50vh"
		:loading="loading"
		:rows="caps"
		:columns="columns"
		row-key="id"
		:rows-per-page-options="[0]"
		:pagination="pagination"
		virtual-scroll
	>
	</q-table>
</template>

<script>
import { ref } from "vue"
import { api } from "src/boot/axios"
export default {
	setup() {
		const caps = ref([])
		const columns = [
			{ name: "id", label: "#", field: row => row.id },
			{ name: "provider_id", label: "Provider", field: row => row.id },
			{ name: "country_id", label: "Country", field: row => row.id },
			{ name: "amount", label: "Amount", field: row => row.id },
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

		return {
			loading,
			caps,
			pagination,
			columns
		}
	}
}
</script>
