<template>
	<q-layout view="lHh Lpr lFf">
		<MainHeader />
		<q-page-container v-if="is_logged">
			<q-page style="height:1px">
				<router-view />
			</q-page>
		</q-page-container>
	</q-layout>
</template>

<script>
import MainHeader from "src/layouts/MainHeader.vue"
import { useUser } from "src/composables/user"
export default {
	components: { MainHeader },
	setup() {
		const { is_logged } = useUser()

		return {
			is_logged
		}
	}
}
</script>
