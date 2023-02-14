<template>
	<q-card class="q-pa-xs row q-col-gutter-xs">
		<div class="col-md-12">
			<q-select
				dense
				clearable
				filled
				multiple
				label="Split"
				@filter="searchSplit"
				:options="split_options"
				option-value="id"
				option-label="text"
				input-debounce="1000"
				use-input
				use-chips
				:model-value="deals_store.filter.split"
				@update:model-value="queryChanged($event, 'split')"
			>
				<template v-slot:selected-item="{opt, index, removeAtIndex}">
					<q-chip
						dense
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
		<div class="col-md-2">
			<q-input
				dense
				label="#ID"
				filled
				:model-value="deals_store.filter.id"
				@update:model-value="queryChanged($event, 'id')"
			/>
		</div>
		<div class="col-md-2">
			<q-input
				dense
				label="Region"
				filled
				:model-value="deals_store.filter.region"
				@update:model-value="queryChanged($event, 'region')"
			/>
		</div>
		<div class="col-md-2">
			<q-input
				dense
				label="Country"
				filled
				:model-value="deals_store.filter.country"
				@update:model-value="queryChanged($event, 'country')"
			/>
		</div>
		<div class="col-md-2">
			<q-input
				dense
				label="Affiliate"
				filled
				:model-value="deals_store.filter.affiliate"
				@update:model-value="queryChanged($event, 'affiliate')"
			/>
		</div>
		<div class="col-md-2">
			<q-select
				dense
				clearable
				filled
				label="Status"
				:options="['Wait for setup', 'Wait for traffic', 'Active', 'Decline', 'Need resetup asap']"
				:model-value="deals_store.filter.status_sale"
				@update:model-value="queryChanged($event, 'status_sale')"
			/>
		</div>
	</q-card>
</template>

<script>
import { api } from "src/boot/axios"
import { ref } from "vue"
import { useDealsStore } from "src/stores/deals"
export default {
	setup() {
		const	deals_store = useDealsStore()

		const queryChanged = (value, field) => {
			deals_store.setFilterField({value, field})
		}

		const split_options = ref([])

		const searchSplit = async (query, update) => {
			if (query.length < 1)
				return

			const response = await api.get("/affiliateCaps/splits", {
				params: {
					q: query,
				}
			})

			update(() => {
				split_options.value = response.data.items
			})

		}

		return {
			queryChanged,
			searchSplit,
			split_options,
			deals_store
		}
	}
}
</script>
