<template>
	{{ row[col.name] }}
	<q-popup-edit
		:model-value="caps"
		:validate="val => val > 0"
		v-slot="scope"
		@update:model-value="capsChanged"
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
		>
			<template v-slot:after>
				<q-btn
					flat
					dense
					color="negative"
					icon="cancel"
					@click.stop.prevent="scope.cancel"
				/>

				<q-btn
					flat
					dense
					color="positive"
					icon="check_circle"
					@click.stop.prevent="scope.set"
					:disable="scope.validate(scope.value) === false || scope.initialValue === scope.value"
				/>
			</template>
		</q-input>
	</q-popup-edit>
</template>

<script>
import { ref } from "vue"
export default {
	props: {
		row: Object,
		col: Object
	},
	emits: ["change"],
	setup(props, { emit }) {
		const caps = ref(props.row.amount)

		const capsChanged = (value) => {
			emit("change", {
				row: props.row,
				value
			})
		}

		return {
			caps,
			capsChanged
		}
	}
}
</script>
