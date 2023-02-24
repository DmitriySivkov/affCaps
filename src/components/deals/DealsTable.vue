<template>
	<AdminDealsTable v-if="!!hasRole(1) || !!hasRole(7)" />
	<SalesDealsTable v-if="!!hasRole(4)" />
	<WebDealsTable v-if="!!hasRole(5)" />
</template>

<script>
import AdminDealsTable from "src/components/deals/tables/AdminDealsTable.vue"
import SalesDealsTable from "src/components/deals/tables/SalesDealsTable.vue"
import WebDealsTable from "src/components/deals/tables/WebDealsTable.vue"
import { useUser } from "src/composables/user"
export default {
	components: {
		AdminDealsTable,
		SalesDealsTable,
		WebDealsTable
	},
	setup() {
		const { hasRole } = useUser()

		return {
			hasRole
		}
	}
}
</script>
