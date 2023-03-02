const router = require("express").Router();
const auth = require("../middlewares/auth");
const { FileControllers } = require("../controllers");

router.route("/").get(auth, FileControllers.getAllFile).post(auth, FileControllers.uploadFile);
router.route("/:id").get(auth, FileControllers.getFile).patch(auth, FileControllers.updateFile).delete(auth, FileControllers.deleteFile);

module.exports = router;
