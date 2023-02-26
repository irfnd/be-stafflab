const router = require("express").Router();
const auth = require("../middlewares/auth");
const { TipePegawaiControllers } = require("../controllers");

router.route("/").get(auth, TipePegawaiControllers.getAllTipe);

router.route("/:id").get(auth, TipePegawaiControllers.getTipe);

module.exports = router;
