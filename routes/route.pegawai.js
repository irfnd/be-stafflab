const router = require("express").Router();
const auth = require("../middlewares/auth");
const { PegawaiControllers } = require("../controllers");

router.route("/").get(auth, PegawaiControllers.getAllPegawai);
router.route("/:nip").get(auth, PegawaiControllers.getPegawai);

module.exports = router;
