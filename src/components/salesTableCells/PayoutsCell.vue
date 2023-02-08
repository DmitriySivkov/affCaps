<template>
	{{ payouts }}
</template>

<script>
export default {
	props: {
		row: Object,
		col: Object
	},
	setup(props) {
		const deduction = props.row.provider.deductions.find((d) => d.country_id === props.row.country_id)
		const payouts = deduction ? deduction.network_deduction : ""

		return {
			payouts
		}
	}
}
</script>
