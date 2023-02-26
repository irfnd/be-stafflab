const router = require("express").Router();
const auth = require("../middlewares/auth");
const { DivisiControllers } = require("../controllers");

router.route("/").get(auth, DivisiControllers.getAllDivisi).post(auth, DivisiControllers.createDivisi);

router
	.route("/:id")
	.get(auth, DivisiControllers.getDivisi)
	.patch(auth, DivisiControllers.updateDivisi)
	.delete(auth, DivisiControllers.deleteDivisi);

module.exports = router;
