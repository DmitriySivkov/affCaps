<template>
	<q-scroll-area
		visible
		style="height: 20%"
		:thumb-style="thumb_style"
	>
		<q-list>
			<template
				v-for="(item, index) in menu"
				:key="index"
			>
				<q-item
					v-if="!item.hasOwnProperty('show') || item.show()"
					clickable
					:active="item.name === selected_table"
					active-class="bg-secondary text-white"
					v-ripple
					@click="toggleTable(item.name)"
				>
					<q-item-section avatar>
						<q-icon :name="item.icon" />
					</q-item-section>
					<q-item-section>
						{{ item.label }}
					</q-item-section>
				</q-item>
			</template>
		</q-list>
	</q-scroll-area>
</template>

<script>
import { computed } from "vue"
import { useUser } from "src/composables/user"
import { useCommonStore } from "src/stores/common"
export default {
	setup() {
		const menu = [
			{
				icon: "view_list",
				label: "Sales",
				name: "sales",
				show: () => can_see_sales.value
			},
			{
				icon: "view_list",
				label: "Affiliate",
				name: "affiliate",
				show: () => can_see_affiliates.value
			},
			{
				icon: "view_list",
				label: "Sales deals",
				name: "sales_deals"
			},
			{
				icon: "view_list",
				label: "Test view 1",
				name: "test_1"
			},
			{
				icon: "view_list",
				label: "Test view 2",
				name: "test_2"
			},
			{
				icon: "view_list",
				label: "Test view 3",
				name: "test_3"
			},
		]

		const common_store = useCommonStore()

		const { hasRole } = useUser()

		const can_see_sales = computed(() => hasRole(1) || hasRole(4) || hasRole(7))
		const can_see_affiliates = computed(() => hasRole(1) || hasRole(5) || hasRole(7))

		const selected_table = computed(() => common_store.selected_table)

		const toggleTable = (table_name) => {
			common_store.setSelectedTable(table_name)
		}

		const thumb_style = {
			width: "5px",
		}

		return {
			menu,
			selected_table,
			toggleTable,
			can_see_sales,
			can_see_affiliates,
			thumb_style,
		}
	}
}
</script>
