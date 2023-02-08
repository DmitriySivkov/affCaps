import { useUserStore } from "src/stores/user"
import { computed } from "vue"

export const useUser = () => {
	const user_store = useUserStore()

	const is_logged = computed(() => !!user_store.data.api_token)

	const hasRole = (role_id) => {
		if (!is_logged.value)
			return

		return user_store.data.roles.find((r) => r.id === role_id)
	}

	return {
		hasRole,
		is_logged
	}
}
