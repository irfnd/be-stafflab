const router = require("express").Router();
const auth = require("../middlewares/auth");
const { GolonganControllers } = require("../controllers");

router.route("/").get(auth, GolonganControllers.getAllGolongan).post(auth, GolonganControllers.createGolongan);

router
	.route("/:id")
	.get(auth, GolonganControllers.getGolongan)
	.patch(auth, GolonganControllers.updateGolongan)
	.delete(auth, GolonganControllers.deleteGolongan);

module.exports = router;
