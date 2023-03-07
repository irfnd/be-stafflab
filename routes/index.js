const router = require("express").Router();

const routes = [
	{ path: "/", route: require("./route.auth") },
	{ path: "/tipe-pegawai", route: require("./route.tipePegawai") },
	{ path: "/status-pegawai", route: require("./route.statusPegawai") },
	{ path: "/instansi", route: require("./route.instansi") },
	{ path: "/divisi", route: require("./route.divisi") },
	{ path: "/jabatan", route: require("./route.jabatan") },
	{ path: "/golongan", route: require("./route.golongan") },
	{ path: "/pegawai", route: require("./route.pegawai") },
	{ path: "/pendidikan", route: require("./route.pendidikan") },
	{ path: "/mutasi", route: require("./route.mutasi") },
	{ path: "/file", route: require("./route.file") },
	{ path: "/profil", route: require("./route.profil") },
	{ path: "*", route: require("./route.404") },
];

routes?.forEach((route) => {
	router.use(route.path, route.route);
});

module.exports = router;
