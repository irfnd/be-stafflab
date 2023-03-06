const router = require("express").Router();
const auth = require("../middlewares/auth");
const { PegawaiControllers, ResetPasswordControllers } = require("../controllers");

router.route("/").get(auth, PegawaiControllers.getAllPegawai).post(auth, PegawaiControllers.createPegawai);
router.route("/reset-password/:nip").post(auth, ResetPasswordControllers.resetPasswordPegawai);
router
	.route("/:nip")
	.get(auth, PegawaiControllers.getPegawai)
	.patch(auth, PegawaiControllers.updatePegawai)
	.delete(auth, PegawaiControllers.deletePegawai);

module.exports = router;
