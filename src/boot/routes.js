import { useUserStore } from "src/stores/user"
import { Loading } from "quasar"

export default ({ store, router }) => {
	const user_store = useUserStore(store)
	router.beforeEach((to, from, next) => {
		if (to.name !== "auth" && !user_store.$state.data.api_token)
			next({name: "auth"})

		next()
	})
	Loading.hide()
}
