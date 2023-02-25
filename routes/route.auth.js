const router = require("express").Router();
const { AuthControllers } = require("../controllers");

router.route("/login").post(AuthControllers.login);

module.exports = router;
