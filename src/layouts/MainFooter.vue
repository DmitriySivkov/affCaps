<template>
	<q-footer elevated>
		<q-toolbar class="q-col-gutter-sm q-pa-sm">
			<div
				v-if="can_see_sales"
				class="col-shrink"
			>
				<q-btn
					flat
					label="Sales"
					@click="toggleTable(1)"
					:class="{'bg-secondary': selected_table === 1}"
				/>
			</div>
			<div
				v-if="can_see_affiliates"
				class="col-shrink"
			>
				<q-btn
					flat
					label="Affiliate"
					@click="toggleTable(2)"
					:class="{'bg-secondary': selected_table === 2 || !can_see_sales}"
				/>
			</div>
		</q-toolbar>
	</q-footer>
</template>

<script>
import { ref, computed } from "vue"
import { useUser } from "src/composables/user"
export default {
	setup() {
		const { hasRole } = useUser()

		const can_see_sales = computed(() => hasRole(1) || hasRole(4) || hasRole(7))
		const can_see_affiliates = computed(() => hasRole(1) || hasRole(5) || hasRole(7))

		const selected_table = ref(1)
		const toggleTable = (option) => {
			selected_table.value = option
		}

		return {
			selected_table,
			toggleTable,
			can_see_sales,
			can_see_affiliates
		}
	}
}
</script>
