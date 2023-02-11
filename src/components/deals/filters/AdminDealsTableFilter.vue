<template>
	<q-card class="q-pa-sm row q-col-gutter-sm">
		<div class="col-md-2">
			<q-input
				label="#ID"
				filled
				:model-value="modelValue.id"
				@update:model-value="queryChanged($event, 'id')"
			/>
		</div>
		<div class="col-md-2">
			<q-input
				label="Region"
				filled
				:model-value="modelValue.region"
				@update:model-value="queryChanged($event, 'region')"
			/>
		</div>
		<div class="col-md-2">
			<q-input
				label="Country"
				filled
				:model-value="modelValue.country"
				@update:model-value="queryChanged($event, 'country')"
			/>
		</div>
		<div class="col-md-2">
			<q-input
				label="Affiliate"
				filled
				:model-value="modelValue.affiliate"
				@update:model-value="queryChanged($event, 'affiliate')"
			/>
		</div>
		<div class="col-md-2">
			<q-select
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
				:model-value="modelValue.split"
				@update:model-value="queryChanged($event, 'split')"
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
		<div class="col-md-2">
			<q-select
				clearable
				filled
				label="Status"
				:options="['Wait for setup', 'Wait for traffic', 'Active', 'Decline', 'Need resetup asap']"
				:model-value="modelValue.status_sale"
				@update:model-value="queryChanged($event, 'status_sale')"
			/>
		</div>
	</q-card>
</template>

<script>
import { api } from "src/boot/axios"
import { ref } from "vue"
export default {
	props: {
		modelValue: Object,
	},
	setup(props, { emit }) {
		const queryChanged = (value, field) => {
			let result = props.modelValue
			result[field] = value
			emit("update:modelValue", result)
		}

		const split_options = ref([])

		const searchSplit = async (query, update) => {
			if (query.length < 1)
				return

			const response = await api.get("/affiliateCaps/splits", {
				params: {
					q: query,
					// providers: [
					// 	this.providerId
					// ],
					// countries: [
					// 	this.countryId
					// ]
				}
			})

			update(() => {
				split_options.value = response.data.items
			})

		}

		return {
			queryChanged,
			searchSplit,
			split_options
		}
	}
}
</script>
