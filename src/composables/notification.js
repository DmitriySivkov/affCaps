import { Notify } from "quasar"

export const useNotification = () => {

	const notifySuccess = (message) => {
		return Notify.create({
			color: "green-4",
			textColor: "white",
			multiLine: true,
			icon: "cloud_done",
			message,
			position: "top-left"
		})
	}

	const notifyError = (message) => {
		return Notify.create({
			color: "red-5",
			textColor: "white",
			multiline: true,
			icon: "warning",
			message,
			position: "top-left",
		})
	}


	return { notifySuccess, notifyError }
}
