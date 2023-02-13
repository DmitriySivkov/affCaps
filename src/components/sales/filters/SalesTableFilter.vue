<template>
	<q-card class="q-pa-sm row q-col-gutter-sm">
		<div class="col-md-2">
			<q-input
				label="#ID"
				filled
				:model-value="sales_store.filter.id"
				@update:model-value="queryChanged($event, 'id')"
			/>
		</div>
		<div class="col-md-2">
			<q-input
				label="Region"
				filled
				:model-value="sales_store.filter.region"
				@update:model-value="queryChanged($event, 'region')"
			/>
		</div>
		<div class="col-md-2">
			<q-input
				label="Country"
				filled
				:model-value="sales_store.filter.country"
				@update:model-value="queryChanged($event, 'country')"
			/>
		</div>
		<div class="col-md-6">
			<q-select
				clearable
				filled
				multiple
				label="Broker"
				@filter="searchProvider"
				:options="provider_options"
				option-value="id"
				option-label="text"
				input-debounce="1000"
				use-input
				use-chips
				:model-value="sales_store.filter.provider"
				@update:model-value="queryChanged($event, 'provider')"
			>
				<template v-slot:selected-item="{opt, index, removeAtIndex}">
					<q-chip
						removable
						color="indigo-8"
						text-color="white"
						@remove="removeAtIndex(index)"
					>
						{{ opt.text }}
					</q-chip>
				</template>
			</q-select>
		</div>
	</q-card>
</template>

<script>
import { api } from "src/boot/axios"
import { ref } from "vue"
import { useSalesStore } from "src/stores/sales"
export default {
	setup() {
		const	sales_store = useSalesStore()

		const queryChanged = (value, field) => {
			sales_store.setFilterField({value, field})
		}

		const provider_options = ref([])

		const searchProvider = async (query, update) => {
			if (query.length < 1)
				return

			const response = await api.get("/affiliateCaps/providers", {
				params: {
					q: query,
				}
			})

			update(() => {
				provider_options.value = response.data.items
			})

		}

		return {
			queryChanged,
			searchProvider,
			provider_options,
			sales_store
		}
	}
}
</script>
