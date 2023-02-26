const router = require("express").Router();
const auth = require("../middlewares/auth");
const { StatusPegawaiControllers } = require("../controllers");

router.route("/").get(auth, StatusPegawaiControllers.getAllStatus);

router.route("/:id").get(auth, StatusPegawaiControllers.getStatus);

module.exports = router;
