<template>
	<KeepAlive>
		<component :is="getTableComponent()" />
	</KeepAlive>
</template>

<script>
import SalesTable from "src/components/sales/SalesTable.vue"
import DealsTable from "src/components/deals/DealsTable.vue"
import { useCommonStore } from "src/stores/common"
import { computed } from "vue"
export default {
	components: {
		SalesTable,
		DealsTable
	},
	setup() {
		const common_store = useCommonStore()
		const selected_table = computed(() => common_store.selected_table)

		const getTableComponent = () => {
			switch (selected_table.value) {
			case "sales":
				return "SalesTable"
			case "deals":
				return "DealsTable"
			}
		}

		return {
			selected_table,
			getTableComponent
		}
	}
}
</script>
