<template>
	<span v-if="!!working_hours">
		<a :href="backend_url + '/admin/providers/' + row.provider_id + (is_weekend ? '/weekend-schedules/' : '/schedules/') + row.provider_schedule_id + '/edit'">
			{{ working_hours + (!!breaking_hours ? " (break: " + breaking_hours + ")" : "") }}
		</a>
	</span>
</template>

<script>
export default {
	props: {
		row: Object,
		col: Object,
	},
	setup(props) {
		const getCurrentWeekday = () => {
			const weekdays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
			return weekdays[new Date().getDay()]
		}

		const backend_url = process.env.BACKEND_SERVER

		const is_weekend = ["Saturday", "Sunday"].includes(getCurrentWeekday())

		const working_hours = props.row.provider_schedule ? (props.row.provider_schedule.hasOwnProperty("all_day") ?
			"All day" :
			props.row.provider_schedule.time_start + " - " + props.row.provider_schedule.time_end
		) : ""

		const breaking_hours = props.row.provider_schedule ? (props.row.provider_schedule.break_start && props.row.provider_schedule.break_end ?
			props.row.provider_schedule.break_start + " - " + props.row.provider_schedule.break_end :
			""
		) : ""

		return {
			working_hours,
			breaking_hours,
			is_weekend,
			backend_url
		}
	}
}
</script>
