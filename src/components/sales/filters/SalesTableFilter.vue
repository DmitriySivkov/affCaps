<template>
	<q-card class="q-pa-xs row q-col-gutter-xs">
		<div class="col-md-1">
			<q-input
				dense
				clearable
				label="#ID"
				filled
				:model-value="sales_store.filter.id"
				@update:model-value="queryChanged($event, 'id')"
			/>
		</div>
		<div class="col-md-3">
			<q-select
				dense
				clearable
				filled
				multiple
				label="Region"
				@filter="searchRegion"
				:options="region_options"
				option-value="id"
				option-label="text"
				input-debounce="0"
				use-input
				use-chips
				:model-value="sales_store.filter.region"
				@update:model-value="queryChanged($event, 'region')"
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
		<div class="col-md-3">
			<q-select
				dense
				clearable
				filled
				multiple
				label="Country"
				@filter="searchCountry"
				:options="country_options"
				option-value="id"
				option-label="text"
				input-debounce="0"
				use-input
				use-chips
				:model-value="sales_store.filter.country"
				@update:model-value="queryChanged($event, 'country')"
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
		<div class="col-md-5">
			<q-select
				dense
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
	</q-card>
</template>

<script>
import { api } from "src/boot/axios"
import { ref } from "vue"
import { useSalesStore } from "src/stores/sales"
import { useCommonStore } from "src/stores/common"
export default {
	setup() {
		const common_store = useCommonStore()
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

		let region_options = ref(common_store.regions)

		const searchRegion = (val, update) => {
			if (val === "") {
				update(() =>
					region_options.value = common_store.regions
				)
				return
			}

			update(() => {
				const needle = val.toLowerCase()
				region_options.value = common_store.regions.filter((r) => r.text.toLowerCase().indexOf(needle) > -1)
			})
		}

		let country_options = ref(common_store.countries)

		const searchCountry = (val, update) => {
			if (val === "") {
				update(() =>
					country_options.value = common_store.countries
				)
				return
			}

			update(() => {
				const needle = val.toLowerCase()
				country_options.value = common_store.countries.filter((c) => c.text.toLowerCase().indexOf(needle) > -1)
			})
		}

		return {
			queryChanged,
			searchProvider,
			searchRegion,
			searchCountry,
			provider_options,
			sales_store,
			region_options,
			country_options
		}
	}
}
</script>
