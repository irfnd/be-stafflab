const router = require("express").Router();

const defaultRoutes = [
	{ path: "/", route: require("./route.auth") },
	{ path: "/instansi", route: require("./route.instansi") },
	{ path: "/divisi", route: require("./route.divisi") },
	{ path: "/jabatan", route: require("./route.jabatan") },
	{ path: "/golongan", route: require("./route.golongan") },
	{ path: "*", route: require("./route.404") },
];

defaultRoutes.forEach((route) => {
	router.use(route.path, route.route);
});

module.exports = router;
