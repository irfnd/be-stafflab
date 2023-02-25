const router = require("express").Router();
const { Auth } = require("../controllers");

router.route("/login").post(Auth.login);

module.exports = router;
