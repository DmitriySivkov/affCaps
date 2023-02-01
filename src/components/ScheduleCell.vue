<template>
	<q-td auto-width>
		<span v-html="schedule"></span>
	</q-td>
</template>

<script>
export default {
	props: {
		props: Object
	},
	setup(props) {
		const getSchedule = () => {
			const working_hours = props.props.row.provider_schedule ? (props.props.row.provider_schedule.hasOwnProperty("all_day") ?
				"All day" :
				props.props.row.provider_schedule.time_start + " - " + props.props.row.provider_schedule.time_end
			) : ""

			const breaking_hours = props.props.row.provider_schedule ? (props.props.row.provider_schedule.break_start && props.props.row.provider_schedule.break_end ?
				props.props.row.provider_schedule.break_start + " - " + props.props.row.provider_schedule.break_end :
				""
			) : ""

			return !!working_hours ?
				"<a href='" + process.env.BACKEND_SERVER + "/admin/providers/" + props.props.row.provider_id + "/schedules/" + props.props.row.provider_schedule_id + "'>" +
				working_hours + (!!breaking_hours ? " (break: " + breaking_hours + ")" : "") + "</a>"
				: ""
		}

		const schedule = getSchedule()

		return {
			schedule
		}
	}
}
</script>
