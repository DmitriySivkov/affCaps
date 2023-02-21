import { useCommonStore } from "src/stores/common"
import { api } from "src/boot/axios"

export default async({ store }) => {
	const common_store = useCommonStore(store)

	const response = await api.get("/affiliateCaps/countries")

	common_store.setCountries(response.data)
}
