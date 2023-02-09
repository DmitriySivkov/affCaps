<template>
	<KeepAlive>
		<component :is="getTableComponent()"/>
	</KeepAlive>
</template>

<script>
import SalesTable from "src/components/SalesTable.vue"
import AffiliatesTable from "src/components/AffiliatesTable.vue"
import { useCommonStore } from "src/stores/common"
import { computed } from "vue"
export default {
	components: {
		SalesTable,
		AffiliatesTable
	},
	setup() {
		const common_store = useCommonStore()
		const selected_table = computed(() => common_store.selected_table)

		const getTableComponent = () => {
			switch (selected_table.value) {
			case "sales":
				return "SalesTable"
			case "affiliate":
				return "AffiliatesTable"
			}
		}

		return {
			selected_table,
			getTableComponent
		}
	}
}
</script>
