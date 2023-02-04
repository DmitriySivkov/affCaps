<template>
	<span v-html="schedule"></span>
</template>

<script>
export default {
	props: {
		row: Object,
		col: Object,
	},
	setup(props) {
		const getSchedule = () => {
			const working_hours = props.row.provider_schedule ? (props.row.provider_schedule.hasOwnProperty("all_day") ?
				"All day" :
				props.row.provider_schedule.time_start + " - " + props.row.provider_schedule.time_end
			) : ""

			const breaking_hours = props.row.provider_schedule ? (props.row.provider_schedule.break_start && props.row.provider_schedule.break_end ?
				props.row.provider_schedule.break_start + " - " + props.row.provider_schedule.break_end :
				""
			) : ""

			return !!working_hours ?
				"<a href='" + process.env.BACKEND_SERVER + "/admin/providers/" + props.row.provider_id + "/schedules/" + props.row.provider_schedule_id + "'>" +
				working_hours + (!!breaking_hours ? " (break: " + breaking_hours + ")" : "") + "</a>"
				: ""
		}

		const getCurrentWeekday = () => {
			const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
			return weekdays[new Date().getDay()]
		}

		const schedule = getSchedule()
		const weekday = getCurrentWeekday()

		return {
			schedule
		}
	}
}
</script>
