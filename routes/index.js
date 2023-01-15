const router = require("express").Router();

const defaultRoutes = [
	{ path: "/", route: require("./route.home") },
	{ path: "*", route: require("./route.404") },
];

defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

module.exports = router;
