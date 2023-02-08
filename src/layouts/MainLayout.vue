<template>
	<q-layout view="lHh Lpr lFf">
		<MainHeader />
		<q-page-container v-if="is_logged">
			<router-view />
		</q-page-container>
		<MainFooter />
	</q-layout>
</template>

<script>
import MainHeader from "src/layouts/MainHeader.vue"
import MainFooter from "src/layouts/MainFooter.vue"
import { useUser } from "src/composables/user"
export default {
	components: { MainHeader, MainFooter },
	setup() {
		const { is_logged } = useUser()

		return {
			is_logged
		}
	}
}
</script>
