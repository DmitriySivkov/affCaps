import { LocalStorage } from "quasar"
import { useUserStore } from "src/stores/user"
import { useNotification } from "src/composables/notification"
import { Loading } from "quasar"

export default async({ store, router }) => {
	const user_store = useUserStore(store)
	const { notifySuccess, notifyError } = useNotification()

	let api_token = LocalStorage.getItem("api_token")

	if (api_token) {
		Loading.show({ spinnerColor: "primary" })
		await user_store.login(api_token)
			.then((response) => {
				user_store.setUserData(response.data)
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
