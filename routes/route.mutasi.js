const router = require("express").Router();
const auth = require("../middlewares/auth");
const { MutasiControllers } = require("../controllers");

router.route("/").get(auth, MutasiControllers.getAllMutasi).post(auth, MutasiControllers.createMutasi);
router
	.route("/:id")
	.get(auth, MutasiControllers.getMutasi)
	.patch(auth, MutasiControllers.updateMutasi)
	.delete(auth, MutasiControllers.deleteMutasi);

module.exports = router;
