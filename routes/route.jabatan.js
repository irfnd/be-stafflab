const router = require("express").Router();
const auth = require("../middlewares/auth");
const { JabatanControllers } = require("../controllers");

router.route("/").get(auth, JabatanControllers.getAllJabatan).post(auth, JabatanControllers.createJabatan);

router
	.route("/:id")
	.get(auth, JabatanControllers.getJabatan)
	.patch(auth, JabatanControllers.updateJabatan)
	.delete(auth, JabatanControllers.deleteJabatan);

module.exports = router;
