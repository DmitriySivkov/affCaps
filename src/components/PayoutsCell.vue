<template>
	<q-td auto-width>
		{{ payouts }}
	</q-td>
</template>

<script>
export default {
	props: {
		props: Object
	},
	setup(props) {
		const deduction = props.props.row.provider.deductions.find((d) => d.country_id === props.props.row.country_id)
		const payouts = deduction ? deduction.network_deduction : ""

		return {
			payouts
		}
	}
}
</script>
