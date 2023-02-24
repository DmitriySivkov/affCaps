<template>
	{{ row[col.name] }}
	<q-popup-edit
		ref="caps_edit"
		:disable="is_updating"
		:model-value="caps"
		:validate="val => val > 0"
		v-slot="scope"
		@update:model-value="changeCaps"
		@keyup.enter="caps_edit.set()"
	>
		<q-input
			autofocus
			dense
			type="number"
			hint="Enter new caps value"
			v-model.number="scope.value"
			:model-value="scope.value"
			:rules="[
				val => scope.validate(val) || 'Caps cannot be zero or below'
			]"
		/>
	</q-popup-edit>
	<q-inner-loading :showing="is_updating">
		<q-spinner-gears
			class="text-left"
			color="primary"
			size="24px"
		/>
	</q-inner-loading>
</template>

<script>
import { ref } from "vue"
import { api } from "src/boot/axios"
export default {
	props: {
		row: Object,
		col: Object
	},
	emits: ["change"],
	setup(props, { emit }) {
		const caps_edit = ref(null)
		const caps = ref(props.row.amount)

		const is_updating = ref(false)

		const changeCaps = async(value) => {
			is_updating.value = true

			const response = await api.post("/affiliateCaps/process", {
				field: "caps",
				row: props.row,
				value
			})

			is_updating.value = false

			emit("change", {
				old_cap: props.row,
				new_cap: response.data
			})
		}

		return {
			caps,
			changeCaps,
			caps_edit,
			is_updating
		}
	}
}
</script>
