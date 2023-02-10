<template>
	<q-form @submit="onSubmit">
		<div class="row q-col-gutter-sm">
			<div class="col-12">
				<q-input
					v-model="key"
					filled
					label="API ключ"
					:lazy-rules="true"
				/>
			</div>
			<div class="col-12">
				<q-btn
					label="Войти"
					type="submit"
					color="primary"
					class="q-pa-lg full-width"
				/>
			</div>
		</div>
	</q-form>
</template>

<script>
import { useRouter } from "vue-router"
import { useUserStore } from "src/stores/user"
import { ref } from "vue"
import { useNotification } from "src/composables/notification"
import { Loading, LocalStorage } from "quasar"
import { useCommonStore } from "src/stores/common"
import { useUser } from "src/composables/user"
export default {
	setup() {
		const router = useRouter()
		const common_store = useCommonStore()
		const user_store = useUserStore()
		const key = ref(null)
		const { hasRole } = useUser()
		const { notifySuccess, notifyError } = useNotification()

		const onSubmit = async () => {
			if (!key.value) {
				notifyError("Введите ключ")
				return
			}

			Loading.show({ spinnerColor: "primary" })
			await user_store.login(key.value)
				.then((response) => {
					user_store.setUserData(response.data)

					common_store.setSelectedTable("sales")

					if (hasRole(4)) {
						common_store.setSelectedTable("sales")
					}

					if (hasRole(5)) {
						common_store.setSelectedTable("deals")
					}

					LocalStorage.set("api_token", response.data.api_token)
					notifySuccess("Добро пожаловать")
					router.push({ name: "home" })
				})
				.catch((error) => {
					let error_text = "Ошибка сервиса авторизации"

					if (error.response.status === 401)
						error_text = "Пользователь не найден"

					notifyError(error_text)
				})
			Loading.hide()
		}


		return {
			key,
			onSubmit
		}
	}
}
</script>
