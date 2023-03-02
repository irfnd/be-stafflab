const router = require("express").Router();
const auth = require("../middlewares/auth");
const { FileControllers } = require("../controllers");

router.route("/").get(auth, FileControllers.getAllFile).post(auth, FileControllers.postFile);
router.route("/:id").get(auth, FileControllers.getFile);

module.exports = router;
