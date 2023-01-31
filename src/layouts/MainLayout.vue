<template>
	<q-layout view="lHh Lpr lFf">
		<MainHeader />
		<q-page-container>
			<router-view />
		</q-page-container>
	</q-layout>
</template>

<script>
import MainHeader from "src/layouts/MainHeader.vue"
export default {
	components: { MainHeader },
}
</script>
