<template>
	<q-list>
		<q-item
			v-if="can_see_sales"
			clickable
			:active="selected_table === 'sales'"
			active-class="bg-secondary text-white"
			v-ripple
			@click="toggleTable('sales')"
		>
			<q-item-section avatar>
				<q-icon name="view_list" />
			</q-item-section>
			<q-item-section>
				Sales
			</q-item-section>
		</q-item>

		<q-item
			clickable
			:active="selected_table === 'deals'"
			active-class="bg-secondary text-white"
			v-ripple
			@click="toggleTable('deals')"
		>
			<q-item-section avatar>
				<q-icon name="view_list" />
			</q-item-section>
			<q-item-section>
				Deals
			</q-item-section>
		</q-item>

		<q-item
			v-if="is_from_sales"
			clickable
			:active="selected_table === 'deals'"
			active-class="bg-accent text-white"
			v-ripple
			@click="backToSales"
		>
			<q-item-section avatar>
				<q-icon name="keyboard_return" />
			</q-item-section>
			<q-item-section>
				Sales: {{ "#" + common_store.meta.from_sales.id }} <br />
				Broker {{ "#" + common_store.meta.from_sales.broker.id + " - " + common_store.meta.from_sales.broker.name }}
			</q-item-section>
		</q-item>
	</q-list>
</template>

<script>
import { computed } from "vue"
import { useUser } from "src/composables/user"
import { useCommonStore } from "src/stores/common"
import { useSalesStore } from "src/stores/sales"
import { useDealsStore } from "src/stores/deals"
export default {
	setup() {
		const common_store = useCommonStore()
		const sales_store = useSalesStore()
		const deals_store = useDealsStore()

		const { hasRole } = useUser()

		const can_see_sales = computed(() => !!hasRole(1) || !!hasRole(4) || !!hasRole(7))

		const selected_table = computed(() => common_store.selected_table)

		const is_from_sales = computed(() => !!common_store.meta.from_sales)

		const toggleTable = (table_name) => {
			common_store.setSelectedTable(table_name)
		}

		const backToSales = () => {
			sales_store.setFilterField({
				field: "id",
				value: common_store.meta.from_sales.id
			})

			common_store.removeMetaField("from_sales")

			deals_store.setFilter({})

			toggleTable("sales")
		}

		return {
			selected_table,
			toggleTable,
			backToSales,
			can_see_sales,
			is_from_sales,
			common_store
		}
	}
}
</script>
