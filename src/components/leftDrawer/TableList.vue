<template>
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
				label: "Deals",
				name: "deals",
			},
		]

		const common_store = useCommonStore()

		const { hasRole } = useUser()

		const can_see_sales = computed(() => hasRole(1) || hasRole(4) || hasRole(7))

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
			thumb_style,
		}
	}
}
</script>
