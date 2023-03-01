import { useDealsStore } from "src/stores/deals"

export const useDeals = () => {
	const deals_store = useDealsStore()

	const addDeal = (e) => {
		deals_store.commitDeals([
			{
				affiliate_id: e.model.affiliate.id,
				affiliate_info: "#" + e.model.affiliate.id + ": " + e.model.affiliate.fullname + " (" + e.model.affiliate.email + ")",
				amount: e.model.amount,
				comment: e.model.comment,
				country_id: e.model.country.id,
				country_iso: e.model.country.iso,
				country_name: e.model.country.en_name,
				created_at: e.model.created_at,
				deduction: e.model.deduction,
				experience: e.model.experience,
				funnel: e.model.funnel,
				id: e.model.id,
				manager_id: null,
				percent: e.model.percent,
				region: e.model.region.name,
				source: e.model.source,
				split: null,
				split_id: null,
				status_sale: e.model.status_sale,
				total_country_cap: e.total_country_cap.total_country_cap,
				total_country_reserved: e.total_country_reserved.total_country_reserved,
				updated_at: e.model.updated_at
			}
		])

		deals_store.commitRecountReservedCap({
			country_id: e.model.country.id,
			total_reserved: e.total_country_reserved.total_country_reserved
		})
	}


	return { addDeal }
}
