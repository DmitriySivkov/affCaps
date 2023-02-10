import { LocalStorage } from "quasar"
import { useUserStore } from "src/stores/user"
import { useCommonStore } from "src/stores/common"
import { useNotification } from "src/composables/notification"
import { Loading } from "quasar"
import { useUser } from "src/composables/user"

export default async({ store, router }) => {
	const common_store = useCommonStore(store)
	const user_store = useUserStore(store)
	const { hasRole } = useUser()
	const { notifySuccess, notifyError } = useNotification()

	let api_token = LocalStorage.getItem("api_token")

	if (api_token) {
		Loading.show({ spinnerColor: "primary" })

		await user_store.login(api_token)
			.then((response) => {
				user_store.setUserData(response.data)

				if (hasRole(4)) {
					common_store.setSelectedTable("sales")
				}

				if (hasRole(5)) {
					common_store.setSelectedTable("deals")
				}

				notifySuccess("Добро пожаловать")
			})
			.catch((error) => {
				let error_text = "Ошибка сервиса авторизации"

				if (error.response.status === 401)
					error_text = "Пользователь не найден"

				notifyError(error_text)
			})

		Loading.hide()
	}
}
