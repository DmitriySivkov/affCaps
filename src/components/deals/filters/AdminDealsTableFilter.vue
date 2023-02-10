<template>
	<q-card
		style="min-height: 9vh"
		class="q-pa-sm row q-col-gutter-sm"
	>
		<div class="col-md-3">
			<q-input
				label="#ID"
				outlined
				:model-value="modelValue.id"
				@update:model-value="queryChanged($event, 'id')"
			/>
		</div>
	</q-card>
</template>

<script>
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
		return {
			queryChanged
		}
	}
}
</script>
