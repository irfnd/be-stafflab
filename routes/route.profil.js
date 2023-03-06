const router = require("express").Router();
const auth = require("../middlewares/auth");
const { ProfilControllers } = require("../controllers");

router.route("/").get(auth, ProfilControllers.getProfil);

module.exports = router;
