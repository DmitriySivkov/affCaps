import Echo from "laravel-echo"
import Pusher from "pusher-js"
import { api } from "src/boot/axios"

window.Pusher = Pusher
window.Pusher.logToConsole = true // todo - turn false on production

const echo = new Echo({
	broadcaster: "pusher",
	key: "local",
	wsHost: process.env.BACKEND_HOST,
	wsPort: 6001,
	forceTLS: false,
	disableStats: true,
	enabledTransports: ["ws"],
	authorizer: (channel, options) => {
		return {
			authorize: (socketId, callback) => {
				api.request({
					url: "broadcasting/auth",
					method: "post",
					baseURL: process.env.BACKEND_SERVER,
					data: {
						socket_id: socketId,
						channel_name: channel.name
					}
				})
					.then(response => {
						callback(false, response.data)
					})
					.catch(error => {
						callback(true, error)
					})
			}
		}
	},
})

echo.connector.pusher.connection.bind("connected", function() {
	window.Pusher.isConnected = true
})

echo.connector.pusher.connection.bind("disconnected", function(){
	window.Pusher.isConnected = false
})

export { echo }
