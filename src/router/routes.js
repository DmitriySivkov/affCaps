
const routes = [
	{
		path: "/",
		component: () => import("layouts/MainLayout.vue"),
		children: [
			{
				name: "home",
				path: "",
				component: () => import("src/pages/IndexPage.vue")
			},
			{
				name: "auth",
				path: "auth",
				component: () => import("src/pages/AuthPage.vue")
			}
		]
	},

	// Always leave this as last one,
	// but you can also remove it
	{
		path: "/:catchAll(.*)*",
		component: () => import("src/pages/ErrorNotFound.vue")
	}
]

export default routes
