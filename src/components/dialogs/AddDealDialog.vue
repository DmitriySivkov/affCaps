<template>
	<q-dialog
		ref="dialogRef"
		@hide="onDialogHide"
	>
		<div>
			<q-form
				greedy
				no-error-focus
				@submit="onSubmit"
				@reset="onReset"
			>
				<q-card class="row full-width">
					<q-card-section class="col-12 q-pt-md q-pb-none q-px-sm">
						<q-select
							clearable
							filled
							autocomplete="do-not-autofill"
							label="Region*"
							@filter="searchRegion"
							:options="regions"
							option-value="id"
							option-label="text"
							input-debounce="0"
							use-input
							:model-value="deal.region"
							v-model="deal.region"
							lazy-rules
							:rules="[
								(val) => !!val || 'Region is required'
							]"
						/>
					</q-card-section>
					<q-card-section class="col-12 q-px-sm q-py-none">
						<q-select
							clearable
							filled
							autocomplete="do-not-autofill"
							label="Country*"
							@filter="searchCountry"
							:options="countries"
							option-value="id"
							option-label="text"
							input-debounce="0"
							use-input
							:model-value="deal.country"
							v-model="deal.country"
							lazy-rules
							:rules="[
								(val) => !!val || 'Country is required'
							]"
						/>
					</q-card-section>
					<q-card-section class="col-12 q-px-sm q-py-none">
						<q-select
							clearable
							filled
							label="Affiliate*"
							@filter="searchWebmaster"
							:options="affiliates"
							option-value="id"
							option-label="text"
							input-debounce="1000"
							use-input
							:model-value="deal.affiliate"
							v-model="deal.affiliate"
							lazy-rules
							:rules="[
								(val) => !!val || 'Affiliate is required'
							]"
						/>
					</q-card-section>
					<q-card-section class="col-5 q-py-none q-pl-sm q-pr-xs">
						<q-input
							clearable
							filled
							label="Payouts"
							type="number"
							:model-value="deal.deduction"
							v-model.number="deal.deduction"
						/>
					</q-card-section>
					<q-card-section class="col-7 q-py-none q-pr-sm q-pl-xs">
						<q-input
							clearable
							filled
							label="CAPs*"
							type="number"
							:model-value="deal.amount"
							v-model.number="deal.amount"
							lazy-rules
							:rules="[
								(val) => !!val || 'CAPs is required',
								(val) => val !== 0 || 'CAPs can not be 0',
							]"
						/>
					</q-card-section>
					<q-card-section class="col-5 q-py-none q-pl-sm q-pr-xs">
						<q-input
							clearable
							filled
							label="%*"
							type="number"
							:model-value="deal.percent"
							v-model.number="deal.percent"
							lazy-rules
							:rules="[
								(val) => !!val || '% is required'
							]"
						/>
					</q-card-section>
					<q-card-section class="col-7 q-py-none q-pr-sm q-pl-xs">
						<q-input
							clearable
							filled
							label="Source*"
							:model-value="deal.source"
							v-model.number="deal.source"
							lazy-rules
							:rules="[
								(val) => !!val || 'Source is required'
							]"
						/>
					</q-card-section>
					<q-card-section class="col-12 q-px-sm q-py-none">
						<q-input
							clearable
							filled
							label="Funnel*"
							:model-value="deal.funnel"
							v-model.number="deal.funnel"
							lazy-rules
							:rules="[
								(val) => !!val || 'Funnel is required'
							]"
						/>
					</q-card-section>
					<q-card-section class="col-12 q-px-sm q-py-none">
						<q-input
							clearable
							filled
							label="Experience*"
							type="textarea"
							rows="3"
							:model-value="deal.experience"
							v-model.number="deal.experience"
							lazy-rules
							:rules="[
								(val) => !!val || 'Experience is required'
							]"
						/>
					</q-card-section>
					<q-card-section class="col-12 q-px-sm q-py-none">
						<q-input
							clearable
							filled
							label="Comment*"
							type="textarea"
							rows="3"
							:model-value="deal.comment"
							v-model.number="deal.comment"
							lazy-rules
							:rules="[
								(val) => !!val || 'Comment is required'
							]"
						/>
					</q-card-section>
					<q-separator class="full-width" />
					<q-card-section class="col-12 q-px-sm q-py-sm">
						<div class="row justify-center q-col-gutter-sm">
							<div class="col-6">
								<q-btn
									class="full-width"
									label="Submit"
									type="submit"
									color="primary"
								/>
							</div>
							<div class="col-6">
								<q-btn
									flat
									class="full-width"
									label="Cancel"
									type="reset"
									color="primary"
								/>
							</div>
						</div>
					</q-card-section>
					<q-inner-loading :showing="is_saving">
						<q-spinner-gears
							size="50px"
							color="primary"
						/>
					</q-inner-loading>
				</q-card>
			</q-form>
		</div>
	</q-dialog>
</template>

<script>
import { ref } from "vue"
import { useDialogPluginComponent} from "quasar"
import { useCommonStore } from "src/stores/common"
import { api } from "src/boot/axios"
export default {
	props: {},

	emits: [
		...useDialogPluginComponent.emits,
	],

	setup (props, { emit }) {
		const { dialogRef, onDialogHide, onDialogOK, onDialogCancel } = useDialogPluginComponent()

		const common_store = useCommonStore()

		const deal = ref({
			region: null,
			country: null,
			affiliate: null,
			deduction: null,
			amount: null,
			percent: null,
			source: null,
			funnel: null,
			experience: null,
			comment: null
		})

		const regions = ref(common_store.regions)
		const countries = ref(common_store.countries)
		const affiliates = ref([])

		const is_saving = ref(false)

		const searchCountry = (val, update) => {
			if (val === "") {
				update(() =>
					countries.value = common_store.countries
				)
				return
			}

			update(() => {
				const needle = val.toLowerCase()
				countries.value = common_store.countries.filter((c) => c.text.toLowerCase().indexOf(needle) > -1)
			})
		}

		const searchRegion = (val, update) => {
			if (val === "") {
				update(() =>
					regions.value = common_store.regions
				)
				return
			}

			update(() => {
				const needle = val.toLowerCase()
				regions.value = common_store.regions.filter((r) => r.text.toLowerCase().indexOf(needle) > -1)
			})
		}

		const searchWebmaster = async(query, update) => {
			if (query.length < 1) return

			const response = await api.get("/affiliateCaps/users", {
				params: {
					q: query,
					filter: {
						state: "active"
					},
					role: "webmaster",
					// exclude: this.selectedAffiliates // todo - exclude selected affiliates
				}
			})

			update(() => {
				affiliates.value = response.data.items
			})

		}

		const onSubmit = async() => {
			is_saving.value = true

			const response = await api.post("/affiliateCaps", {
				region_id: deal.value.region.id,
				country_id: deal.value.country.id,
				affiliate_id: deal.value.affiliate.id,
				amount: -deal.value.amount,
				deduction: deal.value.deduction,
				percent: deal.value.percent,
				source: deal.value.source,
				funnel: deal.value.funnel,
				experience: deal.value.experience,
				comment: deal.value.comment
			})

			is_saving.value = false

			onDialogOK(response.data)
		}

		const onReset = () => {
			onDialogCancel()
		}

		return {
			// This is REQUIRED;
			// Need to inject these (from useDialogPluginComponent() call)
			// into the vue scope for the vue html template
			dialogRef,
			onDialogHide,
			searchRegion,
			searchCountry,
			searchWebmaster,
			deal,
			regions,
			countries,
			affiliates,
			onReset,
			onSubmit,
			is_saving
		}
	}
}
</script>

<style scoped>
.q-field--with-bottom {
	padding-bottom: 25px
}
</style>
