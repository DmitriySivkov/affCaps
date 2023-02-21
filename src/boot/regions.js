import { useCommonStore } from "src/stores/common"
import { api } from "src/boot/axios"
import { useNotification } from "src/composables/notification"
import { Loading } from "quasar"

export default async({ store }) => {
	const common_store = useCommonStore(store)

	const response = await api.get("/affiliateCaps/regions")

	common_store.setRegions(response.data)

	const { notifySuccess } = useNotification()

	notifySuccess("Добро пожаловать")
	Loading.hide()
}
